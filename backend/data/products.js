const products = [
  {
    id: 1,
    category: 'Luxury Sedan',
    name: 'Lexus ES 300h',
    year: 2024,
    price: 4316000,
    msrp: 4523500,
    dealerCost: 4025500,
    financing: {
      apr: 2.9,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.1
    },
    incentives: {
      manufacturer: 166000,
      loyalty: 124500,
      hybrid: 83000
    },
    features: {
      standard: [
        'Lexus Hybrid Drive System',
        'Premium NuLuxe Interior',
        'Heated & Ventilated Front Seats',
        '12.3" Multimedia Display',
        'Mark Levinson Premium Audio',
        'Wireless Phone Charging',
        'Lexus Safety System+ 2.5',
        'Adaptive Variable Suspension'
      ],
      available: [
        'Premium Package (₹265,600)',
        'Ultra Luxury Package (₹481,400)',
        'Mark Levinson Reference Audio (₹116,200)',
        'Panoramic Moonroof (₹99,600)',
        'Head-Up Display (₹74,700)',
        'Digital Rearview Mirror (₹66,400)',
        'Semi-Aniline Leather (₹149,400)'
      ]
    },
    specs: {
      performance: {
        engine: '2.5L 4-Cylinder + Electric Motor',
        horsepower: '215 HP Total System',
        torque: '163 lb-ft',
        transmission: 'eCVT',
        drivetrain: 'FWD',
        acceleration: '0-60 mph in 8.0 seconds',
        topSpeed: '112 mph'
      },
      dimensions: {
        length: '195.9 inches',
        width: '73.4 inches',
        height: '57.1 inches',
        wheelbase: '113.0 inches',
        groundClearance: '5.8 inches',
        trunkCapacity: '16.7 cu ft',
        weight: '3,704 lbs'
      },
      efficiency: {
        cityMPG: 43,
        highwayMPG: 44,
        combinedMPG: 44,
        fuelCapacity: '13.2 gallons',
        range: '581 miles',
        emissions: 'AT-PZEV'
      },
      battery: {
        type: 'Nickel-Metal Hydride',
        capacity: '1.6 kWh',
        warranty: '8 years / 100,000 miles',
        location: 'Under rear seat'
      },
      luxury: {
        interiorMaterial: 'NuLuxe Premium',
        woodTrim: 'Linear Dark Mocha',
        ambientLighting: '14-color customizable',
        climateZones: 'Dual-zone automatic',
        seats: 'Power adjustable with memory'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'Pre-Collision System',
          'All-Speed Dynamic Radar Cruise Control',
          'Lane Departure Alert with Steering Assist',
          'Intelligent High Beam',
          'Road Sign Assist',
          '10 Airbags'
        ]
      }
    },
    colors: [
      { name: 'Eminent White Pearl', hex: '#F7F7F7', price: 0 },
      { name: 'Obsidian', hex: '#0C0C0C', price: 0 },
      { name: 'Atomic Silver', hex: '#C5C5C5', price: 0 },
      { name: 'Nightfall Mica', hex: '#2C2C54', price: 4098955 },
      { name: 'Matador Red Mica', hex: '#8B0000', price: 4098955 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '6 years / 70,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '6 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['Genesis G90 Hybrid', 'BMW 530e', 'Mercedes E-Class Hybrid'],
    description: 'Sophisticated luxury sedan combining exceptional fuel efficiency with premium comfort.',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 8,
    popularOptions: ['Ultra Luxury Package', 'Mark Levinson Reference Audio', 'Panoramic Moonroof']
  },
  {
    id: 2,
    category: 'Luxury SUV',
    name: 'Lexus NX 350h',
    year: 2024,
    price: 4025500,
    msrp: 4249600,
    dealerCost: 3801400,
    financing: {
      apr: 3.2,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.15
    },
    incentives: {
      manufacturer: 124500,
      conquest: 83000,
      hybrid: 124500
    },
    features: {
      standard: [
        'Lexus Hybrid Drive AWD',
        'Premium NuLuxe Interior',
        '14" Touchscreen Multimedia',
        'Lexus Interface Multimedia System',
        'Wireless Apple CarPlay/Android Auto',
        'Qi Wireless Charging',
        'Power Moonroof',
        'Smart Key with Push Button Start'
      ],
      available: [
        'F SPORT Package (₹2,44,850)',
        'Luxury Package (₹3,15,815)',
        'Premium Package (₹1,46,080)',
        'Mark Levinson Premium Audio (₹91,300)',
        'Panoramic Moonroof (₹1,16,200)',
        'Digital Rearview Mirror (₹66,400)',
        'Power Rear Door (₹49,800)'
      ]
    },
    specs: {
      performance: {
        engine: '2.5L 4-Cylinder + Electric Motors',
        horsepower: '239 HP Total System',
        torque: '175 lb-ft',
        transmission: 'eCVT',
        drivetrain: 'AWD',
        acceleration: '0-60 mph in 7.2 seconds',
        topSpeed: '112 mph'
      },
      dimensions: {
        length: '182.7 inches',
        width: '73.4 inches',
        height: '65.4 inches',
        wheelbase: '104.7 inches',
        groundClearance: '8.2 inches',
        cargoCapacity: '22.7 / 46.9 cu ft',
        weight: '4,035 lbs'
      },
      efficiency: {
        cityMPG: 37,
        highwayMPG: 34,
        combinedMPG: 36,
        fuelCapacity: '14.8 gallons',
        range: '533 miles',
        emissions: 'SULEV30'
      },
      capability: {
        towingCapacity: '2,000 lbs',
        groundClearance: '8.2 inches',
        approachAngle: '18.3 degrees',
        departureAngle: '22.1 degrees'
      },
      battery: {
        type: 'Nickel-Metal Hydride',
        capacity: '1.9 kWh',
        warranty: '8 years / 100,000 miles',
        location: 'Under cargo floor'
      },
      luxury: {
        interiorMaterial: 'Premium NuLuxe',
        woodTrim: 'Shimamoku',
        ambientLighting: '14-color LED',
        climateZones: 'Dual-zone automatic',
        seats: 'Power with memory (8-way driver)'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'Lexus Safety System+ 2.5',
          'Pre-Collision System with Pedestrian Detection',
          'All-Speed Dynamic Radar Cruise Control',
          'Lane Departure Alert with Lane Keep Assist',
          'Road Sign Assist',
          '8 Airbags'
        ]
      }
    },
    colors: [
      { name: 'Eminent White Pearl', hex: '#F7F7F7', price: 0 },
      { name: 'Caviar', hex: '#353839', price: 0 },
      { name: 'Atomic Silver', hex: '#C5C5C5', price: 0 },
      { name: 'Grecian Water', hex: '#4A90A4', price: 595 },
      { name: 'Matador Red Mica', hex: '#8B0000', price: 595 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '6 years / 70,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '6 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['BMW X3 xDrive30e', 'Mercedes GLC 350e', 'Volvo XC60 T8'],
    description: 'Premium compact luxury SUV with hybrid efficiency and all-weather capability.',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 6,
    popularOptions: ['F SPORT Package', 'Luxury Package', 'Mark Levinson Premium Audio']
  },
  {
    id: 3,
    category: 'Luxury Crossover',
    name: 'Acura MDX Sport Hybrid',
    year: 2024,
    price: 4814000,
    msrp: 5104500,
    dealerCost: 4523500,
    financing: {
      apr: 3.5,
      months: [36, 48, 60, 72, 84],
      downPaymentMin: 0.15
    },
    incentives: {
      manufacturer: 207500,
      loyalty: 166000,
      hybrid: 124500
    },
    features: {
      standard: [
        'Super Handling All-Wheel Drive',
        'Sport Hybrid SH-AWD System',
        'Milano Leather Interior',
        '12.3" Full Digital Instrument Cluster',
        'True Touchpad Interface',
        'ELS Studio 3D Premium Audio',
        'Wireless Device Charging',
        'AcuraWatch Safety Suite'
      ],
      available: [
        'A-Spec Package (₹2,73,900)',
        'Technology Package (₹2,07,500)',
        'Entertainment Package (₹1,66,000)',
        'Advance Package (₹3,73,500)',
        'Rear Entertainment System (₹1,57,700)',
        'Panoramic Moonroof (₹1,24,500)',
        'Premium Paint (₹49,385)'
      ]
    },
    specs: {
      performance: {
        engine: '3.0L V6 + 3 Electric Motors',
        horsepower: '321 HP Total System',
        torque: '289 lb-ft',
        transmission: '7-Speed DCT',
        drivetrain: 'SH-AWD',
        acceleration: '0-60 mph in 6.7 seconds',
        topSpeed: '130 mph'
      },
      dimensions: {
        length: '196.2 inches',
        width: '77.0 inches',
        height: '66.7 inches',
        wheelbase: '111.0 inches',
        groundClearance: '8.1 inches',
        cargoCapacity: '18.1 / 48.4 / 90.0 cu ft',
        weight: '4,510 lbs'
      },
      efficiency: {
        cityMPG: 26,
        highwayMPG: 27,
        combinedMPG: 26,
        fuelCapacity: '19.5 gallons',
        range: '507 miles',
        emissions: 'LEV3-ULEV50'
      },
      capability: {
        towingCapacity: '5,000 lbs',
        seatingCapacity: 7,
        groundClearance: '8.1 inches',
        wadingDepth: '19 inches'
      },
      battery: {
        type: 'Lithium-ion',
        capacity: '1.3 kWh',
        warranty: '8 years / 100,000 miles',
        location: 'Under center console'
      },
      luxury: {
        interiorMaterial: 'Milano Premium Leather',
        woodTrim: 'Olive Ash Burl',
        ambientLighting: '16-color LED',
        climateZones: 'Tri-zone automatic',
        seats: '16-way power adjustable with massage'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'AcuraWatch Safety & Driver Assistance Suite',
          'Collision Mitigation Braking System',
          'Adaptive Cruise Control',
          'Lane Keeping Assist System',
          'Road Departure Mitigation',
          '9 Airbags including knee airbag'
        ]
      }
    },
    colors: [
      { name: 'Platinum White Pearl', hex: '#F8F8FF', price: 0 },
      { name: 'Majestic Black Pearl', hex: '#0C0C0C', price: 0 },
      { name: 'Modern Steel Metallic', hex: '#8B8680', price: 0 },
      { name: 'Liquid Carbon Metallic', hex: '#36454F', price: 595 },
      { name: 'Performance Red Pearl', hex: '#DC143C', price: 595 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '6 years / 70,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '5 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['Infiniti QX60 Hybrid', 'Lincoln Aviator Grand Touring', 'BMW X5 xDrive45e'],
    description: 'Premium 7-seat luxury SUV with advanced hybrid AWD technology.',
    image: 'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 5,
    popularOptions: ['A-Spec Package', 'Advance Package', 'Entertainment Package']
  },
  {
    id: 4,
    category: 'Executive Sedan',
    name: 'Genesis G90 Hybrid',
    year: 2024,
    price: 5685500,
    msrp: 5976000,
    dealerCost: 5328600,
    financing: {
      apr: 2.5,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.2
    },
    incentives: {
      manufacturer: 249000,
      conquest: 207500,
      loyalty: 166000
    },
    features: {
      standard: [
        'Intelligent Hybrid System',
        'Nappa Leather Quilted Seating',
        'Ergo Motion Driver Seat with Massage',
        '12.3" 3D Digital Cluster',
        'Lexicon Premium Audio System',
        'Genesis Digital Key',
        'Smart Posture Care System',
        'Highway Driving Assist II'
      ],
      available: [
        'Prestige Package (₹5,06,300)',
        'Ultimate Package (₹7,05,500)',
        'Bang & Olufsen Premium Audio (₹2,82,200)',
        'Executive Package (₹3,48,600)',
        'Rear Seat Entertainment (₹2,32,400)',
        'Carbon Fiber Interior (₹1,24,500)',
        'Premium Paint (₹56,025)'
      ]
    },
    specs: {
      performance: {
        engine: '3.5L Twin-Turbo V6 + Electric Motor',
        horsepower: '429 HP Total System',
        torque: '516 lb-ft',
        transmission: '8-Speed Automatic',
        drivetrain: 'AWD',
        acceleration: '0-60 mph in 5.1 seconds',
        topSpeed: '149 mph'
      },
      dimensions: {
        length: '205.9 inches',
        width: '75.4 inches',
        height: '58.9 inches',
        wheelbase: '123.2 inches',
        groundClearance: '5.4 inches',
        trunkCapacity: '12.1 cu ft',
        weight: '4,674 lbs'
      },
      efficiency: {
        cityMPG: 22,
        highwayMPG: 31,
        combinedMPG: 25,
        fuelCapacity: '22.2 gallons',
        range: '555 miles',
        emissions: 'LEV3-ULEV125'
      },
      battery: {
        type: 'Lithium-ion',
        capacity: '1.76 kWh',
        warranty: '10 years / 100,000 miles',
        location: 'Under trunk floor',
        evRange: '2.1 miles'
      },
      luxury: {
        interiorMaterial: 'Nappa Leather with Quilting',
        woodTrim: 'Open Pore Walnut',
        ambientLighting: '64-color mood lighting',
        climateZones: 'Quad-zone automatic',
        seats: '22-way power adjustable with massage and ventilation'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'Genesis Active Safety Control',
          'Forward Collision-Avoidance Assist',
          'Blind-Spot Collision-Avoidance Assist',
          'Highway Driving Assist II',
          'Rear Cross-Traffic Collision-Avoidance Assist',
          '9 Airbags including center airbag'
        ]
      }
    },
    colors: [
      { name: 'Uyuni White', hex: '#F5F5F5', price: 0 },
      { name: 'Obsidian Black', hex: '#000000', price: 0 },
      { name: 'Siberian Ice', hex: '#E8E8E8', price: 675 },
      { name: 'Adriatic Blue', hex: '#1E3A8A', price: 675 },
      { name: 'Burgundy', hex: '#800020', price: 675 }
    ],
    warranty: {
      basic: '5 years / 60,000 miles',
      powertrain: '10 years / 100,000 miles',
      hybrid: '10 years / 100,000 miles',
      corrosion: '7 years / unlimited miles',
      roadside: '5 years / unlimited miles'
    },
    competitors: ['Lexus LS 500h', 'BMW 750e xDrive', 'Mercedes S-Class Hybrid'],
    description: 'Flagship luxury sedan with advanced hybrid technology and executive amenities.',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 3,
    popularOptions: ['Ultimate Package', 'Bang & Olufsen Premium Audio', 'Executive Package']
  },
  {
    id: 5,
    category: 'Luxury Coupe',
    name: 'BMW 530e xDrive',
    year: 2024,
    price: 4938500,
    msrp: 5212400,
    dealerCost: 4656300,
    financing: {
      apr: 3.9,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.15
    },
    incentives: {
      manufacturer: 166000,
      lease: 3500,
      hybrid: 207500
    },
    features: {
      standard: [
        'BMW eDrive Technology',
        'xDrive Intelligent All-Wheel Drive',
        'BMW Live Cockpit Plus',
        'Vernasca Leather Upholstery',
        'Harman Kardon Surround Sound',
        'Wireless Apple CarPlay',
        'BMW Digital Key Plus',
        'Driving Assistance Package'
      ],
      available: [
        'M Sport Package (₹2,65,600)',
        'Executive Package (₹3,15,400)',
        'Premium Package (₹2,19,950)',
        'Bowers & Wilkins Diamond Audio (₹3,48,600)',
        'Individual Full Leather (₹2,07,500)',
        'Carbon Fiber Interior Trim (₹66,400)',
        'BMW Individual Paint (₹1,61,850)'
      ]
    },
    specs: {
      performance: {
        engine: '2.0L TwinPower Turbo + Electric Motor',
        horsepower: '288 HP Total System',
        torque: '310 lb-ft',
        transmission: '8-Speed Steptronic',
        drivetrain: 'xDrive AWD',
        acceleration: '0-60 mph in 5.8 seconds',
        topSpeed: '130 mph (155 mph with M Sport)'
      },
      dimensions: {
        length: '194.3 inches',
        width: '73.2 inches',
        height: '58.9 inches',
        wheelbase: '117.1 inches',
        groundClearance: '5.5 inches',
        trunkCapacity: '14.0 cu ft',
        weight: '4,123 lbs'
      },
      efficiency: {
        cityMPGe: 75,
        highwayMPGe: 71,
        combinedMPGe: 73,
        fuelCapacity: '11.6 gallons',
        range: '370 miles total',
        evRange: '21 miles',
        emissions: 'AT-PZEV'
      },
      battery: {
        type: 'Lithium-ion',
        capacity: '12.0 kWh',
        warranty: '8 years / 80,000 miles',
        chargingTime: '3.5 hours (Level 2)',
        location: 'Under rear seat'
      },
      luxury: {
        interiorMaterial: 'Vernasca Leather',
        woodTrim: 'Fineline Ridge',
        ambientLighting: '11-color ambient lighting',
        climateZones: 'Automatic air conditioning',
        seats: 'Power adjustable with memory'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'BMW Driving Assistance Package',
          'Frontal Collision Warning',
          'Automatic Emergency Braking',
          'Blind Spot Detection',
          'Lane Departure Warning',
          '8 Airbags'
        ]
      }
    },
    colors: [
      { name: 'Alpine White', hex: '#FFFFFF', price: 0 },
      { name: 'Jet Black', hex: '#000000', price: 0 },
      { name: 'Mineral Grey Metallic', hex: '#696969', price: 550 },
      { name: 'Phytonic Blue Metallic', hex: '#4169E1', price: 550 },
      { name: 'Carbon Black Metallic', hex: '#36454F', price: 550 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '4 years / 50,000 miles',
      hybrid: '8 years / 80,000 miles',
      corrosion: '12 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['Mercedes E 350e', 'Audi A6 55 TFSI e', 'Volvo S90 T8'],
    description: 'Sports luxury sedan with plug-in hybrid technology and dynamic performance.',
    image: 'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 4,
    popularOptions: ['M Sport Package', 'Executive Package', 'Bowers & Wilkins Diamond Audio']
  },
  {
    id: 6,
    category: 'Luxury Wagon',
    name: 'Mercedes E 450 All-Terrain Hybrid',
    year: 2024,
    price: 6017500,
    msrp: 6324600,
    dealerCost: 5677200,
    financing: {
      apr: 3.1,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.2
    },
    incentives: {
      manufacturer: 207500,
      conquest: 166000,
      loyalty: 124500
    },
    features: {
      standard: [
        'EQBoost 48V Mild Hybrid System',
        'AIRMATIC Air Suspension',
        'MBUX Multimedia System',
        'Nappa Leather Appointments',
        'Burmester Surround Sound System',
        'Mercedes Me Connect',
        'Driver Assistance Package',
        'All-Terrain Package'
      ],
      available: [
        'AMG Line Package (₹3,27,850)',
        'Premium Package (₹1,86,750)',
        'Driver Assistance Package Plus (₹1,86,750)',
        'Burmester High-End 3D Audio (₹3,77,650)',
        'Executive Rear Seating (₹2,17,460)',
        'Panoramic Sunroof (₹1,28,650)',
        'Designo Paint (₹1,61,850)'
      ]
    },
    specs: {
      performance: {
        engine: '3.0L I6 Turbo + EQBoost',
        horsepower: '362 HP Total System',
        torque: '369 lb-ft',
        transmission: '9G-TRONIC Automatic',
        drivetrain: '4MATIC AWD',
        acceleration: '0-60 mph in 5.2 seconds',
        topSpeed: '130 mph'
      },
      dimensions: {
        length: '195.5 inches',
        width: '73.7 inches',
        height: '59.5 inches',
        wheelbase: '115.7 inches',
        groundClearance: '6.9 inches',
        cargoCapacity: '35.0 / 64.0 cu ft',
        weight: '4,541 lbs'
      },
      efficiency: {
        cityMPG: 22,
        highwayMPG: 30,
        combinedMPG: 25,
        fuelCapacity: '21.1 gallons',
        range: '527 miles',
        emissions: 'LEV3-ULEV70'
      },
      capability: {
        towingCapacity: '7,700 lbs',
        groundClearance: '6.9 inches',
        airSuspension: 'AIRMATIC with adjustable height',
        allTerrain: 'Specialized driving modes'
      },
      battery: {
        type: '48V Lithium-ion',
        capacity: '0.9 kWh',
        warranty: '4 years / 50,000 miles',
        regeneration: 'Intelligent energy recovery'
      },
      luxury: {
        interiorMaterial: 'Nappa Leather',
        woodTrim: 'Open-pore Black Ash',
        ambientLighting: '64-color ambient lighting',
        climateZones: 'THERMOTRONIC automatic',
        seats: 'Multicontour with massage function'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'Mercedes-Benz Driver Assistance Package',
          'Active Brake Assist',
          'Attention Assist',
          'Blind Spot Assist',
          'Lane Keeping Assist',
          '9 Airbags including knee airbags'
        ]
      }
    },
    colors: [
      { name: 'Polar White', hex: '#F8F8FF', price: 0 },
      { name: 'Obsidian Black Metallic', hex: '#0C0C0C', price: 720 },
      { name: 'Selenite Grey Metallic', hex: '#A8A8A8', price: 720 },
      { name: 'Cavansite Blue Metallic', hex: '#4169E1', price: 720 },
      { name: 'Designo Diamond White Bright', hex: '#FFFAFA', price: 161850 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '4 years / 50,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '4 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['Audi A6 Allroad', 'Volvo V90 Cross Country T8', 'BMW 5 Series Touring'],
    description: 'Luxury all-terrain wagon with mild hybrid technology and exceptional versatility.',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 2,
    popularOptions: ['AMG Line Package', 'Burmester High-End 3D Audio', 'Executive Rear Seating']
  },
  {
    id: 7,
    category: 'Premium Hybrid',
    name: 'Volvo XC90 T8 Inscription',
    year: 2024,
    price: 5461400,
    msrp: 5760200,
    dealerCost: 5154300,
    financing: {
      apr: 3.4,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.15
    },
    incentives: {
      manufacturer: 249000,
      conquest: 166000,
      loyalty: 124500
    },
    features: {
      standard: [
        'Twin Engine Plug-In Hybrid',
        'Inscription Luxury Package',
        'Nappa Leather Seating Surfaces',
        '12.3" Digital Driver Display',
        'Bowers & Wilkins Premium Audio',
        'Four-Zone Climate Control',
        'Pilot Assist Semi-Autonomous Drive',
        'Air Suspension'
      ],
      available: [
        'Lounge Package (₹2,65,600)',
        'Advanced Package (₹1,49,400)',
        'Climate Package (₹62,250)',
        'Bowers & Wilkins Premium Audio (₹2,19,950)',
        'Crystal Gear Shifter (₹24,900)',
        'Ventilated Seats (₹62,250)',
        'Premium Paint (₹49,385)'
      ]
    },
    specs: {
      performance: {
        engine: '2.0L Turbo/Supercharged + Electric Motor',
        horsepower: '400 HP Total System',
        torque: '472 lb-ft',
        transmission: '8-Speed Automatic',
        drivetrain: 'AWD',
        acceleration: '0-60 mph in 5.4 seconds',
        topSpeed: '112 mph'
      },
      dimensions: {
        length: '194.8 inches',
        width: '78.3 inches',
        height: '69.9 inches',
        wheelbase: '117.5 inches',
        groundClearance: '9.0 inches',
        cargoCapacity: '15.8 / 41.8 / 85.7 cu ft',
        weight: '4,925 lbs'
      },
      efficiency: {
        cityMPGe: 55,
        highwayMPGe: 54,
        combinedMPGe: 55,
        fuelCapacity: '18.8 gallons',
        range: '520 miles total',
        evRange: '18 miles',
        emissions: 'AT-PZEV'
      },
      capability: {
        towingCapacity: '5,000 lbs',
        seatingCapacity: 7,
        groundClearance: '9.0 inches',
        wadeDepth: '17.7 inches'
      },
      battery: {
        type: 'Lithium-ion',
        capacity: '11.6 kWh',
        warranty: '8 years / 100,000 miles',
        chargingTime: '3 hours (Level 2)',
        location: 'Center tunnel'
      },
      luxury: {
        interiorMaterial: 'Nappa Leather with Diamond Cut',
        woodTrim: 'Linear Walnut',
        crystalElements: 'Orrefors Crystal Gear Shifter',
        climateZones: 'Four-zone CleanZone',
        seats: 'Massage function with multiple settings'
      },
      safety: {
        crashTest: '5-Star NHTSA',
        standardFeatures: [
          'Pilot Assist',
          'City Safety with Autobrake',
          'Run-off Road Protection',
          'Cross Traffic Alert with Autobrake',
          'Blind Spot Information System',
          '8 Airbags with whiplash protection'
        ]
      }
    },
    colors: [
      { name: 'Crystal White Pearl', hex: '#F8F8FF', price: 0 },
      { name: 'Onyx Black Metallic', hex: '#0C0C0C', price: 0 },
      { name: 'Silver Dawn Metallic', hex: '#C0C0C0', price: 595 },
      { name: 'Denim Blue Metallic', hex: '#1E3A8A', price: 595 },
      { name: 'Thunder Grey Metallic', hex: '#696969', price: 595 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '4 years / 50,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '12 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['BMW X5 xDrive45e', 'Mercedes GLE 450e', 'Audi Q7 55 TFSI e'],
    description: 'Scandinavian luxury SUV with advanced plug-in hybrid technology and safety innovations.',
    image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 4,
    popularOptions: ['Lounge Package', 'Bowers & Wilkins Premium Audio', 'Advanced Package']
  },
  {
    id: 8,
    category: 'Hybrid Coupe',
    name: 'Lexus LC 500h',
    year: 2024,
    price: 8175500,
    msrp: 8565600,
    dealerCost: 7702400,
    financing: {
      apr: 4.2,
      months: [36, 48, 60, 72],
      downPaymentMin: 0.25
    },
    incentives: {
      manufacturer: 415000,
      loyalty: 249000,
      conquest: 207500
    },
    features: {
      standard: [
        'Lexus Hybrid Drive System',
        'Semi-Aniline Leather Interior',
        'Mark Levinson Reference Audio',
        'Adaptive Variable Suspension',
        'Active Rear Spoiler',
        '10.3" Multimedia Display',
        'Lexus Safety System+ 2.5',
        'Torque Vectoring Differential'
      ],
      available: [
        'Inspiration Series Package (₹7,05,500)',
        'Performance Package (₹2,57,300)',
        'Touring Package (₹2,19,950)',
        'Mark Levinson Reference Surround (₹1,16,200)',
        'Head-Up Display (₹74,700)',
        'Glass Roof (₹1,32,800)',
        'Special Edition Paint (₹99,600)'
      ]
    },
    specs: {
      performance: {
        engine: '3.5L V6 + Multi-Stage Hybrid',
        horsepower: '354 HP Total System',
        torque: '348 lb-ft',
        transmission: 'Multi-Stage Hybrid CVT',
        drivetrain: 'RWD',
        acceleration: '0-60 mph in 4.7 seconds',
        topSpeed: '155 mph'
      },
      dimensions: {
        length: '185.0 inches',
        width: '75.6 inches',
        height: '53.0 inches',
        wheelbase: '113.0 inches',
        groundClearance: '5.1 inches',
        trunkCapacity: '5.4 cu ft',
        weight: '4,280 lbs'
      },
      efficiency: {
        cityMPG: 26,
        highwayMPG: 35,
        combinedMPG: 30,
        fuelCapacity: '21.7 gallons',
        range: '651 miles',
        emissions: 'LEV3-ULEV70'
      },
      battery: {
        type: 'Lithium-ion',
        capacity: '1.4 kWh',
        warranty: '8 years / 100,000 miles',
        location: 'Behind seats'
      },
      luxury: {
        interiorMaterial: 'Semi-Aniline Leather',
        woodTrim: 'Hadori Aluminum',
        craftsmanship: 'Takumi Master Artisan',
        climateZones: 'Dual-zone automatic',
        seats: '10-way power adjustable'
      },
      safety: {
        crashTest: 'Not Rated (Low Volume)',
        standardFeatures: [
          'Lexus Safety System+ 2.5',
          'Pre-Collision System',
          'Dynamic Radar Cruise Control',
          'Lane Departure Alert',
          'Intelligent High Beam',
          '8 Airbags'
        ]
      }
    },
    colors: [
      { name: 'Atomic Silver', hex: '#C5C5C5', price: 0 },
      { name: 'Obsidian', hex: '#0C0C0C', price: 0 },
      { name: 'Structural Blue', hex: '#0047AB', price: 99600 },
      { name: 'Infrared', hex: '#FF073A', price: 99600 },
      { name: 'Nori Green Pearl', hex: '#355E3B', price: 99600 }
    ],
    warranty: {
      basic: '4 years / 50,000 miles',
      powertrain: '6 years / 70,000 miles',
      hybrid: '8 years / 100,000 miles',
      corrosion: '6 years / unlimited miles',
      roadside: '4 years / unlimited miles'
    },
    competitors: ['BMW i8', 'Mercedes-AMG GT 63 S E Performance', 'Acura NSX'],
    description: 'Ultra-luxury grand touring hybrid coupe with exceptional craftsmanship.',
    image: 'https://images.pexels.com/photos/3954426/pexels-photo-3954426.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    inStock: 1,
    popularOptions: ['Inspiration Series Package', 'Performance Package', 'Glass Roof']
  }
];

module.exports = products;