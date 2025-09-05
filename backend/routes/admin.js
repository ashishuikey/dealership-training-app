const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
      'text/plain',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(txt|csv)$/)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  }
});

// Validate admin token
const validateAdmin = (req, res, next) => {
  const token = req.body.token || req.query.token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  // Simple token validation (in production, use proper JWT validation)
  const [phoneNumber, role] = token.split('_');
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  req.adminUser = { phoneNumber, role };
  next();
};

// Enhanced vehicle data extraction with cleaner output
const extractVehicleDataFromText = (text, filename) => {
  console.log('\n=== EXTRACTION DEBUG ===');
  console.log(`Processing file: ${filename}`);
  console.log(`Raw text length: ${text ? text.length : 0}`);
  console.log(`Full raw text:`);
  console.log('"' + (text || '').substring(0, 1000) + '"');
  console.log('=== END FULL TEXT ===\n');
  
  // Keep original text for certain extractions
  const originalText = text || '';
  // Clean text for pattern matching
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Initialize vehicle data object
  const vehicleData = {
    name: '',
    category: '',
    year: '',
    price: '',
    msrp: '',
    dealerCost: '',
    engine: '',
    horsepower: '',
    torque: '',
    cityMPG: '',
    highwayMPG: '',
    combinedMPG: '',
    transmission: '',
    drivetrain: '',
    fuelType: '',
    seatingCapacity: '',
    features: [],
    description: '',
    confidence: 0
  };
  
  let confidence = 0;
  
  // Extract year first (more reliable pattern)
  const yearMatch = originalText.match(/\b(20[1-2][0-9]|19[8-9][0-9])\b/);
  if (yearMatch) {
    vehicleData.year = yearMatch[1];
    confidence += 10;
  }
  
  // If text is too short or looks corrupted, return minimal extraction
  if (!originalText || originalText.length < 10) {
    console.log('Text too short or empty, returning minimal extraction');
    return vehicleData;
  }
  
  // Extract vehicle make and model - greatly improved with debugging
  console.log('=== NAME EXTRACTION DEBUG ===');
  const lines = originalText.split('\n').filter(line => line.trim());
  console.log('Text lines:', lines.slice(0, 5)); // Show first 5 lines
  let vehicleName = '';
  
  // List of known vehicle makes
  const knownMakes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Audi', 'Volkswagen',
    'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Acura', 'Infiniti', 'Genesis', 'Volvo',
    'Jaguar', 'Land Rover', 'Range Rover', 'Porsche', 'Tesla', 'Rivian', 'Lucid', 'GMC', 'Ram', 'Dodge',
    'Chrysler', 'Jeep', 'Buick', 'Cadillac', 'Lincoln', 'Mini', 'Fiat', 'Alfa Romeo',
    'Maserati', 'Ferrari', 'Lamborghini', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren',
    'Bugatti', 'Maruti', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Renault', 'Skoda', 'MG', 'Citroen', 'Peugeot'
  ];
  
  // First strategy: Check if first few lines contain a vehicle name
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    console.log(`Checking line ${i + 1}: "${line}"`);
    
    // Skip lines that are clearly not vehicle names
    if (line.length < 3 || line.length > 100) {
      console.log(`  Skipped - invalid length: ${line.length}`);
      continue;
    }
    if (/^(price|msrp|category|engine|year|model|vehicle|car):/i.test(line)) {
      console.log(`  Skipped - metadata line`);
      continue;
    }
    
    // Check if this line contains a known make (with OCR corruption handling)
    for (const make of knownMakes) {
      const makeWords = make.toLowerCase().split(' ');
      const lineClean = line.toLowerCase().replace(/\s+/g, ' ');
      
      // Exact match first
      if (lineClean.includes(make.toLowerCase())) {
        console.log(`  Found exact make "${make}" in line!`);
        vehicleName = line;
        confidence += 20;
      }
      // Fuzzy match for OCR corruption (spaces between characters)
      else if (makeWords.length === 1) {
        const makeChars = make.toLowerCase().split('');
        const fuzzyPattern = makeChars.join('\\s*');
        const fuzzyRegex = new RegExp(fuzzyPattern, 'i');
        
        console.log(`    Testing fuzzy pattern for "${make}": ${fuzzyPattern}`);
        
        if (fuzzyRegex.test(lineClean)) {
          console.log(`  Found fuzzy make "${make}" in line (OCR corrupted)!`);
          // Reconstruct the name by removing excessive spaces
          vehicleName = line.replace(/(\w)\s+(\w)/g, '$1$2');
          confidence += 15; // Lower confidence for fuzzy match
        } else {
          // Alternative approach: check if most characters of the make appear in order
          const makeCharsInOrder = makeChars.filter((char, index) => {
            const charIndex = lineClean.indexOf(char, index > 0 ? lineClean.indexOf(makeChars[index - 1]) + 1 : 0);
            return charIndex !== -1;
          });
          
          if (makeCharsInOrder.length >= make.length * 0.7) { // 70% of characters match in order
            console.log(`  Found fuzzy make "${make}" via character order match!`);
            vehicleName = line.replace(/(\w)\s+(\w)/g, '$1$2');
            confidence += 10; // Even lower confidence for this match
          }
        }
      }
      
      if (vehicleName) {
        // Clean up: remove year if present
        vehicleName = vehicleName.replace(/\b(20[0-9]{2}|19[8-9][0-9])\b/g, '').trim();
        // Remove extra whitespace but preserve word boundaries
        vehicleName = vehicleName.replace(/\s+/g, ' ');
        console.log(`  Set vehicle name: "${vehicleName}"`);
        break;
      }
    }
    if (vehicleName) break;
  }
  
  console.log(`Strategy 1 result: "${vehicleName}"`);
  console.log('=== END NAME EXTRACTION ===');
  
  // Second strategy: Look for explicit patterns
  if (!vehicleName) {
    const namePatterns = [
      // Look for "Vehicle: Name" or "Model: Name" or "Car: Name"
      /(?:vehicle|model|car|name)\s*[:\-]\s*([^\n]+)/i,
      // Look for known make followed by model names
      new RegExp(`\\b(${knownMakes.join('|')})\\s+([A-Za-z0-9]+(?:\\s+[A-Za-z0-9]+)*)`, 'i'),
      // Year Make Model pattern
      /\b(20[0-9]{2}|19[8-9][0-9])\s+([A-Z][a-z]+(?:\s+[A-Za-z]+)+)/
    ];
    
    for (const pattern of namePatterns) {
      const match = originalText.match(pattern);
      if (match) {
        if (pattern.source.includes('vehicle|model|car')) {
          // Pattern 1: direct name after label
          vehicleName = match[1].trim();
        } else if (match[2]) {
          // Pattern 2 or 3: has make and model
          if (/^\d{4}$/.test(match[1])) {
            // Year is first, take the rest
            vehicleName = match[2].trim();
          } else {
            // Make is first
            vehicleName = `${match[1]} ${match[2]}`.trim();
          }
        } else {
          vehicleName = match[1].trim();
        }
        confidence += 15;
        break;
      }
    }
  }
  
  // Clean up and format the vehicle name
  if (vehicleName) {
    // Remove trailing punctuation
    vehicleName = vehicleName.replace(/[.,;:!?\-]+$/, '').trim();
    // Remove quotes
    vehicleName = vehicleName.replace(/["']/g, '');
    // Clean extra spaces
    vehicleName = vehicleName.replace(/\s+/g, ' ');
    
    // Proper capitalization
    vehicleName = vehicleName.split(' ').map(word => {
      // Keep certain words as-is if they're all caps and short (like GT, RS, AMG)
      if (word.length <= 3 && word === word.toUpperCase() && /[A-Z]/.test(word)) {
        return word;
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    vehicleData.name = vehicleName;
  }
  
  // Extract category with better detection
  const categoryPatterns = {
    'SUV': /\b(suv|sport utility|crossover|cuv)\b/i,
    'Sedan': /\b(sedan|saloon)\b/i,
    'Truck': /\b(truck|pickup|pick-up)\b/i,
    'Coupe': /\b(coupe|coup[eé]|2-door|two-door)\b/i,
    'Wagon': /\b(wagon|estate|touring)\b/i,
    'Van': /\b(van|minivan|mini-van)\b/i,
    'Convertible': /\b(convertible|cabriolet|roadster|spider)\b/i,
    'Hatchback': /\b(hatchback|hatch|3-door|three-door|5-door|five-door)\b/i,
    'Electric': /\b(electric vehicle|ev\b|bev|electric car)\b/i,
    'Hybrid': /\b(hybrid|phev|plug-in)\b/i,
    'Luxury': /\b(luxury|premium|executive)\b/i
  };
  
  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(cleanText)) {
      vehicleData.category = category;
      confidence += 10;
      break;
    }
  }
  
  // Extract prices - support both USD and INR
  const priceValue = (str) => {
    if (!str) return 0;
    // Remove currency symbols and commas, but keep numbers and decimal
    const cleaned = str.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };
  
  // Enhanced price patterns for Indian and international formats (including OCR corruption)
  const pricePatterns = [
    // Indian format: ₹15,11,000 or Price: ₹15,11,000
    /(?:price|cost|value)[:\s]*₹?\s*([0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})/i,
    // OCR corrupted: Pr ice: ₹ 15 , 11 , 000 (spaces between characters)
    /(?:pr\s*ice|co\s*st|va\s*lue)[:\s]*₹?\s*([0-9\s,]+)/i,
    // Standard format: Price: $50,000
    /(?:price|cost|value)[:\s]*[\$₹]?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i,
    // Currency symbol first: ₹15,11,000 or $50,000
    /₹\s*([0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})/,
    // OCR corrupted currency: ₹ 15 , 11 , 000 (with spaces)
    /₹\s*([0-9\s,]+)/,
    /[\$]\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/,
    // Number followed by currency: 1511000 INR
    /([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?)\s*(?:USD|INR|Rs\.?)/i,
    // Standalone large numbers (6+ digits)
    /(?:^|\s)([0-9]{6,}(?:,[0-9]{3})*(?:\.[0-9]{2})?)(?:\s|$)/
  ];
  
  console.log('=== PRICE EXTRACTION DEBUG ===');
  
  // Try each pattern to find prices
  let foundPrice = false;
  for (let i = 0; i < pricePatterns.length && !foundPrice; i++) {
    const pattern = pricePatterns[i];
    console.log(`Testing price pattern ${i + 1}: ${pattern}`);
    
    const matches = [...originalText.matchAll(new RegExp(pattern, 'g'))];
    console.log(`Found ${matches.length} matches`);
    
    for (const match of matches) {
      console.log(`Match: "${match[0]}" -> extracted: "${match[1]}"`);
      const val = priceValue(match[1]);
      console.log(`Parsed value: ${val}`);
      
      if (val > 10000 && !vehicleData.price) {
        vehicleData.price = val.toString();
        confidence += 15;
        console.log(`✓ Set price to: ${val}`);
        foundPrice = true;
        break;
      }
    }
  }
  
  // Look for MSRP with enhanced patterns
  const msrpPatterns = [
    /(?:msrp|sticker)[:\s]*₹?\s*([0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})/i,
    /(?:msrp|sticker)[:\s]*[\$₹]?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i
  ];
  
  for (const pattern of msrpPatterns) {
    const msrpMatch = originalText.match(pattern);
    if (msrpMatch) {
      vehicleData.msrp = priceValue(msrpMatch[1]).toString();
      confidence += 10;
      console.log(`Found MSRP: ${vehicleData.msrp}`);
      break;
    }
  }
  
  // If no MSRP found but we have price, use price as MSRP
  if (!vehicleData.msrp && vehicleData.price) {
    vehicleData.msrp = vehicleData.price;
    console.log(`Using price as MSRP: ${vehicleData.msrp}`);
  }
  
  // Look for dealer cost
  const dealerPatterns = [
    /(?:dealer|invoice|wholesale)[:\s]*₹?\s*([0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})/i,
    /(?:dealer|invoice|wholesale)[:\s]*[\$₹]?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i
  ];
  
  for (const pattern of dealerPatterns) {
    const dealerMatch = originalText.match(pattern);
    if (dealerMatch) {
      vehicleData.dealerCost = priceValue(dealerMatch[1]).toString();
      confidence += 5;
      console.log(`Found dealer cost: ${vehicleData.dealerCost}`);
      break;
    }
  }
  
  // Calculate dealer cost if not found (92% of MSRP)
  if (!vehicleData.dealerCost && vehicleData.msrp) {
    const msrpNum = parseFloat(vehicleData.msrp);
    vehicleData.dealerCost = Math.round(msrpNum * 0.92).toString();
    console.log(`Calculated dealer cost: ${vehicleData.dealerCost}`);
  }
  
  console.log('=== END PRICE EXTRACTION ===');
  
  // Extract engine - cleaner patterns
  const engineMatch = originalText.match(/([0-9]\.?[0-9]?)\s*(?:L|liter|litre)(?:\s+V([468]))?/i) ||
                     originalText.match(/V([468])\s+([0-9]\.?[0-9]?)\s*(?:L|liter)?/i);
  
  if (engineMatch) {
    if (engineMatch[1] && engineMatch[2]) {
      vehicleData.engine = `${engineMatch[1]}L V${engineMatch[2]}`;
    } else if (engineMatch[1]) {
      vehicleData.engine = `${engineMatch[1]}L`;
    }
    confidence += 10;
  } else if (/electric/i.test(cleanText)) {
    vehicleData.engine = 'Electric Motor';
    vehicleData.fuelType = 'Electric';
    confidence += 10;
  } else if (/hybrid/i.test(cleanText)) {
    vehicleData.engine = 'Hybrid';
    vehicleData.fuelType = 'Hybrid';
    confidence += 10;
  }
  
  // Extract horsepower - cleaner
  const hpMatch = originalText.match(/([0-9]+)\s*(?:hp|horsepower|bhp)/i);
  if (hpMatch) {
    vehicleData.horsepower = hpMatch[1];
    confidence += 8;
  }
  
  // Extract torque - cleaner
  const torqueMatch = originalText.match(/([0-9]+)\s*(?:lb[\s\-]?ft|pound[\s\-]?feet)/i);
  if (torqueMatch) {
    vehicleData.torque = torqueMatch[1];
    confidence += 8;
  }
  
  // Extract MPG - improved patterns
  const mpgCombined = originalText.match(/([0-9]+)\s*\/\s*([0-9]+)\s*(?:mpg|city\/hwy)/i);
  if (mpgCombined) {
    vehicleData.cityMPG = mpgCombined[1];
    vehicleData.highwayMPG = mpgCombined[2];
    // Calculate combined
    const city = parseInt(mpgCombined[1]);
    const hwy = parseInt(mpgCombined[2]);
    vehicleData.combinedMPG = Math.round(city * 0.55 + hwy * 0.45).toString();
    confidence += 15;
  } else {
    // Try individual patterns
    const cityMatch = originalText.match(/([0-9]+)\s*(?:city|urban)\s*mpg/i);
    const hwyMatch = originalText.match(/([0-9]+)\s*(?:highway|hwy)\s*mpg/i);
    
    if (cityMatch) {
      vehicleData.cityMPG = cityMatch[1];
      confidence += 5;
    }
    if (hwyMatch) {
      vehicleData.highwayMPG = hwyMatch[1];
      confidence += 5;
    }
  }
  
  // Extract transmission - simplified
  const transMatch = originalText.match(/([0-9]+)[\s\-]?speed/i) ||
                    originalText.match(/(automatic|manual|cvt)/i);
  if (transMatch) {
    vehicleData.transmission = transMatch[0];
    confidence += 5;
  }
  
  // Extract drivetrain
  const driveMatch = originalText.match(/\b(FWD|RWD|AWD|4WD|front[\s\-]wheel|rear[\s\-]wheel|all[\s\-]wheel|4x4)\b/i);
  if (driveMatch) {
    vehicleData.drivetrain = driveMatch[1].toUpperCase().replace(/[\s\-]WHEEL/i, '');
    confidence += 5;
  }
  
  // Extract seating
  const seatMatch = originalText.match(/([0-9])\s*(?:seat|passenger|person)/i);
  if (seatMatch) {
    vehicleData.seatingCapacity = seatMatch[1];
    confidence += 5;
  }
  
  // Extract key features (limit to important ones)
  const importantFeatures = [
    'leather', 'sunroof', 'navigation', 'bluetooth',
    'backup camera', 'blind spot', 'adaptive cruise',
    'heated seats', 'apple carplay', 'android auto'
  ];
  
  vehicleData.features = [];
  for (const feature of importantFeatures) {
    if (cleanText.toLowerCase().includes(feature)) {
      vehicleData.features.push(feature.split(' ').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' '));
    }
  }
  
  // Generate clean description (avoid garbage text)
  // Only use sentences that contain vehicle-related keywords
  const sentences = originalText.split(/[.!?]+/).filter(s => {
    const sent = s.toLowerCase();
    return s.length > 20 && s.length < 200 && (
      sent.includes('vehicle') ||
      sent.includes('car') ||
      sent.includes('engine') ||
      sent.includes('feature') ||
      sent.includes('performance') ||
      sent.includes('comfort') ||
      sent.includes('design') ||
      sent.includes('equipped') ||
      sent.includes('offers') ||
      sent.includes('provides')
    );
  });
  
  if (sentences.length > 0) {
    vehicleData.description = sentences[0].trim();
  } else {
    // Create a simple description from extracted data
    if (vehicleData.name && vehicleData.year) {
      vehicleData.description = `${vehicleData.year} ${vehicleData.name}`;
      if (vehicleData.engine) {
        vehicleData.description += ` with ${vehicleData.engine} engine`;
      }
      if (vehicleData.category) {
        vehicleData.description += `. Category: ${vehicleData.category}`;
      }
    }
  }
  
  // Calculate final confidence score
  vehicleData.confidence = Math.min(100, confidence);
  
  // Clean up empty fields - don't use 'NA', leave empty for user to fill
  Object.keys(vehicleData).forEach(key => {
    if (key !== 'confidence' && key !== 'features' && !vehicleData[key]) {
      vehicleData[key] = '';
    }
  });
  
  console.log('\n=== FINAL EXTRACTION RESULT ===');
  console.log('Vehicle Name:', vehicleData.name);
  console.log('Price:', vehicleData.price);
  console.log('MSRP:', vehicleData.msrp);
  console.log('Year:', vehicleData.year);
  console.log('Confidence:', vehicleData.confidence);
  console.log('Full data:', JSON.stringify(vehicleData, null, 2));
  console.log('=== END RESULT ===\n');
  return vehicleData;
};

// Process different file types
const processFile = async (file) => {
  const filePath = file.path;
  const fileType = file.mimetype;
  let extractedText = '';
  
  try {
    // Handle text files
    if (fileType === 'text/plain' || file.originalname.endsWith('.txt')) {
      const buffer = await fs.readFile(filePath);
      extractedText = buffer.toString('utf-8');
      
    } else if (fileType === 'text/csv' || file.originalname.endsWith('.csv')) {
      const buffer = await fs.readFile(filePath);
      extractedText = buffer.toString('utf-8');
      
    } else if (fileType.startsWith('image/')) {
      // Use OCR to extract text from images
      console.log(`Processing image with OCR: ${file.originalname}`);
      
      try {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        try {
          // Configure OCR for better accuracy
          const { data: { text } } = await worker.recognize(filePath, {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,/$₹-:',
            preserve_interword_spaces: '1'
          });
          extractedText = text || '';
          console.log(`OCR extracted text (first 500 chars):`, extractedText.substring(0, 500));
          console.log(`OCR extracted text length: ${extractedText.length}`);
          
          // Check for OCR corruption patterns
          const isCorrupted = (
            extractedText.length < 20 ||
            /^[A-Z][a-z]\s+\d+\s+\d+\s+[A-Z][a-z]$/.test(extractedText.trim()) ||
            // Pattern like "To 28 1462 To" (fragmented words + numbers)
            /^[A-Z][a-z]{1,2}\s+\d+\s+\d+\s+[A-Z][a-z]{1,2}$/.test(extractedText.trim()) ||
            // Too many isolated single characters
            (extractedText.split(' ').filter(word => word.length === 1).length > extractedText.split(' ').length * 0.3) ||
            // Too many pure numbers without context
            (extractedText.split(' ').filter(word => /^\d+$/.test(word)).length > extractedText.split(' ').length * 0.4)
          );
          
          if (isCorrupted) {
            console.warn('OCR produced corrupted output:', extractedText.substring(0, 100));
            console.warn('Falling back to template-based input');
            // Instead of returning empty, we'll let the extraction function handle it
            // and provide better debugging info
          }
        } finally {
          await worker.terminate();
        }
      } catch (ocrError) {
        console.error('OCR error:', ocrError);
        extractedText = '';
      }
      
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      // Process Excel files
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Convert to text for processing
      extractedText = jsonData.map(row => row.join(' ')).join('\n');
      
    } else if (fileType.includes('word') || fileType.includes('document')) {
      // Process Word documents
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
      
    } else if (fileType === 'application/pdf') {
      // Process PDF files
      const buffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
      
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    // Extract vehicle data using improved processing
    const vehicleData = extractVehicleDataFromText(extractedText, file.originalname);
    return vehicleData;
    
  } catch (error) {
    console.error(`Error processing file ${file.originalname}:`, error);
    throw error;
  } finally {
    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting uploaded file:', unlinkError);
    }
  }
};

// Main endpoint for processing vehicle files
router.post('/process-vehicle-files', validateAdmin, upload.array('files', 10), async (req, res) => {
  try {
    console.log('Processing vehicle files endpoint hit');
    console.log(`Admin ${req.adminUser.phoneNumber} uploading ${req.files?.length || 0} files`);
    console.log('Files received:', req.files?.map(f => ({ name: f.originalname, type: f.mimetype, size: f.size })));
    
    if (!req.files || req.files.length === 0) {
      console.error('No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const extractedData = [];
    const errors = [];
    
    // Process each uploaded file
    for (const file of req.files) {
      try {
        console.log(`Processing file: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
        console.log(`File path: ${file.path}`);
        const vehicleData = await processFile(file);
        console.log(`Successfully processed ${file.originalname}`);
        extractedData.push(vehicleData);
      } catch (error) {
        console.error(`Failed to process ${file.originalname}:`, error.stack || error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }
    
    // Return results
    res.json({
      success: true,
      message: `Processed ${extractedData.length} files successfully`,
      extractedData,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        totalFiles: req.files.length,
        successfulExtractions: extractedData.length,
        failures: errors.length
      }
    });
    
  } catch (error) {
    console.error('File processing error:', error.stack || error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to process files',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint to save extracted vehicle data to the products database
router.post('/save-vehicle', validateAdmin, async (req, res) => {
  try {
    const vehicleData = req.body.vehicleData;
    
    if (!vehicleData) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle data is required'
      });
    }
    
    // Load existing products from JSON
    const productsPath = path.join(__dirname, '../data/products.json');
    let existingProducts = [];
    
    try {
      const productsContent = await fs.readFile(productsPath, 'utf-8');
      existingProducts = JSON.parse(productsContent);
    } catch (error) {
      console.error('Error loading existing products, starting with empty array:', error);
    }
    
    // Create new product entry
    const newProduct = {
      id: Date.now(),
      name: vehicleData.name || 'New Vehicle',
      category: vehicleData.category || 'Sedan',
      price: vehicleData.price || '0',
      originalPrice: vehicleData.originalPrice || vehicleData.msrp || vehicleData.price || '0',
      dealerCost: vehicleData.dealerCost || '0',
      specs: {
        engine: vehicleData.specs?.engine || vehicleData.engine || '',
        horsepower: vehicleData.specs?.horsepower || vehicleData.horsepower || '',
        torque: vehicleData.specs?.torque || vehicleData.torque || '',
        transmission: vehicleData.specs?.transmission || vehicleData.transmission || '',
        drivetrain: vehicleData.specs?.drivetrain || vehicleData.drivetrain || '',
        fuelType: vehicleData.specs?.fuelType || vehicleData.fuelType || 'Gasoline',
        seatingCapacity: vehicleData.specs?.seatingCapacity || vehicleData.seatingCapacity || '5'
      },
      mileage: {
        city: vehicleData.mileage?.city || vehicleData.cityMPG || '',
        highway: vehicleData.mileage?.highway || vehicleData.highwayMPG || '',
        combined: vehicleData.mileage?.combined || vehicleData.combinedMPG || ''
      },
      features: vehicleData.features || [],
      description: vehicleData.description || '',
      image: vehicleData.image || `/images/products/${(vehicleData.name || 'vehicle').toLowerCase().replace(/\s+/g, '-')}.jpg`
    };
    
    // Add to products array
    existingProducts.unshift(newProduct); // Add to beginning of array
    
    // Write back to JSON file
    await fs.writeFile(productsPath, JSON.stringify(existingProducts, null, 2), 'utf-8');
    
    console.log('Saved vehicle to products:', newProduct);
    
    res.json({
      success: true,
      message: 'Vehicle data saved successfully',
      vehicleId: newProduct.id
    });
    
  } catch (error) {
    console.error('Save vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save vehicle data',
      error: error.message
    });
  }
});

// Endpoint to get upload statistics
router.get('/upload-stats', validateAdmin, async (req, res) => {
  try {
    // In a real application, you would query the database for actual statistics
    res.json({
      success: true,
      stats: {
        totalUploads: 42,
        successfulExtractions: 38,
        failedExtractions: 4,
        avgConfidenceScore: 78,
        lastUploadDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload statistics'
    });
  }
});

// Function to extract text from webpage
const extractTextFromWebpage = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script, style, noscript, iframe').remove();
    
    // Extract text from common vehicle data elements
    let extractedText = '';
    
    // Try to get title
    const title = $('h1').first().text() || $('title').text() || '';
    extractedText += title + '\n';
    
    // Look for price information
    $('[class*="price"], [id*="price"], [data-price]').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length < 100) {
        extractedText += text + '\n';
      }
    });
    
    // Look for specification tables
    $('table').each((i, elem) => {
      $(elem).find('tr').each((j, row) => {
        const text = $(row).text().replace(/\s+/g, ' ').trim();
        if (text && text.length < 200) {
          extractedText += text + '\n';
        }
      });
    });
    
    // Look for spec lists
    $('ul, ol').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length < 500 && (
        text.toLowerCase().includes('mpg') ||
        text.toLowerCase().includes('engine') ||
        text.toLowerCase().includes('horsepower') ||
        text.toLowerCase().includes('transmission')
      )) {
        extractedText += text + '\n';
      }
    });
    
    // Get relevant paragraphs
    $('p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 20 && text.length < 300 && (
        text.toLowerCase().includes('vehicle') ||
        text.toLowerCase().includes('car') ||
        text.toLowerCase().includes('engine') ||
        text.toLowerCase().includes('mpg') ||
        text.toLowerCase().includes('price')
      )) {
        extractedText += text + '\n';
      }
    });
    
    // Look for specific vehicle-related classes
    const vehicleSelectors = [
      '.specs', '.specifications', '.features', '.vehicle-info',
      '.car-details', '.product-details', '.tech-specs',
      '[class*="mpg"]', '[class*="engine"]', '[class*="horsepower"]',
      '[class*="transmission"]', '[class*="drivetrain"]'
    ];
    
    vehicleSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length < 500) {
          extractedText += text + '\n';
        }
      });
    });
    
    return extractedText;
  } catch (error) {
    console.error('Error fetching webpage:', error.message);
    throw error;
  }
};

// Endpoint to process URL and extract vehicle data
router.post('/process-url', validateAdmin, async (req, res) => {
  try {
    console.log('Process URL endpoint hit');
    console.log('Request body:', req.body);
    const { url } = req.body;
    
    if (!url) {
      console.error('No URL provided in request');
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }
    
    console.log('Processing URL:', url);
    
    // Extract text from webpage
    const webpageText = await extractTextFromWebpage(url);
    
    if (!webpageText || webpageText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No content could be extracted from the URL'
      });
    }
    
    // Extract vehicle data using the improved extraction function
    const vehicleData = extractVehicleDataFromText(webpageText, url);
    
    // Add source URL to the data
    vehicleData.sourceUrl = url;
    vehicleData.sourceType = 'URL';
    
    res.json({
      success: true,
      message: 'URL processed successfully',
      data: vehicleData,
      extractedTextLength: webpageText.length
    });
    
  } catch (error) {
    console.error('URL processing error:', error.stack || error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      url: req.body.url,
      stack: error.stack
    });
    
    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({
        success: false,
        message: 'Website not found. Please check the URL.'
      });
    }
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Request timed out. The website took too long to respond.'
      });
    }
    
    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'Access denied by the website. The site may be blocking automated requests.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process URL',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint to edit existing vehicle in inventory
router.put('/update-vehicle/:id', validateAdmin, async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    const updatedData = req.body.vehicleData;
    
    if (!updatedData) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle data is required'
      });
    }
    
    // Load existing products from JSON
    const productsPath = path.join(__dirname, '../data/products.json');
    let existingProducts = [];
    
    try {
      const productsContent = await fs.readFile(productsPath, 'utf-8');
      existingProducts = JSON.parse(productsContent);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error loading product data'
      });
    }
    
    // Find the vehicle to update
    const vehicleIndex = existingProducts.findIndex(p => p.id === vehicleId);
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    // Update the vehicle data
    existingProducts[vehicleIndex] = {
      ...existingProducts[vehicleIndex],
      name: updatedData.name || existingProducts[vehicleIndex].name,
      category: updatedData.category || existingProducts[vehicleIndex].category,
      price: updatedData.price || existingProducts[vehicleIndex].price,
      originalPrice: updatedData.originalPrice || updatedData.msrp || updatedData.price || existingProducts[vehicleIndex].originalPrice,
      dealerCost: updatedData.dealerCost || existingProducts[vehicleIndex].dealerCost,
      specs: {
        ...existingProducts[vehicleIndex].specs,
        engine: updatedData.specs?.engine || updatedData.engine || existingProducts[vehicleIndex].specs?.engine,
        horsepower: updatedData.specs?.horsepower || updatedData.horsepower || existingProducts[vehicleIndex].specs?.horsepower,
        torque: updatedData.specs?.torque || updatedData.torque || existingProducts[vehicleIndex].specs?.torque,
        transmission: updatedData.specs?.transmission || updatedData.transmission || existingProducts[vehicleIndex].specs?.transmission,
        drivetrain: updatedData.specs?.drivetrain || updatedData.drivetrain || existingProducts[vehicleIndex].specs?.drivetrain,
        fuelType: updatedData.specs?.fuelType || updatedData.fuelType || existingProducts[vehicleIndex].specs?.fuelType,
        seatingCapacity: updatedData.specs?.seatingCapacity || updatedData.seatingCapacity || existingProducts[vehicleIndex].specs?.seatingCapacity
      },
      mileage: {
        ...existingProducts[vehicleIndex].mileage,
        city: updatedData.mileage?.city || updatedData.cityMPG || existingProducts[vehicleIndex].mileage?.city,
        highway: updatedData.mileage?.highway || updatedData.highwayMPG || existingProducts[vehicleIndex].mileage?.highway,
        combined: updatedData.mileage?.combined || updatedData.combinedMPG || existingProducts[vehicleIndex].mileage?.combined
      },
      features: updatedData.features || existingProducts[vehicleIndex].features,
      description: updatedData.description || existingProducts[vehicleIndex].description
    };
    
    // Write back to JSON file
    await fs.writeFile(productsPath, JSON.stringify(existingProducts, null, 2), 'utf-8');
    
    console.log('Updated vehicle:', existingProducts[vehicleIndex]);
    
    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: existingProducts[vehicleIndex]
    });
    
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
      error: error.message
    });
  }
});

// Endpoint to delete vehicle from inventory
router.delete('/delete-vehicle/:id', validateAdmin, async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    
    // Load existing products from JSON
    const productsPath = path.join(__dirname, '../data/products.json');
    let existingProducts = [];
    
    try {
      const productsContent = await fs.readFile(productsPath, 'utf-8');
      existingProducts = JSON.parse(productsContent);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error loading product data'
      });
    }
    
    // Find the vehicle to delete
    const vehicleIndex = existingProducts.findIndex(p => p.id === vehicleId);
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    // Remove the vehicle
    const deletedVehicle = existingProducts.splice(vehicleIndex, 1)[0];
    
    // Write back to JSON file
    await fs.writeFile(productsPath, JSON.stringify(existingProducts, null, 2), 'utf-8');
    
    console.log('Deleted vehicle:', deletedVehicle);
    
    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
      deletedVehicle
    });
    
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
      error: error.message
    });
  }
});

module.exports = router;