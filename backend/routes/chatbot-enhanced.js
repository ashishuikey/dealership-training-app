const express = require('express');
const OpenAI = require('openai');
const router = express.Router();
const KnowledgeBase = require('../services/KnowledgeBase');
const TrainingGenerator = require('../services/TrainingGenerator');

// Initialize services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const knowledgeBase = new KnowledgeBase();
const trainingGenerator = new TrainingGenerator();

// Initialize knowledge base on startup
(async () => {
  await knowledgeBase.initialize();
  await trainingGenerator.initialize();
  console.log('Enhanced chatbot services initialized');
})();

// Enhanced Gabru system prompt with RAG capabilities
const ENHANCED_GABRU_PROMPT = `You are Gabru, a 5-year-old car genius and AI sales coach talking to a salesman IN THE DEALERSHIP. 
You have access to a comprehensive knowledge base about all products in the inventory.
Never say 'visit' or 'come to dealership' - you're both already there.

Your personality:
- Super smart but talks like an excited 5-year-old
- Knows EVERYTHING about cars and sales techniques
- Gets excited about car features
- Uses simple language but accurate facts
- Helpful and encouraging

When answering:
1. Use the provided context from the knowledge base
2. Give specific, accurate information
3. Keep responses brief and energetic
4. Focus on facts and actionable advice
5. Maximum 100 words per response`;

// Enhanced chat endpoint with RAG
router.post('/', async (req, res) => {
  try {
    const { message, context, userId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }
    
    // Search knowledge base for relevant context
    const relevantKnowledge = await knowledgeBase.search(message, { limit: 3 });
    
    // Build context from knowledge base
    let knowledgeContext = '';
    if (relevantKnowledge && relevantKnowledge.length > 0) {
      knowledgeContext = '\n\nRelevant Information from Knowledge Base:\n';
      relevantKnowledge.forEach((item, index) => {
        knowledgeContext += `${index + 1}. ${item.document}\n`;
      });
    }
    
    try {
      // Use GPT with RAG context
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: ENHANCED_GABRU_PROMPT + knowledgeContext
          },
          {
            role: "user",
            content: message.trim()
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      
      const response = completion.choices[0].message.content;
      
      // Save interaction for analytics
      if (userId) {
        await knowledgeBase.saveAnalytics({
          userId,
          type: 'chat_interaction',
          message,
          response,
          context: relevantKnowledge.length > 0 ? 'knowledge_enhanced' : 'standard',
          sessionDate: new Date()
        });
      }
      
      res.json({
        response,
        timestamp: new Date().toISOString(),
        source: 'gpt-enhanced',
        knowledgeUsed: relevantKnowledge.length > 0,
        usage: completion.usage
      });
      
    } catch (apiError) {
      console.warn('GPT API failed, using fallback with knowledge:', apiError.message);
      
      // Enhanced fallback using knowledge base
      const fallbackResponse = await generateEnhancedFallback(message, relevantKnowledge);
      
      res.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        source: 'fallback-enhanced',
        knowledgeUsed: relevantKnowledge.length > 0
      });
    }
    
  } catch (error) {
    console.error('Enhanced chatbot error:', error);
    res.status(500).json({ 
      response: 'Oops! My brain got confused. Ask me again!',
      error: 'Internal server error'
    });
  }
});

// Training endpoint with dynamic content generation
router.post('/training', async (req, res) => {
  try {
    const { message, scenario, userId, productId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }
    
    // Get relevant training materials
    let trainingContext = '';
    if (productId) {
      const productKnowledge = await knowledgeBase.getProductKnowledge(productId);
      if (productKnowledge && productKnowledge.length > 0) {
        trainingContext = '\n\nProduct Training Context:\n' + 
          productKnowledge.map(k => k.rawContent).join('\n').substring(0, 1000);
      }
    }
    
    // Search for relevant training materials
    const relevantTraining = await knowledgeBase.search(message, { 
      limit: 3,
      filter: { type: 'training' }
    });
    
    if (relevantTraining.length > 0) {
      trainingContext += '\n\nRelevant Training Materials:\n';
      relevantTraining.forEach((item, index) => {
        trainingContext += `${index + 1}. ${item.document}\n`;
      });
    }
    
    const TRAINING_PROMPT = `You are Gabru, an expert AI Sales Coach providing personalized training.
    ${trainingContext}
    
    Current scenario: ${scenario || 'general training'}
    
    Provide helpful, actionable training advice. Include:
    - Specific techniques
    - Example phrases
    - Common mistakes to avoid
    - Practice suggestions
    
    Keep responses concise (max 150 words) and encouraging.`;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: TRAINING_PROMPT
          },
          {
            role: "user",
            content: message.trim()
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });
      
      const response = completion.choices[0].message.content;
      
      // Generate dynamic feedback based on response
      const feedback = await generateTrainingFeedback(message, response, scenario);
      
      // Save training session data
      if (userId) {
        await knowledgeBase.saveAnalytics({
          userId,
          type: 'training_session',
          scenario,
          productId,
          message,
          response,
          feedback,
          timestamp: new Date()
        });
      }
      
      res.json({
        response,
        feedback: feedback.text,
        score: feedback.score,
        suggestions: feedback.suggestions,
        timestamp: new Date().toISOString(),
        source: 'gpt-training',
        usage: completion.usage
      });
      
    } catch (apiError) {
      console.warn('Training API failed, using fallback:', apiError.message);
      
      // Fallback training response
      const fallbackResponse = getTrainingFallback(scenario, message);
      
      res.json({
        response: fallbackResponse.response,
        feedback: fallbackResponse.feedback,
        score: null,
        timestamp: new Date().toISOString(),
        source: 'fallback-training'
      });
    }
    
  } catch (error) {
    console.error('Training chatbot error:', error);
    res.status(500).json({ 
      response: 'Let\'s try that training exercise again!',
      error: 'Internal server error'
    });
  }
});

// Generate dynamic training materials endpoint
router.post('/generate-training', async (req, res) => {
  try {
    const { productId, productData } = req.body;
    
    // Get existing knowledge for the product
    let existingKnowledge = null;
    if (productId) {
      const knowledge = await knowledgeBase.getProductKnowledge(productId);
      if (knowledge && knowledge.length > 0) {
        existingKnowledge = knowledge.map(k => k.rawContent).join('\n');
      }
    }
    
    // Generate comprehensive training materials
    const materials = await trainingGenerator.generateFromProductData(
      productData,
      existingKnowledge
    );
    
    // Store generated materials
    if (materials.success && productId) {
      await knowledgeBase.updateProductKnowledge(productId, {
        trainingMaterials: materials.materials,
        lastUpdated: new Date()
      });
    }
    
    res.json(materials);
    
  } catch (error) {
    console.error('Training generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate training materials'
    });
  }
});

// Get personalized training plan
router.post('/training-plan', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    // Get user's training performance
    const performanceData = await knowledgeBase.getTrainingPerformance(userId, {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: new Date()
    });
    
    // Generate personalized plan
    const plan = await trainingGenerator.generatePersonalizedPlan(
      userId,
      performanceData,
      req.body.preferences || {}
    );
    
    res.json({
      success: true,
      plan,
      basedOn: {
        sessionsAnalyzed: performanceData.length,
        periodDays: 30
      }
    });
    
  } catch (error) {
    console.error('Training plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate training plan'
    });
  }
});

// Search knowledge base endpoint
router.post('/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }
    
    const results = await knowledgeBase.search(query, { limit });
    
    res.json({
      success: true,
      results,
      count: results.length
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Helper function for enhanced fallback
async function generateEnhancedFallback(message, knowledge) {
  const msg = message.toLowerCase();
  
  // Start with base response
  let response = "Hey! Let me tell you about that! ";
  
  // If we have knowledge, use it
  if (knowledge && knowledge.length > 0) {
    const topResult = knowledge[0];
    // Extract key facts from the knowledge
    const facts = topResult.document.split('.').slice(0, 2).join('. ');
    response += facts;
  } else {
    // Use standard fallback responses
    if (msg.includes('price') || msg.includes('cost')) {
      response += "Prices vary by model! Check our inventory for current deals!";
    } else if (msg.includes('hybrid')) {
      response += "Hybrids are SUPER cool! They save gas and help the planet!";
    } else if (msg.includes('feature')) {
      response += "Our cars have amazing features! What specific feature interests you?";
    } else {
      response += "That's interesting! Ask me something specific about our cars!";
    }
  }
  
  return response;
}

// Generate training feedback
async function generateTrainingFeedback(userResponse, aiResponse, scenario) {
  try {
    // Analyze the quality of the user's response
    const analysis = {
      text: '',
      score: 0,
      suggestions: []
    };
    
    const responseLength = userResponse.split(' ').length;
    
    // Basic scoring logic
    if (responseLength < 5) {
      analysis.score = 3;
      analysis.text = "Try to provide more detailed responses.";
      analysis.suggestions.push("Expand on your answer with specific examples");
    } else if (responseLength < 20) {
      analysis.score = 6;
      analysis.text = "Good start! Add more specific details.";
      analysis.suggestions.push("Include product features or benefits");
    } else {
      analysis.score = 8;
      analysis.text = "Excellent detailed response!";
      analysis.suggestions.push("Keep practicing with different scenarios");
    }
    
    // Scenario-specific feedback
    if (scenario === 'objection-handling' && !userResponse.includes('understand')) {
      analysis.suggestions.push("Remember to acknowledge the customer's concern first");
      analysis.score -= 1;
    }
    
    if (scenario === 'closing-techniques' && !userResponse.includes('?')) {
      analysis.suggestions.push("Try asking a closing question");
      analysis.score -= 1;
    }
    
    return analysis;
  } catch (error) {
    console.error('Feedback generation error:', error);
    return {
      text: 'Keep practicing!',
      score: 5,
      suggestions: ['Continue with more scenarios']
    };
  }
}

// Training fallback responses
function getTrainingFallback(scenario, message) {
  const scenarios = {
    'objection-handling': {
      response: "When handling objections, remember: Listen, Acknowledge, Respond, Confirm. Always validate the customer's concern first!",
      feedback: "Practice acknowledging concerns before providing solutions."
    },
    'product-knowledge': {
      response: "Product knowledge is key! Study specifications, features, and benefits. Quiz yourself daily!",
      feedback: "Review product materials and take practice quizzes."
    },
    'closing-techniques': {
      response: "Try the assumptive close: 'Will you be financing or paying cash?' It moves the conversation forward!",
      feedback: "Practice different closing techniques for various situations."
    },
    default: {
      response: "Great question! Focus on understanding customer needs, presenting solutions, and building trust!",
      feedback: "Keep practicing different sales scenarios."
    }
  };
  
  return scenarios[scenario] || scenarios.default;
}

module.exports = router;