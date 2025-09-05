const trainingData = {
  quizQuestions: [
    // LEXUS ES 300h (Product ID: 1) - 8 Questions
    {
      id: 1,
      productId: 1,
      category: 'technical',
      difficulty: 'intermediate',
      question: 'What is the total system horsepower of the Lexus ES 300h?',
      options: ['195 HP', '215 HP', '235 HP', '255 HP'],
      correctAnswer: 1,
      explanation: 'The Lexus ES 300h produces 215 HP total system power combining the 2.5L 4-cylinder engine with the electric motor.',
      salesTip: 'Emphasize that this hybrid system provides smooth, efficient power delivery while maintaining luxury performance.'
    },
    {
      id: 2,
      productId: 1,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the combined MPG rating of the Lexus ES 300h?',
      options: ['40 MPG', '42 MPG', '44 MPG', '46 MPG'],
      correctAnswer: 2,
      explanation: 'The ES 300h achieves an outstanding 44 MPG combined, making it one of the most efficient luxury sedans.',
      salesTip: 'Compare this to non-hybrid luxury sedans that typically get 25-28 MPG combined - that\'s significant fuel savings!'
    },
    {
      id: 3,
      productId: 1,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium interior material is standard in the ES 300h?',
      options: ['Genuine Leather', 'NuLuxe Premium', 'Alcantara', 'Cloth'],
      correctAnswer: 1,
      explanation: 'NuLuxe Premium is standard, offering the look and feel of leather with better durability and environmental benefits.',
      salesTip: 'NuLuxe is easier to maintain than traditional leather and more environmentally sustainable - perfect for eco-conscious luxury buyers.'
    },
    {
      id: 4,
      productId: 1,
      category: 'warranty',
      difficulty: 'easy',
      question: 'What is the hybrid component warranty period for the ES 300h?',
      options: ['6 years / 60,000 miles', '8 years / 100,000 miles', '10 years / 100,000 miles', '5 years / 60,000 miles'],
      correctAnswer: 1,
      explanation: 'Lexus provides an 8-year / 100,000-mile hybrid component warranty, demonstrating confidence in the technology.',
      salesTip: 'This extended warranty coverage provides peace of mind and protects the customer\'s investment in hybrid technology.'
    },
    {
      id: 5,
      productId: 1,
      category: 'safety',
      difficulty: 'easy',
      question: 'What advanced safety system is standard on the ES 300h?',
      options: ['Basic Safety Package', 'Lexus Safety System+ 2.0', 'Lexus Safety System+ 2.5', 'Premium Safety Suite'],
      correctAnswer: 2,
      explanation: 'Lexus Safety System+ 2.5 includes advanced features like pedestrian detection and lane tracing assist.',
      salesTip: 'Emphasize that these advanced safety features come standard - many competitors charge extra for similar technology.'
    },
    {
      id: 6,
      productId: 1,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What size multimedia display does the ES 300h feature?',
      options: ['10.3 inches', '12.3 inches', '14 inches', '8 inches'],
      correctAnswer: 1,
      explanation: 'The ES 300h features a 12.3-inch multimedia display with intuitive touchscreen controls.',
      salesTip: 'The large screen makes navigation and entertainment controls easy to use while maintaining luxury aesthetics.'
    },
    {
      id: 7,
      productId: 1,
      category: 'performance',
      difficulty: 'advanced',
      question: 'What type of transmission does the ES 300h use?',
      options: ['8-Speed Automatic', 'CVT', 'eCVT', '10-Speed Automatic'],
      correctAnswer: 2,
      explanation: 'The ES 300h uses an electronically controlled continuously variable transmission (eCVT) optimized for hybrid efficiency.',
      salesTip: 'The eCVT provides seamless power delivery and contributes significantly to the vehicle\'s exceptional fuel economy.'
    },
    {
      id: 8,
      productId: 1,
      category: 'comfort',
      difficulty: 'easy',
      question: 'Which seating feature is standard on the ES 300h?',
      options: ['Heated seats only', 'Ventilated seats only', 'Heated & Ventilated front seats', 'Manual seats'],
      correctAnswer: 2,
      explanation: 'Both heated and ventilated front seats come standard, providing year-round comfort.',
      salesTip: 'Many luxury vehicles charge extra for ventilated seats - this shows the ES 300h\'s value proposition.'
    },

    // LEXUS NX 350h (Product ID: 2) - 8 Questions
    {
      id: 9,
      productId: 2,
      category: 'performance',
      difficulty: 'intermediate',
      question: 'What drivetrain system does the NX 350h use?',
      options: ['FWD Only', 'RWD Only', 'AWD Standard', 'AWD Optional'],
      correctAnswer: 2,
      explanation: 'The NX 350h comes with standard Lexus Hybrid Drive AWD, providing enhanced traction and stability.',
      salesTip: 'The hybrid AWD system is always active, unlike traditional AWD systems that engage when needed - better for safety and confidence.'
    },
    {
      id: 10,
      productId: 2,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What size multimedia display is standard in the NX 350h?',
      options: ['8-inch', '10-inch', '12-inch', '14-inch'],
      correctAnswer: 3,
      explanation: 'The NX 350h features a large 14-inch touchscreen multimedia display for enhanced user experience.',
      salesTip: 'The large screen makes navigation, entertainment, and vehicle settings easy to access and control while driving.'
    },
    {
      id: 11,
      productId: 2,
      category: 'capability',
      difficulty: 'easy',
      question: 'What is the towing capacity of the NX 350h?',
      options: ['1,500 lbs', '2,000 lbs', '2,500 lbs', '3,000 lbs'],
      correctAnswer: 1,
      explanation: 'The NX 350h can tow up to 2,000 lbs, suitable for small trailers, bikes, or watercraft.',
      salesTip: 'Perfect for customers who need light towing capability while maintaining excellent fuel economy - best of both worlds.'
    },
    {
      id: 12,
      productId: 2,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the NX 350h\'s combined MPG rating?',
      options: ['35 MPG', '37 MPG', '39 MPG', '41 MPG'],
      correctAnswer: 2,
      explanation: 'The NX 350h achieves 37 MPG combined, excellent for a luxury SUV with AWD.',
      salesTip: 'This efficiency beats most non-hybrid luxury SUVs by 10+ MPG - significant savings at the pump!'
    },
    {
      id: 13,
      productId: 2,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium audio system is available in the NX 350h?',
      options: ['Bose Premium', 'Mark Levinson', 'Harman Kardon', 'JBL Premium'],
      correctAnswer: 1,
      explanation: 'The available Mark Levinson Premium Audio system provides concert-hall quality sound.',
      salesTip: 'Mark Levinson is renowned for audiophile-quality sound - a significant luxury feature that music lovers will appreciate.'
    },
    {
      id: 14,
      productId: 2,
      category: 'safety',
      difficulty: 'easy',
      question: 'What is the IIHS Top Safety Pick award status of the NX 350h?',
      options: ['Not awarded', 'Top Safety Pick', 'Top Safety Pick+', 'Pending evaluation'],
      correctAnswer: 2,
      explanation: 'The NX 350h earned the IIHS Top Safety Pick+ award for its comprehensive safety features.',
      salesTip: 'This is the highest safety award possible - perfect for families who prioritize safety without compromising luxury.'
    },
    {
      id: 15,
      productId: 2,
      category: 'design',
      difficulty: 'easy',
      question: 'What distinctive design element defines the NX 350h\'s front end?',
      options: ['Chrome grille', 'Lexus spindle grille', 'Mesh grille', 'Piano black grille'],
      correctAnswer: 1,
      explanation: 'The signature Lexus spindle grille gives the NX 350h its bold, distinctive appearance.',
      salesTip: 'The spindle grille is instantly recognizable as Lexus - it makes a statement about the owner\'s sophisticated taste.'
    },
    {
      id: 16,
      productId: 2,
      category: 'comfort',
      difficulty: 'intermediate',
      question: 'How many climate zones does the NX 350h\'s climate control system have?',
      options: ['Single zone', 'Dual zone', 'Tri-zone', 'Quad zone'],
      correctAnswer: 1,
      explanation: 'The NX 350h features dual-zone automatic climate control for driver and passenger comfort.',
      salesTip: 'Dual-zone climate control ensures both driver and passenger can set their preferred temperature - important for comfort on long drives.'
    },

    // ACURA MDX SPORT HYBRID (Product ID: 3) - 8 Questions
    {
      id: 17,
      productId: 3,
      category: 'technology',
      difficulty: 'advanced',
      question: 'What unique AWD technology does the MDX Sport Hybrid feature?',
      options: ['Traditional AWD', 'SH-AWD', 'xDrive', 'Quattro'],
      correctAnswer: 1,
      explanation: 'Super Handling All-Wheel Drive (SH-AWD) uses individual electric motors to enhance cornering and traction.',
      salesTip: 'SH-AWD provides superior handling dynamics compared to conventional AWD systems - great for performance-oriented buyers.'
    },
    {
      id: 18,
      productId: 3,
      category: 'performance',
      difficulty: 'intermediate',
      question: 'How many electric motors does the MDX Sport Hybrid use?',
      options: ['1 motor', '2 motors', '3 motors', '4 motors'],
      correctAnswer: 2,
      explanation: 'The MDX Sport Hybrid uses 3 electric motors - one integrated with the engine and two rear-wheel motors.',
      salesTip: 'This tri-motor setup enables precise power distribution and exceptional handling characteristics - like having a personal driving coach.'
    },
    {
      id: 19,
      productId: 3,
      category: 'luxury',
      difficulty: 'easy',
      question: 'What premium leather is used in the MDX Sport Hybrid?',
      options: ['Standard Leather', 'Milano Leather', 'Nappa Leather', 'Semi-Aniline'],
      correctAnswer: 1,
      explanation: 'Milano Premium Leather is standard, offering exceptional quality and comfort.',
      salesTip: 'Milano leather is carefully selected and treated for superior softness and durability - you can feel the quality difference.'
    },
    {
      id: 20,
      productId: 3,
      category: 'capacity',
      difficulty: 'easy',
      question: 'How many passengers can the MDX Sport Hybrid seat?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
      explanation: 'The MDX Sport Hybrid seats up to 7 passengers with flexible seating configurations.',
      salesTip: 'Perfect for large families who want luxury and efficiency - rare combination in the 7-passenger segment.'
    },
    {
      id: 21,
      productId: 3,
      category: 'efficiency',
      difficulty: 'intermediate',
      question: 'What is the MDX Sport Hybrid\'s combined fuel economy?',
      options: ['26 MPG', '28 MPG', '30 MPG', '32 MPG'],
      correctAnswer: 1,
      explanation: 'The MDX Sport Hybrid achieves 28 MPG combined, excellent for a 7-passenger luxury SUV.',
      salesTip: 'This beats most non-hybrid 7-seaters by 6-8 MPG - significant savings for families who drive a lot.'
    },
    {
      id: 22,
      productId: 3,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What infotainment system does the MDX Sport Hybrid use?',
      options: ['AcuraLink', 'True Touchpad Interface', 'Command Control', 'iDrive'],
      correctAnswer: 1,
      explanation: 'The True Touchpad Interface provides intuitive control of multimedia and navigation functions.',
      salesTip: 'The touchpad is more intuitive than traditional controls - customers can operate it without taking their eyes off the road.'
    },
    {
      id: 23,
      productId: 3,
      category: 'safety',
      difficulty: 'easy',
      question: 'What is Acura\'s comprehensive safety suite called?',
      options: ['Acura Guard', 'AcuraWatch', 'Acura Sense', 'Acura Shield'],
      correctAnswer: 1,
      explanation: 'AcuraWatch is Acura\'s comprehensive suite of safety and driver assistance technologies.',
      salesTip: 'AcuraWatch comes standard across the lineup - Acura prioritizes safety for all customers, not just those who pay extra.'
    },
    {
      id: 24,
      productId: 3,
      category: 'warranty',
      difficulty: 'easy',
      question: 'What is Acura\'s hybrid battery warranty coverage?',
      options: ['6 years/60k miles', '8 years/100k miles', '10 years/100k miles', '8 years/80k miles'],
      correctAnswer: 1,
      explanation: 'Acura provides 8 years/100,000 mile hybrid battery warranty coverage.',
      salesTip: 'This comprehensive warranty shows Acura\'s confidence in their hybrid technology and protects your investment.'
    },

    // GENESIS G90 HYBRID (Product ID: 4) - 8 Questions  
    {
      id: 25,
      productId: 4,
      category: 'performance',
      difficulty: 'advanced',
      question: 'What is the total system horsepower of the Genesis G90 Hybrid?',
      options: ['375 HP', '400 HP', '429 HP', '450 HP'],
      correctAnswer: 2,
      explanation: 'The G90 Hybrid produces an impressive 429 HP total system power, combining luxury with performance.',
      salesTip: 'This power level rivals many non-hybrid V8 engines while providing much better fuel economy - performance without compromise.'
    },
    {
      id: 26,
      productId: 4,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'How many seat adjustment positions does the G90 Hybrid driver seat offer?',
      options: ['12-way', '16-way', '20-way', '22-way'],
      correctAnswer: 3,
      explanation: 'The G90 Hybrid features 22-way power adjustable seats with massage and ventilation functions.',
      salesTip: 'This level of adjustability ensures perfect comfort for any driver - rivals the most expensive luxury brands at a better value.'
    },
    {
      id: 27,
      productId: 4,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What advanced lighting system does the G90 Hybrid feature?',
      options: ['LED headlights', '32-color lighting', '64-color mood lighting', '128-color system'],
      correctAnswer: 2,
      explanation: 'The G90 Hybrid offers 64-color mood lighting throughout the cabin for personalized ambiance.',
      salesTip: 'Customers can customize the interior lighting to match their mood or preference - it\'s like having a personal luxury lounge.'
    },
    {
      id: 28,
      productId: 4,
      category: 'comfort',
      difficulty: 'advanced',
      question: 'What unique comfort feature does the G90 Hybrid\'s rear seat offer?',
      options: ['Heated seats', 'Massage seats', 'Executive relaxation seats', 'Ventilated seats'],
      correctAnswer: 2,
      explanation: 'Executive relaxation seats in the rear recline and offer massage functions for ultimate comfort.',
      salesTip: 'The rear seats rival first-class airline seats - perfect for executives or anyone who values ultimate comfort.'
    },
    {
      id: 29,
      productId: 4,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the G90 Hybrid\'s combined fuel economy?',
      options: ['25 MPG', '28 MPG', '31 MPG', '33 MPG'],
      correctAnswer: 2,
      explanation: 'The G90 Hybrid achieves 28 MPG combined, remarkable for such a powerful luxury sedan.',
      salesTip: 'Compare this to non-hybrid luxury sedans of similar size that get 18-22 MPG - the savings add up quickly!'
    },
    {
      id: 30,
      productId: 4,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What size infotainment display does the G90 Hybrid feature?',
      options: ['10.25 inches', '12.3 inches', '14.5 inches', '15 inches'],
      correctAnswer: 1,
      explanation: 'The G90 Hybrid features a 12.3-inch high-definition infotainment display.',
      salesTip: 'The large, crisp display makes navigation and multimedia control intuitive and enjoyable to use.'
    },
    {
      id: 31,
      productId: 4,
      category: 'warranty',
      difficulty: 'easy',
      question: 'What is Genesis\' comprehensive warranty coverage?',
      options: ['5 years/60k miles', '7 years/70k miles', '10 years/100k miles', '6 years/72k miles'],
      correctAnswer: 2,
      explanation: 'Genesis offers an industry-leading 10 years/100,000 mile comprehensive warranty.',
      salesTip: 'This is double what most luxury brands offer - shows Genesis\' confidence in quality and provides exceptional peace of mind.'
    },
    {
      id: 32,
      productId: 4,
      category: 'service',
      difficulty: 'easy',
      question: 'What complimentary service does Genesis provide?',
      options: ['Oil changes only', 'Basic maintenance', 'White glove service experience', 'Warranty repairs'],
      correctAnswer: 2,
      explanation: 'Genesis provides complimentary scheduled maintenance and white glove service experience.',
      salesTip: 'Genesis will pick up your car for service and provide a loaner - luxury service that competitors charge extra for.'
    },

    // BMW 530e xDrive (Product ID: 5) - 8 Questions
    {
      id: 33,
      productId: 5,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the electric-only range of the BMW 530e xDrive?',
      options: ['15 miles', '18 miles', '21 miles', '24 miles'],
      correctAnswer: 2,
      explanation: 'The 530e xDrive can travel up to 21 miles on electric power alone, perfect for short commutes.',
      salesTip: 'Many customers can complete their daily errands using only electric power, saving fuel costs and reducing emissions.'
    },
    {
      id: 34,
      productId: 5,
      category: 'technology',
      difficulty: 'intermediate',
      question: 'What charging time is required for the 530e xDrive using Level 2 charging?',
      options: ['2.5 hours', '3.5 hours', '4.5 hours', '5.5 hours'],
      correctAnswer: 1,
      explanation: 'The 530e xDrive can be fully charged in just 3.5 hours using a Level 2 (240V) charger.',
      salesTip: 'Customers can easily charge overnight or during work hours for maximum convenience - like starting with a full tank every day.'
    },
    {
      id: 35,
      productId: 5,
      category: 'performance',
      difficulty: 'advanced',
      question: 'What is the total system power of the 530e xDrive?',
      options: ['288 HP', '310 HP', '335 HP', '350 HP'],
      correctAnswer: 1,
      explanation: 'The 530e xDrive produces 288 HP total system power combining the turbocharged engine and electric motor.',
      salesTip: 'This provides excellent performance while maintaining efficiency - the best of both worlds for driving enthusiasts.'
    },
    {
      id: 36,
      productId: 5,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium interior feature is standard in the 530e xDrive?',
      options: ['Cloth seats', 'Leatherette', 'Dakota Leather', 'Nappa Leather'],
      correctAnswer: 2,
      explanation: 'Dakota leather seating surfaces are standard, providing luxury comfort and durability.',
      salesTip: 'BMW uses high-quality leather that ages beautifully - it\'s an investment in long-term comfort and style.'
    },
    {
      id: 37,
      productId: 5,
      category: 'technology',
      difficulty: 'easy',
      question: 'What is BMW\'s infotainment system called?',
      options: ['ConnectedDrive', 'iDrive', 'BMW Live', 'Digital Cockpit'],
      correctAnswer: 1,
      explanation: 'iDrive is BMW\'s award-winning infotainment and vehicle control system.',
      salesTip: 'iDrive is consistently rated as one of the best infotainment systems - intuitive and feature-rich without being overwhelming.'
    },
    {
      id: 38,
      productId: 5,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the 530e xDrive\'s combined MPGe rating?',
      options: ['60 MPGe', '67 MPGe', '75 MPGe', '82 MPGe'],
      correctAnswer: 1,
      explanation: 'The 530e xDrive achieves 67 MPGe combined when including electric driving.',
      salesTip: 'This exceptional efficiency comes without sacrificing BMW\'s renowned driving dynamics - efficiency with soul.'
    },
    {
      id: 39,
      productId: 5,
      category: 'incentives',
      difficulty: 'easy',
      question: 'What federal incentive may the 530e xDrive qualify for?',
      options: ['No incentives', '$2,500 tax credit', '$5,000 rebate', '$7,500 tax credit'],
      correctAnswer: 3,
      explanation: 'As a plug-in hybrid, the 530e xDrive may qualify for up to $7,500 federal tax credit.',
      salesTip: 'This incentive can significantly reduce the effective purchase price - we can help determine exact eligibility and amount.'
    },
    {
      id: 40,
      productId: 5,
      category: 'design',
      difficulty: 'easy',
      question: 'What design element distinguishes the 530e from standard 5 Series?',
      options: ['No differences', 'Blue accents', 'Different wheels only', 'Larger grille'],
      correctAnswer: 1,
      explanation: 'The 530e features distinctive blue accents and specific eDrive badging to highlight its hybrid nature.',
      salesTip: 'The subtle hybrid cues show environmental consciousness while maintaining BMW\'s sporty elegance.'
    },

    // MERCEDES E 450 ALL-TERRAIN HYBRID (Product ID: 6) - 8 Questions
    {
      id: 41,
      productId: 6,
      category: 'technology',
      difficulty: 'advanced',
      question: 'What hybrid system does the E 450 All-Terrain use?',
      options: ['Traditional Hybrid', '48V EQBoost', 'Plug-in Hybrid', 'Full Electric'],
      correctAnswer: 1,
      explanation: 'The E 450 All-Terrain features a 48V EQBoost mild hybrid system for enhanced efficiency and performance.',
      salesTip: 'EQBoost provides additional torque during acceleration while improving fuel economy - seamless hybrid technology.'
    },
    {
      id: 42,
      productId: 6,
      category: 'capability',
      difficulty: 'easy',
      question: 'What is the impressive towing capacity of the E 450 All-Terrain?',
      options: ['5,000 lbs', '6,500 lbs', '7,700 lbs', '8,500 lbs'],
      correctAnswer: 2,
      explanation: 'The E 450 All-Terrain can tow up to 7,700 lbs, exceptional for a luxury wagon.',
      salesTip: 'This towing capacity rivals many SUVs while maintaining wagon versatility and fuel efficiency - unique in the luxury segment.'
    },
    {
      id: 43,
      productId: 6,
      category: 'performance',
      difficulty: 'intermediate',
      question: 'What is the horsepower output of the E 450 All-Terrain?',
      options: ['329 HP', '362 HP', '389 HP', '402 HP'],
      correctAnswer: 1,
      explanation: 'The E 450 All-Terrain produces 362 HP from its turbocharged inline-6 engine with EQBoost.',
      salesTip: 'This power level provides excellent performance for both highway cruising and off-road adventures.'
    },
    {
      id: 44,
      productId: 6,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium seating material is available in the E 450 All-Terrain?',
      options: ['MB-Tex', 'Artico', 'Nappa Leather', 'Exclusive Nappa'],
      correctAnswer: 3,
      explanation: 'Available Exclusive Nappa leather provides the ultimate in luxury and comfort.',
      salesTip: 'Exclusive Nappa leather is hand-selected for its premium feel and appearance - represents Mercedes-Benz luxury craftsmanship.'
    },
    {
      id: 45,
      productId: 6,
      category: 'technology',
      difficulty: 'easy',
      question: 'What driver assistance system is standard on the E 450 All-Terrain?',
      options: ['Basic Cruise', 'Adaptive Cruise', 'Drive Pilot', 'Traffic Jam Assist'],
      correctAnswer: 1,
      explanation: 'Active Distance Assist (adaptive cruise control) with steering assistance is standard.',
      salesTip: 'This semi-autonomous driving capability reduces fatigue on long trips and enhances safety in traffic.'
    },
    {
      id: 46,
      productId: 6,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the E 450 All-Terrain\'s combined fuel economy?',
      options: ['25 MPG', '27 MPG', '29 MPG', '31 MPG'],
      correctAnswer: 1,
      explanation: 'The E 450 All-Terrain achieves 27 MPG combined, excellent for a powerful luxury wagon.',
      salesTip: 'This efficiency beats most non-hybrid luxury SUVs while offering superior cargo capacity and driving dynamics.'
    },
    {
      id: 47,
      productId: 6,
      category: 'versatility',
      difficulty: 'easy',
      question: 'What is the cargo capacity of the E 450 All-Terrain?',
      options: ['55 cubic feet', '64 cubic feet', '72 cubic feet', '81 cubic feet'],
      correctAnswer: 1,
      explanation: 'The E 450 All-Terrain offers 64 cubic feet of cargo space with rear seats folded.',
      salesTip: 'This cargo capacity rivals SUVs while maintaining lower height for easier loading and better aerodynamics.'
    },
    {
      id: 48,
      productId: 6,
      category: 'design',
      difficulty: 'easy',
      question: 'What distinctive design feature sets the All-Terrain apart?',
      options: ['Lowered suspension', 'Raised ground clearance', 'Sport bumpers', 'Sedan proportions'],
      correctAnswer: 1,
      explanation: 'The All-Terrain features raised ground clearance and protective body cladding for light off-road capability.',
      salesTip: 'This rugged capability is rare in luxury wagons - perfect for customers who want versatility without SUV downsides.'
    },

    // VOLVO XC90 T8 INSCRIPTION (Product ID: 7) - 8 Questions
    {
      id: 49,
      productId: 7,
      category: 'safety',
      difficulty: 'intermediate',
      question: 'What advanced safety feature is standard in the XC90 T8?',
      options: ['Basic Cruise Control', 'Adaptive Cruise', 'Pilot Assist', 'Full Self-Driving'],
      correctAnswer: 2,
      explanation: 'Pilot Assist provides semi-autonomous driving capabilities, helping with steering, acceleration, and braking.',
      salesTip: 'Pilot Assist reduces driver fatigue on long trips and enhances safety in traffic - Volvo leads in safety innovation.'
    },
    {
      id: 50,
      productId: 7,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What unique crystal element is available in the XC90 T8?',
      options: ['Crystal Headlights', 'Crystal Wheels', 'Crystal Gear Shifter', 'Crystal Dashboard'],
      correctAnswer: 2,
      explanation: 'The optional Orrefors Crystal Gear Shifter adds a unique luxury touch from the famous Swedish crystal maker.',
      salesTip: 'This Swedish craftsmanship detail showcases Volvo\'s attention to luxury and heritage - truly unique in the automotive world.'
    },
    {
      id: 51,
      productId: 7,
      category: 'performance',
      difficulty: 'advanced',
      question: 'What is the total system power of the XC90 T8?',
      options: ['390 HP', '400 HP', '415 HP', '455 HP'],
      correctAnswer: 2,
      explanation: 'The XC90 T8 produces 400 HP total system power combining the supercharged and turbocharged engine with electric motor.',
      salesTip: 'This twin-charged plus electric setup provides incredible performance while maintaining efficiency - engineering excellence.'
    },
    {
      id: 52,
      productId: 7,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the XC90 T8\'s electric-only range?',
      options: ['15 miles', '18 miles', '22 miles', '25 miles'],
      correctAnswer: 2,
      explanation: 'The XC90 T8 can travel up to 18 miles on electric power alone.',
      salesTip: 'Perfect for short trips and urban driving without using any gasoline - ideal for environmentally conscious families.'
    },
    {
      id: 53,
      productId: 7,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium audio system is available in the XC90 T8?',
      options: ['Harman Kardon', 'Bowers & Wilkins', 'Bang & Olufsen', 'Premium Sound'],
      correctAnswer: 1,
      explanation: 'The available Bowers & Wilkins premium audio system provides exceptional sound quality.',
      salesTip: 'Bowers & Wilkins is renowned for high-end audio equipment - brings concert-hall quality to your daily drive.'
    },
    {
      id: 54,
      productId: 7,
      category: 'comfort',
      difficulty: 'easy',
      question: 'How many passengers can the XC90 T8 seat?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
      explanation: 'The XC90 T8 can seat up to 7 passengers with flexible seating configurations.',
      salesTip: 'Perfect for large families who want luxury, efficiency, and Volvo\'s renowned safety - rare combination in 7-seaters.'
    },
    {
      id: 55,
      productId: 7,
      category: 'technology',
      difficulty: 'easy',
      question: 'What is Volvo\'s infotainment system called?',
      options: ['Sensus', 'Connect', 'Digital Cockpit', 'Infotainment Plus'],
      correctAnswer: 0,
      explanation: 'Sensus is Volvo\'s intuitive infotainment and connectivity system.',
      salesTip: 'Sensus is designed with Swedish minimalism - clean, intuitive, and distraction-free while driving.'
    },
    {
      id: 56,
      productId: 7,
      category: 'sustainability',
      difficulty: 'intermediate',
      question: 'What sustainable material does Volvo use in the XC90 T8 interior?',
      options: ['Recycled plastics only', 'Sustainable wood and textiles', 'Standard materials', 'Vegan leather only'],
      correctAnswer: 1,
      explanation: 'The XC90 T8 features sustainably sourced wood and recycled textiles as part of Volvo\'s environmental commitment.',
      salesTip: 'Shows Volvo\'s commitment to sustainability without compromising luxury - perfect for environmentally conscious buyers.'
    },

    // LEXUS LC 500h (Product ID: 8) - 8 Questions
    {
      id: 57,
      productId: 8,
      category: 'performance',
      difficulty: 'advanced',
      question: 'What unique hybrid transmission does the LC 500h use?',
      options: ['CVT', 'Multi-Stage Hybrid CVT', '8-Speed Automatic', '10-Speed Automatic'],
      correctAnswer: 1,
      explanation: 'The LC 500h features a revolutionary Multi-Stage Hybrid CVT that provides the feel of a traditional automatic.',
      salesTip: 'This system eliminates the typical CVT "rubber band" feeling while maintaining hybrid efficiency - best of both worlds.'
    },
    {
      id: 58,
      productId: 8,
      category: 'craftsmanship',
      difficulty: 'advanced',
      question: 'What level of craftsmanship is applied to the LC 500h interior?',
      options: ['Standard Production', 'Premium Assembly', 'Takumi Master Artisan', 'Custom Built'],
      correctAnswer: 2,
      explanation: 'Takumi Master Artisans hand-craft each LC 500h interior, representing the highest level of Japanese craftsmanship.',
      salesTip: 'Takumi artisans undergo decades of training to achieve this level of precision and artistry - truly exclusive craftsmanship.'
    },
    {
      id: 59,
      productId: 8,
      category: 'performance',
      difficulty: 'intermediate',
      question: 'What is the total system horsepower of the LC 500h?',
      options: ['310 HP', '354 HP', '389 HP', '416 HP'],
      correctAnswer: 1,
      explanation: 'The LC 500h produces 354 HP total system power combining the V6 engine with electric motors.',
      salesTip: 'This provides thrilling performance while maintaining the efficiency expected from a hybrid grand tourer.'
    },
    {
      id: 60,
      productId: 8,
      category: 'design',
      difficulty: 'easy',
      question: 'What inspired the LC 500h\'s design?',
      options: ['LF-LC Concept', 'Classic GT cars', 'European sports cars', 'Modern architecture'],
      correctAnswer: 0,
      explanation: 'The LC 500h\'s design is directly inspired by the stunning LF-LC concept car.',
      salesTip: 'It\'s rare for a production car to stay so true to a concept - the LC 500h is rolling automotive art.'
    },
    {
      id: 61,
      productId: 8,
      category: 'luxury',
      difficulty: 'intermediate',
      question: 'What premium audio system is available in the LC 500h?',
      options: ['Premium Sound', 'Mark Levinson Reference', 'Bose Surround', 'Harman Kardon'],
      correctAnswer: 1,
      explanation: 'The available Mark Levinson Reference Surround Sound system provides audiophile-quality sound.',
      salesTip: 'Mark Levinson Reference is their top-tier system - transforms the LC 500h into a mobile concert hall.'
    },
    {
      id: 62,
      productId: 8,
      category: 'technology',
      difficulty: 'easy',
      question: 'What advanced display technology does the LC 500h feature?',
      options: ['Standard LCD', 'TFT Display', 'Digital Instrument Cluster', 'Head-Up Display'],
      correctAnswer: 2,
      explanation: 'The LC 500h features a customizable digital instrument cluster with multiple display modes.',
      salesTip: 'The driver can customize the display for different driving modes - sport, comfort, or efficiency focus.'
    },
    {
      id: 63,
      productId: 8,
      category: 'efficiency',
      difficulty: 'easy',
      question: 'What is the LC 500h\'s combined fuel economy?',
      options: ['26 MPG', '28 MPG', '30 MPG', '35 MPG'],
      correctAnswer: 2,
      explanation: 'The LC 500h achieves 30 MPG combined, impressive for a performance-oriented grand tourer.',
      salesTip: 'Exceptional efficiency for a high-performance coupe - you can enjoy spirited driving without frequent fuel stops.'
    },
    {
      id: 64,
      productId: 8,
      category: 'exclusivity',
      difficulty: 'easy',
      question: 'What makes the LC 500h exclusive in the market?',
      options: ['High price only', 'Limited production', 'Only luxury hybrid coupe', 'Custom options'],
      correctAnswer: 2,
      explanation: 'The LC 500h is virtually the only luxury hybrid coupe in its segment.',
      salesTip: 'If customers want a luxury hybrid coupe, this is essentially their only choice - unique market position.'
    },

    // GENERAL/OVERALL QUESTIONS (Product ID: 0) - 16 Questions
    {
      id: 65,
      productId: 0,
      category: 'hybrid_technology',
      difficulty: 'easy',
      question: 'What is the main advantage of hybrid vehicles over conventional cars?',
      options: ['More power', 'Better fuel economy', 'Lower maintenance', 'Faster acceleration'],
      correctAnswer: 1,
      explanation: 'Hybrid vehicles primarily offer better fuel economy by combining electric and gasoline power sources.',
      salesTip: 'Focus on fuel savings - at current gas prices, hybrids can save customers $1000+ annually in fuel costs.'
    },
    {
      id: 66,
      productId: 0,
      category: 'luxury_market',
      difficulty: 'intermediate',
      question: 'What percentage of luxury car buyers now consider fuel efficiency important?',
      options: ['45%', '62%', '78%', '89%'],
      correctAnswer: 2,
      explanation: 'Recent studies show 78% of luxury car buyers now consider fuel efficiency an important factor.',
      salesTip: 'Luxury buyers today want it all - performance, comfort, AND efficiency. Hybrid luxury vehicles deliver on all fronts.'
    },
    {
      id: 67,
      productId: 0,
      category: 'environmental',
      difficulty: 'easy',
      question: 'How do hybrid vehicles help reduce emissions?',
      options: ['Electric-only driving', 'More efficient engines', 'Regenerative braking', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Hybrid vehicles reduce emissions through electric driving, efficient engines, and energy recovery systems.',
      salesTip: 'Emphasize that customers can reduce their carbon footprint without sacrificing luxury or performance.'
    },
    {
      id: 68,
      productId: 0,
      category: 'maintenance',
      difficulty: 'intermediate',
      question: 'How does hybrid vehicle maintenance compare to conventional cars?',
      options: ['Much higher', 'Slightly higher', 'About the same', 'Often lower'],
      correctAnswer: 3,
      explanation: 'Hybrid maintenance is often lower due to reduced engine wear and regenerative braking extending brake life.',
      salesTip: 'Address maintenance concerns upfront - hybrids often cost less to maintain due to reduced wear on components.'
    },
    {
      id: 69,
      productId: 0,
      category: 'resale_value',
      difficulty: 'easy',
      question: 'How do luxury hybrid vehicles perform in terms of resale value?',
      options: ['Poor resale', 'Below average', 'Average', 'Above average'],
      correctAnswer: 3,
      explanation: 'Luxury hybrid vehicles typically maintain above-average resale values due to demand and efficiency.',
      salesTip: 'Hybrids hold their value better than conventional luxury cars - it\'s an investment that pays off long-term.'
    },
    {
      id: 70,
      productId: 0,
      category: 'customer_profile',
      difficulty: 'intermediate',
      question: 'What is the typical age range of luxury hybrid buyers?',
      options: ['25-35', '35-45', '45-55', '55-65'],
      correctAnswer: 1,
      explanation: 'The primary luxury hybrid buyer demographic is 35-45 years old, educated professionals with families.',
      salesTip: 'These buyers value both performance and responsibility - they want to set a good example while enjoying luxury.'
    },
    {
      id: 71,
      productId: 0,
      category: 'incentives',
      difficulty: 'easy',
      question: 'What types of incentives might hybrid vehicle buyers receive?',
      options: ['Federal tax credits only', 'State rebates only', 'HOV lane access only', 'Multiple incentive types'],
      correctAnswer: 3,
      explanation: 'Hybrid buyers may benefit from federal tax credits, state rebates, HOV lane access, and reduced registration fees.',
      salesTip: 'Help customers understand all available incentives - the total savings can be substantial and varies by location.'
    },
    {
      id: 72,
      productId: 0,
      category: 'technology',
      difficulty: 'advanced',
      question: 'What is regenerative braking in hybrid vehicles?',
      options: ['Electric brake assist', 'Energy recovery system', 'Automatic braking', 'Brake cooling system'],
      correctAnswer: 1,
      explanation: 'Regenerative braking captures energy during deceleration and converts it back to electricity to charge the battery.',
      salesTip: 'This technology means the car actually helps recharge itself while driving - like getting free energy from braking.'
    },
    {
      id: 73,
      productId: 0,
      category: 'sales_process',
      difficulty: 'intermediate',
      question: 'What should you emphasize when selling luxury hybrids to first-time hybrid buyers?',
      options: ['Complex technology', 'Fuel savings only', 'Simplicity and benefits', 'Environmental impact only'],
      correctAnswer: 2,
      explanation: 'Focus on simplicity of operation and tangible benefits rather than complex technical details.',
      salesTip: 'Make it simple - "It drives like any luxury car, but uses less fuel and helps the environment. No plugging in required."'
    },
    {
      id: 74,
      productId: 0,
      category: 'competition',
      difficulty: 'easy',
      question: 'What is the main competitive advantage of our luxury hybrid lineup?',
      options: ['Lowest price', 'Most models available', 'Best warranty coverage', 'Proven reliability'],
      correctAnswer: 1,
      explanation: 'Our dealership offers the widest selection of luxury hybrid vehicles from multiple premium brands.',
      salesTip: 'We can find the perfect luxury hybrid for any customer\'s needs - sedan, SUV, coupe, or wagon in various price ranges.'
    },
    {
      id: 75,
      productId: 0,
      category: 'closing',
      difficulty: 'advanced',
      question: 'What is the most effective closing technique for luxury hybrid sales?',
      options: ['Price pressure', 'Immediate decision', 'Value proposition summary', 'Limited availability'],
      correctAnswer: 2,
      explanation: 'Summarizing the complete value proposition helps customers justify the luxury hybrid investment.',
      salesTip: 'Recap fuel savings, environmental benefits, luxury features, and incentives to show total value exceeds the premium.'
    },
    {
      id: 76,
      productId: 0,
      category: 'financing',
      difficulty: 'easy',
      question: 'How should financing be presented for luxury hybrid vehicles?',
      options: ['Focus on monthly payment', 'Emphasize total cost', 'Include fuel savings in calculation', 'Standard financing only'],
      correctAnswer: 2,
      explanation: 'Include projected fuel savings in the total cost of ownership calculation to show true value.',
      salesTip: 'When you factor in fuel savings, the effective monthly cost is often lower than a comparable non-hybrid luxury car.'
    },
    {
      id: 77,
      productId: 0,
      category: 'objection_handling',
      difficulty: 'intermediate',
      question: 'What is the best response to "Hybrids are too complicated"?',
      options: ['Explain technical details', 'Agree and move on', 'Demonstrate simplicity', 'Focus on other features'],
      correctAnswer: 2,
      explanation: 'Demonstrate that hybrid operation is completely automatic and transparent to the driver.',
      salesTip: 'Let them drive it - once they experience how seamlessly it operates, the complexity concern disappears.'
    },
    {
      id: 78,
      productId: 0,
      category: 'follow_up',
      difficulty: 'easy',
      question: 'What is the ideal follow-up timeframe after a hybrid test drive?',
      options: ['Same day', '1-2 days', '1 week', '2 weeks'],
      correctAnswer: 1,
      explanation: 'Follow up within 1-2 days while the positive driving experience is still fresh in their memory.',
      salesTip: 'Call to ask about their experience and address any questions that came up after they had time to think about it.'
    },
    {
      id: 79,
      productId: 0,
      category: 'market_trends',
      difficulty: 'intermediate',
      question: 'What trend is driving increased luxury hybrid adoption?',
      options: ['Lower prices only', 'Government mandates', 'Corporate environmental policies', 'Fuel price volatility'],
      correctAnswer: 2,
      explanation: 'Many companies now have environmental policies that encourage employees to choose efficient vehicles.',
      salesTip: 'Ask if their employer has any environmental initiatives - many companies now provide incentives for efficient vehicles.'
    },
    {
      id: 80,
      productId: 0,
      category: 'customer_service',
      difficulty: 'easy',
      question: 'What ongoing support should be provided to hybrid vehicle owners?',
      options: ['Technical training only', 'Maintenance reminders only', 'Comprehensive ownership support', 'Basic warranty service'],
      correctAnswer: 2,
      explanation: 'Provide comprehensive support including maintenance, questions about efficiency features, and ongoing education.',
      salesTip: 'Position yourself as their hybrid vehicle expert - they should call you first with any questions or concerns.'
    }
  ],

  qAndA: [
    // LEXUS ES 300h Q&A
    {
      productId: 1,
      category: 'hybrid_technology',
      questions: [
        {
          question: 'How does the Lexus Hybrid Drive system work?',
          answer: 'The Lexus Hybrid Drive seamlessly switches between the 2.5L gasoline engine and electric motor, or combines both for optimal power and efficiency. The system automatically determines the most efficient power source based on driving conditions.',
          followUp: 'The battery charges through regenerative braking and engine operation - no plugging in required, making it incredibly convenient.'
        },
        {
          question: 'Will I need to plug in the ES 300h to charge?',
          answer: 'No, the ES 300h is a self-charging hybrid. The battery automatically charges through regenerative braking and engine operation. You never need to plug it in, making it incredibly convenient.',
          followUp: 'This eliminates range anxiety and charging infrastructure concerns that come with plug-in vehicles.'
        },
        {
          question: 'How reliable is the hybrid technology?',
          answer: 'Lexus hybrid technology is extremely reliable, with over 20 years of development and millions of vehicles on the road. The ES 300h comes with an 8-year/100,000-mile hybrid component warranty.',
          followUp: 'Many Lexus hybrids exceed 300,000 miles with minimal maintenance requirements.'
        }
      ]
    },
    {
      productId: 1,
      category: 'efficiency_economy',
      questions: [
        {
          question: 'How much money will I save on fuel with the ES 300h?',
          answer: 'With 44 MPG combined vs. typical luxury sedans at 25-28 MPG, you could save $800-1,200 annually in fuel costs, depending on driving habits and fuel prices.',
          followUp: 'Over 5 years, this could amount to $4,000-6,000 in fuel savings - significant money back in your pocket.'
        },
        {
          question: 'Does the hybrid system affect performance?',
          answer: 'Not at all. The hybrid system actually enhances performance by providing instant electric torque at low speeds while maintaining smooth power delivery throughout the speed range.',
          followUp: 'The 215 HP total system power provides excellent acceleration while remaining whisper-quiet.'
        }
      ]
    },

    // LEXUS NX 350h Q&A  
    {
      productId: 2,
      category: 'capability_performance',
      questions: [
        {
          question: 'Can the NX 350h handle off-road driving?',
          answer: 'Yes, the NX 350h features standard AWD and enhanced ground clearance, making it capable of light off-road adventures, snow conditions, and challenging weather.',
          followUp: 'The hybrid AWD system provides instant traction control since electric motors can respond faster than mechanical systems.'
        },
        {
          question: 'How does the AWD system work in the NX 350h?',
          answer: 'The NX 350h uses an electric motor to power the rear wheels, providing instant AWD response. This system is more efficient than traditional mechanical AWD systems.',
          followUp: 'The electric rear motor eliminates the need for a transfer case and driveshaft, reducing weight and complexity.'
        },
        {
          question: 'What is the real-world fuel economy I can expect?',
          answer: 'Most customers achieve 35-39 MPG in combined driving, with city driving often exceeding 40 MPG due to the hybrid system\'s efficiency in stop-and-go traffic.',
          followUp: 'Highway efficiency is around 35-37 MPG, which is exceptional for an AWD luxury SUV.'
        }
      ]
    },

    // ACURA MDX SPORT HYBRID Q&A
    {
      productId: 3,
      category: 'family_practicality',
      questions: [
        {
          question: 'How does the third row seating work in the MDX Sport Hybrid?',
          answer: 'The third row is designed for adults, not just children. It features easy access through the second-row captain\'s chairs and adequate legroom for passengers up to 6 feet tall.',
          followUp: 'The 60/40 split third row folds flat for maximum cargo space when not needed for passengers.'
        },
        {
          question: 'What is the cargo capacity with all seats in use?',
          answer: 'With all three rows in use, the MDX Sport Hybrid provides 16.3 cubic feet of cargo space - enough for groceries, sports equipment, and daily family needs.',
          followUp: 'Fold the third row and you get 50.5 cubic feet, fold all rear seats for 95 cubic feet of maximum cargo space.'
        },
        {
          question: 'How does the SH-AWD system help with family safety?',
          answer: 'SH-AWD can send power to individual wheels as needed, providing maximum traction in snow, rain, or emergency situations. It\'s like having a safety net for your family.',
          followUp: 'The system works proactively, preventing slides before they happen rather than just reacting to them.'
        }
      ]
    },

    // GENESIS G90 HYBRID Q&A
    {
      productId: 4,
      category: 'luxury_service',
      questions: [
        {
          question: 'What makes Genesis service different from other luxury brands?',
          answer: 'Genesis provides complimentary scheduled maintenance, valet service that picks up and delivers your vehicle, and a premium loaner vehicle during service - all included at no extra cost.',
          followUp: 'Many luxury brands charge extra for these services, but Genesis includes them to enhance the ownership experience.'
        },
        {
          question: 'How does the G90 Hybrid compare to Mercedes S-Class or BMW 7 Series?',
          answer: 'The G90 Hybrid offers comparable or superior luxury features at a better value, plus our 10-year warranty vs. their 4-year coverage. You get more luxury and better protection.',
          followUp: 'Genesis also includes features that are expensive options on German competitors, making the total value proposition very compelling.'
        },
        {
          question: 'What is the real-world performance like with 429 HP?',
          answer: 'The G90 Hybrid accelerates from 0-60 mph in just 5.1 seconds while delivering smooth, refined power. It feels more responsive than most V8 engines due to electric motor torque.',
          followUp: 'The hybrid system provides instant torque fill, eliminating any turbo lag for seamless acceleration.'
        }
      ]
    },

    // BMW 530e xDrive Q&A
    {
      productId: 5,
      category: 'plug_in_hybrid_operation',
      questions: [
        {
          question: 'How often do I need to charge the 530e xDrive?',
          answer: 'For maximum efficiency, charge daily using a standard 240V outlet. However, the vehicle operates perfectly as a regular hybrid even without charging, thanks to the gasoline engine backup.',
          followUp: 'Many customers charge at home overnight and arrive at work on electric power alone, then charge again during the workday.'
        },
        {
          question: 'What happens if I forget to charge it?',
          answer: 'Nothing bad! The 530e automatically operates as a conventional hybrid, still achieving excellent fuel economy. The gasoline engine ensures you\'re never stranded.',
          followUp: 'You\'ll still get better fuel economy than a regular 530i, even without charging the battery.'
        },
        {
          question: 'Are there any government incentives for the 530e xDrive?',
          answer: 'Yes, as a plug-in hybrid, the 530e xDrive may qualify for federal tax credits and state rebates. We can help you determine what incentives apply in your situation.',
          followUp: 'These incentives can significantly reduce the effective purchase price, often making the hybrid cost less than the conventional model.'
        }
      ]
    },

    // MERCEDES E 450 ALL-TERRAIN Q&A
    {
      productId: 6,
      category: 'wagon_versatility',
      questions: [
        {
          question: 'Why choose a wagon over an SUV?',
          answer: 'Wagons offer better fuel economy, easier loading height, superior handling, and more cargo space than most SUVs, while maintaining luxury car ride quality and performance.',
          followUp: 'The lower center of gravity provides better handling and stability, especially important for families carrying precious cargo.'
        },
        {
          question: 'Can the E 450 All-Terrain really handle rough roads?',
          answer: 'Yes, with 6.3 inches of ground clearance, protective body cladding, and advanced 4MATIC AWD, it can handle gravel roads, light trails, and severe weather conditions.',
          followUp: 'The Air Body Control suspension automatically adjusts for optimal ground clearance and comfort in any conditions.'
        },
        {
          question: 'How does the 48V EQBoost system work?',
          answer: 'The 48V mild hybrid system provides additional torque during acceleration, enables smooth stop/start operation, and recovers energy during coasting and braking.',
          followUp: 'It\'s completely seamless - you\'ll never notice it working, but you\'ll appreciate the improved efficiency and performance.'
        }
      ]
    },

    // VOLVO XC90 T8 Q&A
    {
      productId: 7,
      category: 'scandinavian_luxury_safety',
      questions: [
        {
          question: 'What makes Scandinavian luxury different?',
          answer: 'Scandinavian luxury emphasizes functionality, sustainability, and wellbeing over ostentation. It\'s about thoughtful design, premium materials, and features that enhance daily life.',
          followUp: 'Volvo focuses on creating a serene, healthy cabin environment with clean air, comfortable seating, and intuitive technology.'
        },
        {
          question: 'How does Volvo\'s safety reputation apply to the XC90 T8?',
          answer: 'The XC90 T8 earned top safety ratings and includes advanced features like City Safety collision avoidance, Pilot Assist, and run-off road protection as standard equipment.',
          followUp: 'Volvo\'s goal is zero fatalities or serious injuries in any new Volvo by 2020 - they engineer every vehicle with this mission in mind.'
        },
        {
          question: 'What is the CleanZone interior air quality system?',
          answer: 'CleanZone monitors incoming air and closes vents if harmful pollutants are detected. It also pre-cleans the cabin air before you enter the vehicle.',
          followUp: 'This is especially valuable for families with allergies or anyone concerned about air quality in urban environments.'
        }
      ]
    },

    // LEXUS LC 500h Q&A
    {
      productId: 8,
      category: 'grand_touring_performance',
      questions: [
        {
          question: 'Is the LC 500h a practical daily driver?',
          answer: 'While it\'s a focused grand tourer, the LC 500h offers surprising practicality with a decent trunk, comfortable seating for two adults, and excellent fuel economy for long trips.',
          followUp: 'The hybrid system makes it perfect for both spirited weekend drives and efficient daily commuting.'
        },
        {
          question: 'How does the Multi-Stage Hybrid CVT feel compared to a regular CVT?',
          answer: 'Unlike typical CVTs, the Multi-Stage system provides distinct gear-like steps and engine sounds that match acceleration, making it feel like a traditional automatic transmission.',
          followUp: 'It eliminates the "rubber band" effect of conventional CVTs while maintaining the efficiency benefits of the hybrid system.'
        },
        {
          question: 'What makes the LC 500h special compared to other luxury coupes?',
          answer: 'It\'s the only luxury hybrid coupe in its class, combining stunning design, advanced hybrid technology, and grand touring capability in a unique package.',
          followUp: 'The Takumi craftsmanship and attention to detail rivals the finest luxury brands at a more accessible price point.'
        }
      ]
    },

    // GENERAL/OVERALL Q&A
    {
      productId: 0,
      category: 'hybrid_benefits_general',
      questions: [
        {
          question: 'Are hybrid vehicles really worth the extra cost?',
          answer: 'Yes, when you factor in fuel savings, potential incentives, higher resale value, and reduced emissions, hybrids typically provide better total cost of ownership than conventional vehicles.',
          followUp: 'Most customers break even on the hybrid premium within 2-3 years, then enjoy pure savings for the rest of ownership.'
        },
        {
          question: 'Do hybrids require special maintenance?',
          answer: 'Hybrids actually require less maintenance than conventional vehicles. Brake pads last longer due to regenerative braking, and the gasoline engine experiences less wear.',
          followUp: 'The main difference is periodic hybrid system inspections, which are typically included in your regular maintenance schedule.'
        },
        {
          question: 'What happens to hybrid batteries when they wear out?',
          answer: 'Hybrid batteries typically last 8-12 years and are fully recyclable. Most manufacturers also offer battery replacement programs and extended warranties.',
          followUp: 'Battery technology has improved significantly - early failure is rare, and replacement costs have decreased substantially.'
        }
      ]
    },
    {
      productId: 0,
      category: 'luxury_hybrid_market',
      questions: [
        {
          question: 'Why are luxury buyers choosing hybrids now?',
          answer: 'Today\'s luxury buyers want sophisticated technology, environmental responsibility, and exceptional efficiency without compromising performance or comfort.',
          followUp: 'Hybrid technology has matured to the point where it enhances rather than compromises the luxury experience.'
        },
        {
          question: 'How do luxury hybrids perform compared to conventional luxury cars?',
          answer: 'Modern luxury hybrids often outperform their conventional counterparts in acceleration, refinement, and technology, while providing substantially better fuel economy.',
          followUp: 'The instant torque from electric motors actually improves performance, especially in city driving and acceleration from stops.'
        }
      ]
    }
  ],

  objectionHandling: [
    // LEXUS ES 300h OBJECTION HANDLING
    {
      productId: 1,
      objections: [
        {
          objection: 'Hybrid vehicles are too expensive',
          category: 'price',
          response: 'While the initial price is higher, the ES 300h pays for itself through fuel savings. With 44 MPG combined, you\'ll save approximately $1,000 annually in fuel costs compared to non-hybrid luxury sedans.',
          followUp: 'Plus, you get the 8-year/100,000-mile hybrid warranty and potential resale value benefits. When you factor in incentives and fuel savings, the total cost of ownership is often lower.',
          proofPoints: ['44 MPG combined vs 25-28 MPG for competitors', '$800-1,200 annual fuel savings', 'Extended hybrid warranty coverage', 'Higher resale value retention']
        },
        {
          objection: 'I don\'t want to deal with complex hybrid technology',
          category: 'technology',
          response: 'The ES 300h is actually simpler to operate than traditional vehicles. There\'s no plugging in, no range anxiety, and no change to your driving routine. The hybrid system operates completely automatically.',
          followUp: 'Lexus has over 20 years of hybrid experience with millions of vehicles on the road proving the reliability. You\'ll never even think about the hybrid system - it just quietly saves you money.',
          proofPoints: ['Self-charging - no plugging in required', 'Automatic operation', '20+ years of proven hybrid technology', 'Millions of vehicles in service']
        },
        {
          objection: 'Hybrid performance isn\'t as good',
          category: 'performance',
          response: 'The ES 300h actually provides better low-end performance than traditional engines due to instant electric torque. The 215 HP system delivers smooth, responsive acceleration while being remarkably quiet.',
          followUp: 'You get sports car-like instant torque with luxury sedan refinement. The electric motor fills in any gaps in power delivery for a seamless driving experience.',
          proofPoints: ['215 HP total system power', 'Instant electric torque', 'Whisper-quiet operation', '0-60 in 8.0 seconds']
        },
        {
          objection: 'I\'m loyal to [other luxury brand]',
          category: 'brand_loyalty',
          response: 'I respect brand loyalty, and that speaks well of you as a customer. However, Lexus invented luxury hybrids and has the most advanced technology. Once you experience the ES 300h\'s efficiency and refinement, you\'ll understand why we\'re the hybrid leader.',
          followUp: 'We\'re confident enough in our product to offer a comprehensive test drive program. Many of our best customers were initially loyal to other brands.',
          proofPoints: ['Lexus pioneered luxury hybrids', 'Most advanced hybrid technology', 'Industry-leading reliability ratings', 'Comprehensive test drive program']
        },
        {
          objection: 'The styling isn\'t sporty enough',
          category: 'appearance',
          response: 'The ES 300h offers sophisticated, elegant styling that appeals to discerning customers. The design emphasizes luxury and refinement while incorporating subtle sporty elements like the spindle grille and LED lighting.',
          followUp: 'The interior combines luxury materials with advanced technology for a truly premium experience. Remember, understated elegance is often more impressive than flashy styling.',
          proofPoints: ['Sophisticated, elegant design', 'Premium interior materials', 'Advanced LED lighting signature', 'Timeless styling that ages well']
        }
      ]
    },

    // LEXUS NX 350h OBJECTION HANDLING
    {
      productId: 2,
      objections: [
        {
          objection: 'SUVs aren\'t as efficient as sedans',
          category: 'efficiency',
          response: 'The NX 350h achieves 37 MPG combined, which exceeds most luxury sedans and beats non-hybrid SUVs by 8-12 MPG. You get SUV versatility with sedan-like efficiency.',
          followUp: 'The hybrid AWD system is actually more efficient than traditional mechanical AWD because it uses electric power for the rear wheels.',
          proofPoints: ['37 MPG combined rating', 'Beats most luxury sedans', '8-12 MPG better than non-hybrid SUVs', 'Electric AWD system efficiency']
        },
        {
          objection: 'I need more cargo space than an SUV this size',
          category: 'practicality',
          response: 'The NX 350h offers 54.6 cubic feet of cargo space with seats folded, plus creative storage solutions throughout. It\'s designed to maximize space efficiency while maintaining the refined driving dynamics you want.',
          followUp: 'Many customers find the thoughtful storage design more useful than just raw space. Everything has a place, and the power liftgate makes loading effortless.',
          proofPoints: ['54.6 cubic feet cargo space', 'Creative storage solutions', 'Power liftgate standard', 'Space-efficient design']
        },
        {
          objection: 'AWD systems are complex and expensive to maintain',
          category: 'maintenance',
          response: 'The NX 350h uses an electric AWD system that\'s actually simpler than mechanical systems - no transfer case, no driveshaft to the rear. It\'s more reliable with fewer components to maintain.',
          followUp: 'Plus, you get our comprehensive warranty coverage and the system is designed for 200,000+ mile durability. It\'s engineered for long-term reliability.',
          proofPoints: ['Simpler electric AWD design', 'Fewer mechanical components', 'Comprehensive warranty coverage', '200,000+ mile durability design']
        }
      ]
    },

    // ACURA MDX SPORT HYBRID OBJECTION HANDLING
    {
      productId: 3,
      objections: [
        {
          objection: 'Acura isn\'t as prestigious as German luxury brands',
          category: 'brand_perception',
          response: 'Acura has consistently ranked at the top for reliability and customer satisfaction, often outperforming German brands. The MDX Sport Hybrid offers superior technology like SH-AWD that German competitors don\'t match.',
          followUp: 'Plus, you get more standard features, better warranty coverage, and lower maintenance costs. True luxury is about the ownership experience, not just the badge.',
          proofPoints: ['Top reliability rankings', 'Superior SH-AWD technology', 'More standard features', 'Better warranty coverage']
        },
        {
          objection: 'I don\'t need a third row - it\'s wasted space',
          category: 'practicality',
          response: 'The third row folds completely flat when not in use, giving you maximum cargo space. When you do need it for guests, carpools, or growing family needs, it\'s there - like having an insurance policy.',
          followUp: 'Many customers initially don\'t think they need it, but find it invaluable for occasional use. It adds flexibility without compromising daily usability.',
          proofPoints: ['Folds completely flat', 'Maximum cargo when folded', 'Adult-sized third row', 'Flexible seating configurations']
        },
        {
          objection: 'Three-row SUVs are too big for daily driving',
          category: 'size_concerns',
          response: 'The MDX Sport Hybrid is designed to drive like a smaller SUV thanks to the precise SH-AWD system and advanced suspension. It\'s actually easier to maneuver than many two-row SUVs.',
          followUp: 'The hybrid system also helps in tight spaces - you can move purely on electric power for quiet, smooth maneuvering in parking lots.',
          proofPoints: ['SH-AWD precise handling', 'Easier to maneuver than expected', 'Electric-only movement capability', 'Advanced suspension tuning']
        }
      ]
    },

    // GENESIS G90 HYBRID OBJECTION HANDLING
    {
      productId: 4,
      objections: [
        {
          objection: 'Genesis is too new as a luxury brand',
          category: 'brand_perception',
          response: 'Genesis is backed by Hyundai\'s 50+ years of automotive expertise and represents the pinnacle of their engineering. We\'ve won numerous awards including luxury car of the year, and our customer satisfaction ratings rival established brands.',
          followUp: 'This allows us to offer cutting-edge technology and features that traditional luxury brands are still catching up to. We\'re not burdened by legacy systems or old thinking.',
          proofPoints: ['Multiple luxury car awards', 'Top customer satisfaction ratings', 'Backed by proven automotive expertise', 'Latest technology and features']
        },
        {
          objection: 'The price is too high for a Genesis',
          category: 'price',
          response: 'When you compare feature-for-feature against Mercedes S-Class or BMW 7 Series, the G90 Hybrid offers superior value. You get the same luxury features plus our comprehensive warranty coverage and complimentary maintenance.',
          followUp: 'Our 10-year/100,000-mile warranty is double what German luxury brands offer. When you factor in the included services and warranty coverage, the G90 Hybrid is actually the better value.',
          proofPoints: ['Feature-for-feature comparison advantage', '10-year/100,000-mile warranty', 'Complimentary maintenance included', 'Better total value proposition']
        },
        {
          objection: 'I need proven resale value',
          category: 'resale_value',
          response: 'Genesis residual values are strengthening as the brand gains recognition. The G90 Hybrid\'s advanced technology, comprehensive warranty, and limited production numbers actually enhance its collectibility potential.',
          followUp: 'Plus, your lower initial investment compared to German competitors means you\'re already ahead on total cost of ownership. The hybrid technology also helps maintain value.',
          proofPoints: ['Strengthening residual values', 'Limited production enhances collectibility', 'Lower initial investment', 'Hybrid technology value retention']
        }
      ]
    },

    // BMW 530e xDrive OBJECTION HANDLING
    {
      productId: 5,
      objections: [
        {
          objection: 'I don\'t want to deal with charging',
          category: 'charging',
          response: 'The 530e xDrive is incredibly flexible. You can charge at home using a regular 240V outlet in 3.5 hours, or you can drive it like a regular hybrid without ever plugging in. The gasoline engine provides unlimited range.',
          followUp: 'Most customers find home charging more convenient than gas stations - you start every day with a "full tank." But if you forget or can\'t charge, no problem.',
          proofPoints: ['Works as hybrid without charging', '3.5-hour charge time at home', 'Unlimited range with gasoline backup', 'More convenient than gas stations']
        },
        {
          objection: 'Electric range is too short',
          category: 'range',
          response: 'The 21-mile electric range covers most daily errands and short commutes. For longer trips, the gasoline engine seamlessly takes over. This gives you the benefit of electric driving when possible with no range limitations.',
          followUp: 'Studies show most trips are under 20 miles, so you could do many errands on electric power alone. You get the best of both worlds without compromise.',
          proofPoints: ['21-mile electric range', 'Most trips under 20 miles', 'Unlimited total range', 'Seamless transition to hybrid mode']
        },
        {
          objection: 'BMW maintenance is expensive',
          category: 'maintenance',
          response: 'BMW includes complimentary scheduled maintenance, and hybrid vehicles actually require less maintenance due to reduced wear on the gasoline engine. The electric motor has virtually no maintenance requirements.',
          followUp: 'The 8-year hybrid warranty also protects your investment in the hybrid components. Many customers find their total maintenance costs are lower than expected.',
          proofPoints: ['Complimentary scheduled maintenance', 'Reduced engine wear', '8-year hybrid component warranty', 'Electric motor minimal maintenance']
        }
      ]
    },

    // MERCEDES E 450 ALL-TERRAIN OBJECTION HANDLING
    {
      productId: 6,
      objections: [
        {
          objection: 'Wagons are not popular in America',
          category: 'market_acceptance',
          response: 'Wagons are experiencing a renaissance among discerning buyers who want SUV capability with better fuel economy and handling. The All-Terrain offers the best of both worlds for sophisticated customers.',
          followUp: 'You\'ll be part of an exclusive group who chose function and efficiency over following trends. Plus, the raised ride height gives it an SUV-like presence.',
          proofPoints: ['Growing wagon popularity', 'Better fuel economy than SUVs', 'Superior handling characteristics', 'Exclusive ownership experience']
        },
        {
          objection: 'It doesn\'t have enough ground clearance for real off-road use',
          category: 'capability',
          response: 'The E 450 All-Terrain isn\'t designed for extreme off-roading - it\'s engineered for the adventures most customers actually take: gravel roads, camping trips, ski resorts, and severe weather.',
          followUp: 'The 6.3 inches of ground clearance plus advanced 4MATIC AWD handles 95% of what customers encounter while maintaining luxury ride quality on pavement.',
          proofPoints: ['6.3 inches ground clearance', 'Advanced 4MATIC AWD', 'Designed for real-world adventures', 'Luxury ride quality maintained']
        },
        {
          objection: 'The mild hybrid system doesn\'t provide enough fuel savings',
          category: 'efficiency',
          response: 'The 48V EQBoost system provides meaningful efficiency improvements - about 10% better fuel economy plus enhanced performance through electric torque assistance.',
          followUp: 'It\'s also completely seamless and adds no complexity to your driving experience. You get efficiency benefits without any of the range anxiety or charging concerns of other hybrid systems.',
          proofPoints: ['10% fuel economy improvement', 'Electric torque assistance', 'Seamless operation', 'No range anxiety or charging needs']
        }
      ]
    },

    // VOLVO XC90 T8 OBJECTION HANDLING
    {
      productId: 7,
      objections: [
        {
          objection: 'Volvo isn\'t as luxurious as German brands',
          category: 'luxury_perception',
          response: 'The XC90 T8 Inscription offers Scandinavian luxury that emphasizes sophisticated simplicity and exceptional craftsmanship. Features like Nappa leather, Bowers & Wilkins audio, and Orrefors crystal details rival any luxury brand.',
          followUp: 'Volvo\'s approach to luxury focuses on wellbeing and sustainability, which resonates with today\'s luxury buyers. It\'s luxury with a conscience and purpose.',
          proofPoints: ['Scandinavian luxury design', 'Bowers & Wilkins premium audio', 'Orrefors crystal craftsmanship', 'Focus on wellbeing and sustainability']
        },
        {
          objection: 'I\'m concerned about reliability',
          category: 'reliability',
          response: 'Volvo has significantly improved reliability and now ranks among the top luxury brands. The XC90 T8 comes with comprehensive warranty coverage, and our hybrid technology is proven across millions of miles.',
          followUp: 'Volvo\'s focus on safety extends to reliability - we build vehicles to last. Our goal of zero fatalities means we can\'t compromise on any aspect of vehicle integrity.',
          proofPoints: ['Improved reliability rankings', 'Comprehensive warranty coverage', 'Proven hybrid technology', 'Safety-focused engineering approach']
        },
        {
          objection: 'Seven seats compromise comfort',
          category: 'comfort',
          response: 'The XC90 T8 is designed as a luxury seven-seater from the ground up. All three rows offer genuine comfort with excellent legroom, and the second-row captain\'s chairs rival first-class airline seats.',
          followUp: 'The air suspension automatically adjusts to maintain ride quality regardless of passenger load. It\'s one of the few seven-seaters that doesn\'t compromise on luxury.',
          proofPoints: ['Purpose-built seven-seater design', 'Captain\'s chairs in second row', 'Air suspension for optimal comfort', 'No compromise on luxury']
        }
      ]
    },

    // LEXUS LC 500h OBJECTION HANDLING
    {
      productId: 8,
      objections: [
        {
          objection: 'It\'s not practical as a daily driver',
          category: 'practicality',
          response: 'While the LC 500h is a focused grand tourer, it offers surprising daily usability with a decent trunk, comfortable seating, and excellent fuel economy for commuting. Many customers use it as their primary vehicle.',
          followUp: 'The hybrid system makes it perfect for both spirited weekend drives and efficient daily commuting. You don\'t have to choose between passion and practicality.',
          proofPoints: ['Decent trunk space', 'Comfortable daily seating', 'Excellent fuel economy', 'Dual-purpose capability']
        },
        {
          objection: 'Hybrid systems don\'t belong in sports cars',
          category: 'performance',
          response: 'The LC 500h\'s Multi-Stage Hybrid system actually enhances performance by providing instant torque and eliminating turbo lag. It delivers 354 HP with the response characteristics sports car enthusiasts want.',
          followUp: 'Formula 1 has used hybrid technology for years because it improves performance. The LC 500h applies this race-proven technology to the road.',
          proofPoints: ['354 HP total system power', 'Instant torque delivery', 'Formula 1 hybrid heritage', 'Enhanced performance characteristics']
        },
        {
          objection: 'It\'s too expensive for a Lexus',
          category: 'price',
          response: 'The LC 500h competes with European grand tourers costing $20,000-40,000 more. When you compare feature content, craftsmanship quality, and included maintenance, it represents exceptional value.',
          followUp: 'The Takumi master artisan craftsmanship and unique hybrid technology justify the price. You\'re getting exclusive engineering at a fraction of European exotic pricing.',
          proofPoints: ['Competes with higher-priced European GTs', 'Takumi master artisan craftsmanship', 'Unique hybrid technology', 'Exceptional value proposition']
        }
      ]
    },

    // GENERAL/OVERALL OBJECTION HANDLING
    {
      productId: 0,
      objections: [
        {
          objection: 'Hybrid vehicles are just a fad',
          category: 'market_trends',
          response: 'Hybrid technology has been proven for over 20 years and is now standard across luxury lineups. Major automakers are investing billions in hybrid technology because it\'s the future of efficient luxury transportation.',
          followUp: 'Even supercar manufacturers like Ferrari and McLaren use hybrid technology for performance. It\'s not a fad - it\'s advanced engineering that\'s here to stay.',
          proofPoints: ['20+ years of proven technology', 'Billions in manufacturer investment', 'Used in supercars for performance', 'Standard across luxury lineups']
        },
        {
          objection: 'I prefer the sound of a traditional engine',
          category: 'sensory_experience',
          response: 'Modern luxury hybrids still provide engine sound when you want it - the system automatically uses the gasoline engine during acceleration and highway driving. You get the best of both worlds.',
          followUp: 'Many customers appreciate the whisper-quiet operation in parking lots and city driving, plus the refined engine note during spirited driving. It\'s like having two personalities in one car.',
          proofPoints: ['Engine sound available when desired', 'Quiet operation when beneficial', 'Refined engine notes during acceleration', 'Dual personality design']
        },
        {
          objection: 'The technology is too complex and will break',
          category: 'reliability_complexity',
          response: 'Hybrid systems are actually simpler than traditional drivetrains in many ways - fewer moving parts, less engine wear, and proven reliability over millions of miles. The complexity is handled by sophisticated software.',
          followUp: 'All of our hybrid vehicles come with extended warranties specifically covering hybrid components, demonstrating manufacturer confidence in the technology.',
          proofPoints: ['Fewer moving parts than traditional', 'Millions of miles proven reliability', 'Sophisticated software management', 'Extended hybrid component warranties']
        },
        {
          objection: 'I don\'t want to be an early adopter',
          category: 'adoption_timing',
          response: 'Hybrid technology is now mature - Toyota has been perfecting it for over 20 years, and luxury hybrids have been refined through multiple generations. You\'re not an early adopter; you\'re joining millions of satisfied owners.',
          followUp: 'The technology has evolved to the point where it enhances rather than compromises the luxury experience. Early adoption was 15 years ago.',
          proofPoints: ['20+ years of development', 'Multiple generations of refinement', 'Millions of satisfied owners', 'Mature, proven technology']
        },
        {
          objection: 'Insurance and maintenance costs will be higher',
          category: 'ownership_costs',
          response: 'Insurance costs are typically comparable to conventional luxury vehicles, and maintenance is often lower due to reduced engine wear and longer brake life from regenerative braking.',
          followUp: 'Many insurance companies actually offer discounts for hybrid vehicles. Plus, the extended warranties on hybrid components provide additional protection and peace of mind.',
          proofPoints: ['Comparable insurance costs', 'Often lower maintenance requirements', 'Insurance company hybrid discounts', 'Extended hybrid component warranties']
        }
      ]
    }
  ]
};

module.exports = trainingData;