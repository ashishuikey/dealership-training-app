const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI Sales Coach
const SALES_COACH_SYSTEM_PROMPT = `You are an AI Sales Coach. Your job is to help train and improve the skills of a salesperson.

IMPORTANT: Keep your responses CONCISE - maximum 2-3 sentences for each point. Be direct and practical.

Ask the salesperson about their experience level and the type of products or services they sell.
Present realistic sales scenarios, such as handling objections, closing deals, or building rapport with clients.
After each scenario, provide constructive feedback and tips for improvement.
Offer role-play exercises, quizzes, and actionable advice.
Encourage the salesperson to reflect on their responses and suggest ways to improve.
Be supportive, motivational, and focus on practical skills that can be applied in real sales situations.

Example Start:
Hello! I'm your AI Sales Coach.
To get started, could you tell me a bit about your sales experience and what products or services you sell?
Once I know more, I'll present you with some realistic sales scenarios and help you practice your skills!

Keep responses SHORT, PRACTICAL, and ACTIONABLE. Avoid long explanations.`;

// Function to call GPT API
async function callGPTAPI(messages, isTraining = false) {
  try {
    const systemPrompt = isTraining ? SALES_COACH_SYSTEM_PROMPT : 
      "You are Gabru, a 5-year-old car genius talking to a salesman IN THE DEALERSHIP. Never say 'visit' or 'come to dealership' - you're both already there. Give ONLY facts in bullet points. Maximum 50 words. Just data, no advice.";
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 80,  // Further reduced to keep responses very short
      temperature: 0.7,
    });

    return {
      response: completion.choices[0].message.content,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// Fallback function for when API is not available

const salesKnowledgeBase = {
  // Product information
  products: {
    hybrid_benefits: "Hybrid vehicles offer several key advantages: better fuel economy (typically 30-50% better than conventional cars), lower emissions, reduced operating costs, and often qualify for government incentives. They're perfect for environmentally conscious luxury buyers.",
    lexus_es300h: "The Lexus ES 300h offers 215 total system HP with 44 MPG combined, priced at ₹43.16 lakhs. Key features include Lexus Safety System+ 2.5, 12.3\" multimedia display, and heated/ventilated seats. Perfect for luxury buyers seeking efficiency.",
    lexus_nx350h: "The NX 350h features standard AWD, 36 MPG combined, 2,000 lb towing capacity, priced at ₹40.26 lakhs. Includes Mark Levinson premium audio. It's our most versatile luxury hybrid SUV.",
    bmw_530e: "The BMW 530e xDrive offers 21 miles electric range, 73 MPGe, priced at ₹49.39 lakhs. It combines performance with efficiency and qualifies for government incentives.",
    warranty: "Most hybrid vehicles come with extended hybrid component warranties - typically 8 years/100,000 miles for the battery and hybrid system, providing peace of mind for customers."
  },
  
  // Sales techniques and objection handling
  sales_techniques: {
    price_objection: "When handling price objections, focus on total cost of ownership: 'While the initial investment is higher, you'll save ₹1.5-2.5 lakhs annually on fuel costs, plus potential government incentives. Over 5 years, you're actually saving money while driving a luxury vehicle.'",
    hybrid_complexity: "Address complexity concerns by emphasizing simplicity: 'Modern hybrids are actually simpler to operate than traditional cars - just start and drive. The car handles everything automatically. Plus, they're more reliable with fewer moving parts in the engine.'",
    performance_concern: "Counter performance worries: 'Our hybrid systems actually enhance performance. The BMW 530e has 288 HP combined, and the instant torque from electric motors provides smoother acceleration than conventional engines.'",
    maintenance_cost: "Regarding maintenance: 'Hybrid vehicles often have lower maintenance costs. Regenerative braking means brake pads last longer, and many components have fewer wear parts. Our warranty coverage is also more comprehensive.'",
    resale_value: "For resale concerns: 'Luxury hybrids actually hold their value better due to increasing demand for efficient vehicles and upcoming regulations. Early adopters of proven technology benefit most.'"
  },
  
  // Customer types and approaches
  customer_approaches: {
    environmentally_conscious: "Focus on environmental benefits: reduced emissions, sustainability features, and how they're contributing to a cleaner future while maintaining luxury.",
    cost_conscious: "Emphasize total cost savings: fuel savings, tax incentives, lower maintenance costs, and strong resale values.",
    technology_enthusiast: "Highlight advanced tech: regenerative braking, intelligent power management, advanced driver assistance systems, and cutting-edge infotainment.",
    luxury_focused: "Stress that hybrid doesn't mean compromise: same luxury features, often enhanced performance, and exclusive technology that separates them from conventional luxury cars."
  },
  
  // Financing and incentives
  financing: {
    government_incentives: "Government incentives available for hybrid vehicles, including reduced GST rates and potential state-level benefits. Varies by manufacturer and model.",
    state_incentives: "Many states offer additional benefits like reduced road tax, priority parking, and subsidies for charging infrastructure installation.",
    financing_options: "Special hybrid financing rates often available, attractive lease options, and manufacturer warranty programs provide additional value."
  }
};

function generateResponse(message, context) {
  const msg = message.toLowerCase();
  
  // Greeting responses
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Ready! What info you need?";
  }
  
  // Price range queries - DIRECT ANSWERS
  if ((msg.includes('30') && msg.includes('40')) || (msg.includes('30 lac') || msg.includes('40 lac')) || (msg.includes('30 lakh') || msg.includes('40 lakh'))) {
    return "1. Lexus NX 350h - ₹40.26 lakhs\n2. Genesis G80 - ₹38.5 lakhs\n3. Mercedes C 300e - ₹36.8 lakhs\n4. Audi A4 TFSI - ₹35.2 lakhs";
  }
  
  if ((msg.includes('40') && msg.includes('50')) || (msg.includes('40 lac') || msg.includes('50 lac')) || (msg.includes('40 lakh') || msg.includes('50 lakh'))) {
    return "1. BMW 530e xDrive - ₹49.39 lakhs\n2. Genesis G90 Hybrid - ₹47.8 lakhs\n3. Mercedes E 300e - ₹45.5 lakhs\n4. Lexus ES 300h - ₹43.16 lakhs";
  }
  
  if ((msg.includes('above 50') || msg.includes('50+') || msg.includes('over 50')) && (msg.includes('lac') || msg.includes('lakh'))) {
    return "1. Mercedes S 580e - ₹92.3 lakhs\n2. Porsche Cayenne E-Hybrid - ₹85.6 lakhs\n3. Lexus LS 500h - ₹72.4 lakhs\n4. BMW 745Le xDrive - ₹68.9 lakhs";
  }
  
  // Product-specific questions - Just facts
  if (msg.includes('lexus es') || msg.includes('es 300h')) {
    return "• Price: ₹43.16 lakhs\n• Fuel: 44 MPG\n• Power: 215 HP\n• Features: Heated/cooled seats, 12.3\" display";
  }
  
  if (msg.includes('lexus nx') || msg.includes('nx 350h')) {
    return "• Price: ₹40.26 lakhs\n• Fuel: 36 MPG\n• Drive: AWD\n• Towing: 2,000 lbs";
  }
  
  if (msg.includes('bmw') || msg.includes('530e')) {
    return "• Price: ₹49.39 lakhs\n• EV Range: 21 miles\n• Power: 288 HP\n• 0-60: 5.7 seconds";
  }
  
  // Comparison queries
  if (msg.includes('compare') || msg.includes('vs') || msg.includes('difference')) {
    return "Specify models to compare. Example: 'BMW vs Lexus'";
  }
  
  if ((msg.includes('bmw') && msg.includes('lexus')) || (msg.includes('530e') && msg.includes('es'))) {
    return "BMW 530e vs Lexus ES 300h:\n• Price: ₹49.39L vs ₹43.16L\n• Power: 288HP vs 215HP\n• EV Range: 21mi vs 0mi\n• Fuel: 73 MPGe vs 44 MPG";
  }
  
  // Quick inventory check
  if (msg.includes('stock') || msg.includes('available') || msg.includes('inventory')) {
    return "• In stock: 12 hybrids\n• Arriving this week: 3\n• Most popular: Lexus ES\n• Quick movers: BMW 530e";
  }
  
  // Commission/profit margin info
  if (msg.includes('commission') || msg.includes('margin') || msg.includes('profit')) {
    return "• Hybrids: 8-12% margin\n• Commission: ₹25,000-45,000\n• Volume bonus: Extra 2%\n• Incentive spiffs: ₹5,000/unit";
  }
  
  // Benefit and feature questions
  if (msg.includes('benefit') || msg.includes('advantage') || msg.includes('why hybrid')) {
    return "• 30-50% better fuel economy\n• Lower emissions\n• Government incentives\n• Quieter operation\n• Better resale";
  }
  
  if (msg.includes('warranty') || msg.includes('coverage')) {
    return "• Battery: 8 years/100,000 miles\n• Hybrid system: 8 years\n• Basic: 4 years/50,000 miles\n• Powertrain: 6 years/70,000 miles";
  }
  
  // Objection handling - Brief points
  if (msg.includes('too expensive') || msg.includes('price objection')) {
    return "• Fuel savings: ₹1.5-2.5 lakhs/year\n• Government incentives available\n• Lower maintenance costs\n• Better resale value";
  }
  
  if (msg.includes('complicated') || msg.includes('complex')) {
    return "• Automatic operation\n• No manual switching\n• Fewer engine parts\n• More reliable";
  }
  
  if (msg.includes('performance') || msg.includes('slow') || msg.includes('power')) {
    return "• BMW 530e: 288 HP combined\n• Instant torque from electric\n• 0-60 faster than gas\n• Smoother acceleration";
  }
  
  if (msg.includes('maintenance') || msg.includes('repair')) {
    return "• Brake pads last 2x longer\n• Fewer oil changes\n• 8-year battery warranty\n• Lower service costs";
  }
  
  if (msg.includes('resale') || msg.includes('value')) {
    return "• Hybrids hold value better\n• Growing demand\n• Future regulations favor hybrids\n• Premium segment retention";
  }
  
  // Quick facts for different buyer types
  if (msg.includes('environmental') || msg.includes('green')) {
    return "• 40% less CO2\n• Zero emissions in EV mode\n• Recyclable batteries\n• LEED certified facilities";
  }
  
  if (msg.includes('save money') || msg.includes('cost conscious')) {
    return "• Save ₹2 lakhs/year on fuel\n• Tax benefits up to ₹1.5 lakhs\n• Lower insurance rates\n• Reduced toll fees in some states";
  }
  
  if (msg.includes('technology') || msg.includes('tech features')) {
    return "• Regenerative braking\n• AI power management\n• Remote start/climate\n• Predictive energy optimization";
  }
  
  // Financing questions
  if (msg.includes('incentive') || msg.includes('tax credit')) {
    return "• GST: Reduced rate 18% vs 28%\n• Income tax: Section 80EEB benefit\n• State rebates: Up to ₹1.5 lakhs\n• Priority parking/tolls";
  }
  
  if (msg.includes('financing') || msg.includes('lease')) {
    return "• Special hybrid rates: 7.5% APR\n• Lease: ₹45,000/month (3 years)\n• Zero down payment options\n• Balloon payment available";
  }
  
  // Sales process - Quick tips
  if (msg.includes('close') || msg.includes('closing')) {
    return "• Show total 5-year savings\n• Mention incentive deadline\n• Offer overnight test drive\n• Ask: 'Cash or finance?'";
  }
  
  if (msg.includes('test drive') || msg.includes('demo')) {
    return "• Start in EV mode (silent)\n• Show instant acceleration\n• Display energy flow screen\n• Park with auto-park feature";
  }
  
  if (msg.includes('follow up')) {
    return "• Call within 24 hours\n• Send savings calculator\n• Share incentive deadline\n• Book second appointment";
  }
  
  // Remove any "visit dealership" language since they're already there
  if (msg.includes('where') || msg.includes('location') || msg.includes('dealership')) {
    return "• You're here already\n• Show floor: Section A\n• Test drive area: Exit B\n• Finance desk: 2nd floor";
  }
  
  // Default helpful response
  return "Ask me:\n• Price range\n• Specific model\n• Features\n• Incentives";
}

// Training-specific response generation
function generateTrainingResponse(message, scenario, conversationHistory) {
  const msg = message.toLowerCase();
  const response = {
    response: '',
    feedback: '',
    score: 0
  };
  
  // Training scenarios with interactive responses
  const trainingScenarios = {
    'objection-handling': {
      setup: "I'm acting as a customer with concerns. Let's practice!",
      responses: {
        price: {
          customer: "This hybrid is too expensive compared to regular cars. I can't justify the extra cost.",
          feedback_keywords: ['save', 'fuel', 'cost', 'ownership', 'incentive', 'value'],
          good_response: "Excellent! You addressed the total cost of ownership and long-term savings.",
          poor_response: "Try focusing on the total cost of ownership rather than just the upfront price."
        },
        performance: {
          customer: "I'm worried hybrids are slow and don't have good performance.",
          feedback_keywords: ['torque', 'instant', 'power', 'acceleration', 'performance'],
          good_response: "Great job highlighting the instant torque and performance benefits!",
          poor_response: "Remember to mention the instant torque from electric motors and actual performance specs."
        }
      }
    },
    'product-knowledge': {
      setup: "Let me test your product knowledge with some questions.",
      questions: [
        { q: "What's the fuel economy of the Lexus ES 300h?", a: "44 mpg combined", keywords: ['44', 'mpg', 'combined'] },
        { q: "How much is the BMW 530e priced at?", a: "₹49.39 lakhs", keywords: ['49', 'lakh', 'price'] },
        { q: "What's the electric range of the BMW 530e?", a: "21 miles electric range", keywords: ['21', 'mile', 'electric', 'range'] }
      ]
    },
    'closing-techniques': {
      setup: "Practice your closing techniques with different scenarios.",
      scenarios: {
        ready_buyer: "The customer seems interested but hasn't committed yet.",
        hesitant_buyer: "The customer likes the car but is unsure about making a decision today."
      }
    },
    'customer-interaction': {
      setup: "Practice with different customer types.",
      types: {
        first_time: "I've never bought a car before, this is overwhelming.",
        budget_conscious: "I need to make sure I'm getting good value for money.",
        luxury_seeker: "I want the best features and don't mind paying for quality."
      }
    }
  };
  
  // Handle scenario-specific interactions
  if (scenario && trainingScenarios[scenario]) {
    const scenarioData = trainingScenarios[scenario];
    
    if (scenario === 'objection-handling') {
      // Simulate customer objections and provide feedback
      if (msg.includes('price') || msg.includes('expensive') || msg.includes('cost')) {
        response.response = scenarioData.responses.price.customer;
      } else if (msg.includes('performance') || msg.includes('slow') || msg.includes('power')) {
        response.response = scenarioData.responses.performance.customer;
      } else {
        // Evaluate response to previous objection
        const keywords = scenarioData.responses.price.feedback_keywords;
        const matchedKeywords = keywords.filter(keyword => msg.includes(keyword));
        
        if (matchedKeywords.length >= 2) {
          response.response = scenarioData.responses.price.good_response + " Here's another scenario: This hybrid seems too complicated to operate.";
          response.feedback = "Strong response! You addressed key points effectively.";
          response.score = 8 + Math.min(2, matchedKeywords.length);
        } else {
          response.response = scenarioData.responses.price.poor_response + " Try again: The customer says this hybrid is too expensive.";
          response.feedback = "Your response could be stronger. Focus on value proposition.";
          response.score = 5;
        }
      }
    } else if (scenario === 'product-knowledge') {
      // Quiz mode
      const questions = scenarioData.questions;
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      
      // Check if message is answering a previous question
      const hasCorrectInfo = randomQ.keywords.some(keyword => msg.includes(keyword));
      
      if (hasCorrectInfo) {
        response.response = "Correct! " + randomQ.a + " is the right answer. Here's another: " + questions[(questions.indexOf(randomQ) + 1) % questions.length].q;
        response.feedback = "Excellent product knowledge!";
        response.score = 9;
      } else {
        response.response = randomQ.q;
        response.feedback = "Take your time and think about the specific details we covered.";
        response.score = 0;
      }
    } else if (scenario === 'closing-techniques') {
      if (msg.includes('financing') || msg.includes('payment') || msg.includes('lease')) {
        response.response = "Great assumptive close! The customer responds positively. Now suggest a test drive to move forward.";
        response.feedback = "Excellent use of assumptive closing technique!";
        response.score = 9;
      } else if (msg.includes('test drive') || msg.includes('try it')) {
        response.response = "Perfect! Experience closes are very effective. The customer agrees to a test drive.";
        response.feedback = "Great suggestion! Test drives are powerful closing tools.";
        response.score = 8;
      } else {
        response.response = "The customer is interested in the Lexus ES 300h but hasn't committed. They're asking about monthly payments. How would you close this sale?";
        response.feedback = "Try using an assumptive close or suggesting a test drive.";
        response.score = 0;
      }
    } else if (scenario === 'customer-interaction') {
      const customerTypes = scenarioData.types;
      if (msg.includes('first time') || msg.includes('beginner')) {
        response.response = customerTypes.first_time + " How would you make them feel comfortable?";
      } else if (msg.includes('budget') || msg.includes('value')) {
        response.response = customerTypes.budget_conscious + " How do you address their concerns?";
      } else {
        response.response = "You handled that customer interaction well! Let's try another type: " + customerTypes.luxury_seeker + " What's your approach?";
        response.feedback = "Good customer handling approach!";
        response.score = 7;
      }
    }
  } else {
    // General training without specific scenario
    response.response = generateResponse(message, 'training');
  }
  
  return response;
}

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }
    
    try {
      // Try to use GPT API first for general chatbot
      const gptResponse = await callGPTAPI([
        { role: 'user', content: message.trim() }
      ], false);
      
      res.json({
        response: gptResponse.response,
        timestamp: new Date().toISOString(),
        source: 'gpt',
        usage: gptResponse.usage
      });
    } catch (apiError) {
      console.warn('GPT API failed, falling back to local responses:', apiError.message);
      
      // Fallback to local knowledge base
      const response = generateResponse(message.trim(), context || 'general');
      
      res.json({
        response: response,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again or consult your sales documentation.',
      error: 'Internal server error'
    });
  }
});

// Training-specific chatbot endpoint with GPT API
router.post('/training', async (req, res) => {
  try {
    const { message, context, scenario, conversationHistory } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    // Convert conversation history to OpenAI format
    const messages = [];
    
    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        if (msg.type === 'user') {
          messages.push({ role: 'user', content: msg.content });
        } else if (msg.type === 'bot') {
          messages.push({ role: 'assistant', content: msg.content });
        }
      });
    }
    
    // Add current message
    messages.push({ role: 'user', content: message.trim() });

    try {
      // Try to use GPT API first
      const gptResponse = await callGPTAPI(messages, true);
      
      res.json({
        response: gptResponse.response,
        feedback: null, // GPT provides integrated feedback
        score: null, // GPT can provide qualitative feedback instead
        timestamp: new Date().toISOString(),
        source: 'gpt',
        usage: gptResponse.usage
      });
    } catch (apiError) {
      console.warn('GPT API failed, falling back to local training:', apiError.message);
      
      // Fallback to local training logic
      const fallbackResponse = generateTrainingResponse(
        message.trim(), 
        scenario, 
        conversationHistory || []
      );
      
      res.json({
        response: fallbackResponse.response || generateResponse(message.trim(), 'training'),
        feedback: fallbackResponse.feedback || null,
        score: fallbackResponse.score || null,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }
    
  } catch (error) {
    console.error('Training chatbot error:', error);
    res.status(500).json({ 
      response: 'I\'m having trouble with the training session right now. Let\'s continue - try asking about sales techniques or product knowledge.',
      error: 'Internal server error'
    });
  }
});

module.exports = router;