// Helper component for when extraction fails or needs manual input

export const getEmptyVehicleTemplate = () => ({
  name: '',
  category: 'SUV',
  year: new Date().getFullYear().toString(),
  price: '',
  msrp: '',
  dealerCost: '',
  engine: '',
  horsepower: '',
  torque: '',
  cityMPG: '',
  highwayMPG: '',
  combinedMPG: '',
  transmission: 'Automatic',
  drivetrain: 'FWD',
  fuelType: 'Gasoline',
  seatingCapacity: '5',
  features: [],
  description: '',
  confidence: 0
});

export const commonVehicleTemplates = {
  'Toyota Urban Cruiser Hyryder': {
    name: 'Toyota Urban Cruiser Hyryder',
    category: 'SUV',
    year: '2024',
    price: '1511000',
    msrp: '1550000',
    dealerCost: '1426000',
    engine: '1.5L Hybrid',
    horsepower: '115',
    torque: '141',
    cityMPG: '27',
    highwayMPG: '28',
    combinedMPG: '27',
    transmission: '6-speed Automatic',
    drivetrain: 'AWD',
    fuelType: 'Hybrid',
    seatingCapacity: '5',
    features: ['Panoramic Sunroof', 'Leather Seats', 'Apple Carplay', 'Android Auto'],
    description: 'Premium SUV with hybrid efficiency for urban families',
    confidence: 100
  },
  'Honda City': {
    name: 'Honda City',
    category: 'Sedan',
    year: '2024',
    price: '1172000',
    msrp: '1200000',
    dealerCost: '1104000',
    engine: '1.5L Petrol',
    horsepower: '121',
    torque: '145',
    cityMPG: '17',
    highwayMPG: '20',
    combinedMPG: '18',
    transmission: 'CVT',
    drivetrain: 'FWD',
    fuelType: 'Petrol',
    seatingCapacity: '5',
    features: ['Sunroof', 'LED Headlights', 'Touchscreen', 'Cruise Control'],
    description: 'Premium sedan with advanced features and comfort',
    confidence: 100
  },
  'Hyundai Creta': {
    name: 'Hyundai Creta',
    category: 'SUV',
    year: '2024',
    price: '1096000',
    msrp: '1120000',
    dealerCost: '1030000',
    engine: '1.5L Petrol',
    horsepower: '115',
    torque: '144',
    cityMPG: '16',
    highwayMPG: '20',
    combinedMPG: '17',
    transmission: '6-speed Manual',
    drivetrain: 'FWD',
    fuelType: 'Petrol',
    seatingCapacity: '5',
    features: ['Panoramic Sunroof', 'Ventilated Seats', 'Bose Audio', 'Wireless Charging'],
    description: 'Popular compact SUV with premium features',
    confidence: 100
  }
};

export const validateVehicleData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.length < 3) {
    errors.push('Vehicle name is required (minimum 3 characters)');
  }
  
  if (!data.price || parseFloat(data.price) <= 0) {
    errors.push('Valid price is required');
  }
  
  if (!data.year || parseInt(data.year) < 1990 || parseInt(data.year) > 2030) {
    errors.push('Valid year is required (1990-2030)');
  }
  
  return errors;
};

export const formatPrice = (price) => {
  if (!price) return '';
  const num = parseFloat(price);
  if (num >= 100000) {
    // Indian format (lakhs)
    return '₹' + num.toLocaleString('en-IN');
  } else {
    // USD format
    return '$' + num.toLocaleString('en-US');
  }
};