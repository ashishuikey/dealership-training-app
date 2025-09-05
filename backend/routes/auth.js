const express = require('express');
const router = express.Router();

// In-memory storage for OTPs and user data (in production, use a proper database)
const otpStorage = new Map(); // phoneNumber -> { otp, role, timestamp, attempts }
const userDatabase = {
  // Predefined users - in production, this would be in a database
  admin: {
    '9876543210': { name: 'Admin User', role: 'admin', active: true },
    '9876543211': { name: 'Super Admin', role: 'admin', active: true }
  },
  sales: {
    '9876543212': { name: 'Raj Kumar', role: 'sales', active: true },
    '9876543213': { name: 'Priya Sharma', role: 'sales', active: true },
    '9876543214': { name: 'Amit Singh', role: 'sales', active: true },
    '9876543215': { name: 'Sneha Patel', role: 'sales', active: true }
  }
};

// Generate 6-digit OTP (using dummy OTP for testing)
function generateOTP() {
  // For development/testing, return fixed OTP
  return '123456';
  // In production, use: return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock SMS sending function (in production, integrate with SMS service like Twilio)
function sendSMS(phoneNumber, otp) {
  console.log(`[SMS] Sending OTP ${otp} to +91${phoneNumber}`);
  // In production, implement actual SMS sending here
  return Promise.resolve(true);
}

// Validate phone number
function isValidPhoneNumber(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

// Check if user exists and is active
function validateUser(phoneNumber, role) {
  const users = userDatabase[role];
  if (!users || !users[phoneNumber]) {
    return { valid: false, error: 'User not found for this role' };
  }
  
  const user = users[phoneNumber];
  if (!user.active) {
    return { valid: false, error: 'User account is inactive' };
  }
  
  return { valid: true, user };
}

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber, role } = req.body;
    
    // Validate input
    if (!phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and role are required'
      });
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }
    
    if (!['admin', 'sales'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    // Validate user exists
    const userValidation = validateUser(phoneNumber, role);
    if (!userValidation.valid) {
      return res.status(401).json({
        success: false,
        message: userValidation.error
      });
    }
    
    // Check rate limiting (prevent too frequent OTP requests)
    const existingOtp = otpStorage.get(phoneNumber);
    if (existingOtp && (Date.now() - existingOtp.timestamp) < 30000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 30 seconds before requesting another OTP'
      });
    }
    
    // Generate and store OTP
    const otp = generateOTP();
    otpStorage.set(phoneNumber, {
      otp,
      role,
      timestamp: Date.now(),
      attempts: 0
    });
    
    // Auto-expire OTP after 5 minutes
    setTimeout(() => {
      otpStorage.delete(phoneNumber);
    }, 5 * 60 * 1000);
    
    // Send SMS (mock)
    await sendSMS(phoneNumber, otp);
    
    console.log(`OTP ${otp} generated for ${phoneNumber} (${role})`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully (Use: 123456)',
      // Always include dummy OTP in response for testing
      otp: otp
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  try {
    const { phoneNumber, otp, role } = req.body;
    
    // Validate input
    if (!phoneNumber || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, OTP, and role are required'
      });
    }
    
    // Get stored OTP data
    const storedOtpData = otpStorage.get(phoneNumber);
    if (!storedOtpData) {
      return res.status(401).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      });
    }
    
    // Check attempts limit
    if (storedOtpData.attempts >= 3) {
      otpStorage.delete(phoneNumber);
      return res.status(401).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.'
      });
    }
    
    // Verify OTP and role
    if (storedOtpData.otp !== otp || storedOtpData.role !== role) {
      storedOtpData.attempts++;
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 3 - storedOtpData.attempts
      });
    }
    
    // Validate user still exists and is active
    const userValidation = validateUser(phoneNumber, role);
    if (!userValidation.valid) {
      return res.status(401).json({
        success: false,
        message: userValidation.error
      });
    }
    
    // Clear OTP from storage
    otpStorage.delete(phoneNumber);
    
    // Generate session token (in production, use JWT or proper session management)
    const token = `${phoneNumber}_${role}_${Date.now()}`;
    
    // Return user data
    const user = userValidation.user;
    res.json({
      success: true,
      message: 'Login successful',
      role: user.role,
      name: user.name,
      phoneNumber,
      token
    });
    
    console.log(`User ${user.name} (${phoneNumber}) logged in as ${role}`);
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In production, invalidate the token/session
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get user profile endpoint
router.get('/profile', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  // Simple token validation (in production, use proper JWT validation)
  const [phoneNumber, role] = token.split('_');
  const userValidation = validateUser(phoneNumber, role);
  
  if (!userValidation.valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
  
  res.json({
    success: true,
    user: {
      phoneNumber,
      role: userValidation.user.role,
      name: userValidation.user.name,
      active: userValidation.user.active
    }
  });
});

// Admin endpoint to list all users
router.get('/users', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  // Verify admin access
  const [phoneNumber, role] = token.split('_');
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  const userValidation = validateUser(phoneNumber, 'admin');
  if (!userValidation.valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin token'
    });
  }
  
  // Return all users
  const allUsers = [];
  Object.entries(userDatabase.admin).forEach(([phone, user]) => {
    allUsers.push({ phoneNumber: phone, ...user });
  });
  Object.entries(userDatabase.sales).forEach(([phone, user]) => {
    allUsers.push({ phoneNumber: phone, ...user });
  });
  
  res.json({
    success: true,
    users: allUsers
  });
});

module.exports = router;