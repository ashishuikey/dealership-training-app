import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('sales'); // 'admin' or 'sales'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatPhoneNumber = (value) => {
    // Only keep digits, no formatting with dashes
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10); // Max 10 digits
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP request for:', cleanPhone, 'Role:', role);
      const response = await axios.post('/api/auth/send-otp', {
        phoneNumber: cleanPhone,
        role: role
      });

      console.log('OTP Response:', response.data);

      if (response.data.success) {
        setStep('otp');
        setResendTimer(30);
        console.log('Successfully moved to OTP step');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      console.error('Error response:', error.response);
      
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(
          error.response?.data?.message || 
          'Failed to send OTP. Please check your phone number and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        otp: otp,
        role: role
      });

      if (response.data.success) {
        const userData = {
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          role: response.data.role,
          name: response.data.name,
          token: response.data.token
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      setError(
        error.response?.data?.message || 
        'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');

    try {
      console.log('Resending OTP for:', phoneNumber.replace(/\D/g, ''));
      const response = await axios.post('/api/auth/send-otp', {
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        role: role
      });

      console.log('Resend OTP Response:', response.data);

      if (response.data.success) {
        setResendTimer(30);
        setOtp('');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to resend OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setResendTimer(0);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🚗 AI Sales Coach</h2>
          <p>Luxury Hybrid Vehicle Training System</p>
        </div>

        {step === 'phone' ? (
          <form className="login-form" onSubmit={handlePhoneSubmit}>
            <div className="role-selection">
              <label className="role-label">Login as:</label>
              <div className="role-options">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="sales"
                    checked={role === 'sales'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="role-text">
                    <span className="role-icon">👤</span>
                    Sales Representative
                  </span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="role-text">
                    <span className="role-icon">🔧</span>
                    Administrator
                  </span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="text"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  className="phone-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
            >
              {loading ? '⏳ Sending OTP...' : '📱 Send OTP'}
            </button>

            <div className="login-info">
              <p>You will receive a 6-digit OTP on your registered phone number</p>
              <p style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '12px' }}>
                For testing: Use OTP <strong>123456</strong>
              </p>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleOtpSubmit}>
            <div className="otp-header">
              <h3>Enter Verification Code</h3>
              <p>OTP sent to +91 {phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
              <p style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '12px', margin: '8px 0' }}>
                Test OTP: <strong>123456</strong>
              </p>
              <button 
                type="button" 
                className="back-btn"
                onClick={handleBackToPhone}
              >
                ← Change Number
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="otp">6-Digit OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="123456"
                className="otp-input"
                required
                disabled={loading}
                maxLength="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading || otp.length !== 6}
            >
              {loading ? '⏳ Verifying...' : '✅ Verify & Login'}
            </button>

            <div className="resend-container">
              {resendTimer > 0 ? (
                <p>Resend OTP in {resendTimer}s</p>
              ) : (
                <button 
                  type="button" 
                  className="resend-btn"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  🔄 Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;