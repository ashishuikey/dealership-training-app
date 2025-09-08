const OpenAI = require('openai');
const KnowledgeBase = require('./KnowledgeBase');

class TrainingGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.knowledgeBase = new KnowledgeBase();
  }

  async initialize() {
    await this.knowledgeBase.initialize();
  }

  // Generate comprehensive training materials from product data
  async generateFromProductData(productData, existingKnowledge = null) {
    const materials = {
      quizzes: [],
      scenarios: [],
      objectionHandlers: [],
      comparisons: [],
      talkingPoints: [],
      rolePlayScripts: []
    };

    try {
      // Generate quiz questions
      materials.quizzes = await this.generateQuizQuestions(productData, existingKnowledge);
      
      // Generate sales scenarios
      materials.scenarios = await this.generateSalesScenarios(productData);
      
      // Generate objection handling scripts
      materials.objectionHandlers = await this.generateObjectionHandlers(productData);
      
      // Generate comparison charts
      materials.comparisons = await this.generateComparisons(productData);
      
      // Generate key talking points
      materials.talkingPoints = await this.generateTalkingPoints(productData);
      
      // Generate role-play scripts
      materials.rolePlayScripts = await this.generateRolePlayScripts(productData);
      
      return {
        success: true,
        materials,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating training materials:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate quiz questions
  async generateQuizQuestions(productData, existingKnowledge) {
    try {
      const context = this.buildContext(productData, existingKnowledge);
      
      const prompt = `Based on the following product information, generate 10 multiple-choice quiz questions for sales training. 
      Include questions about specifications, features, benefits, pricing, and competitive advantages.
      
      Product Information:
      ${context}
      
      Format each question as JSON with:
      - question: the question text
      - options: array of 4 options
      - correctAnswer: index of correct option (0-3)
      - explanation: brief explanation of the answer
      - difficulty: easy/medium/hard
      - category: specs/features/pricing/comparison`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a sales training expert creating educational quiz questions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.questions || [];
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return this.getFallbackQuizQuestions(productData);
    }
  }

  // Generate sales scenarios
  async generateSalesScenarios(productData) {
    try {
      const prompt = `Create 5 realistic sales scenarios for the following product. Each scenario should present a different customer type with specific needs and concerns.
      
      Product: ${productData.name || 'Vehicle'}
      Category: ${productData.category || 'Automotive'}
      Price: ${productData.price || 'Variable'}
      Key Features: ${JSON.stringify(productData.features || [])}
      
      Format each scenario as JSON with:
      - title: scenario name
      - customerType: first-time buyer/upgrade/luxury seeker/budget conscious/family oriented
      - situation: detailed scenario description
      - customerNeeds: array of customer requirements
      - concerns: array of potential objections
      - suggestedApproach: recommended sales approach
      - keySellingPoints: array of points to emphasize`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a sales training expert creating realistic customer scenarios."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.scenarios || [];
    } catch (error) {
      console.error('Error generating scenarios:', error);
      return this.getFallbackScenarios();
    }
  }

  // Generate objection handlers
  async generateObjectionHandlers(productData) {
    try {
      const prompt = `Generate objection handling responses for common customer concerns about this product.
      
      Product: ${productData.name || 'Vehicle'}
      Price: ${productData.price || 'Variable'}
      Category: ${productData.category || 'Automotive'}
      
      Create responses for these common objections:
      1. Price too high
      2. Concerns about reliability
      3. Comparison with competitors
      4. Timing of purchase
      5. Technical complexity
      
      Format as JSON with:
      - objection: the customer objection
      - response: professional response
      - keyPoints: bullet points to cover
      - alternativeApproach: different way to handle
      - closingStatement: transition to close`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Gabru, a friendly but knowledgeable sales training coach teaching objection handling."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.objections || [];
    } catch (error) {
      console.error('Error generating objection handlers:', error);
      return this.getFallbackObjectionHandlers();
    }
  }

  // Generate comparison charts
  async generateComparisons(productData) {
    try {
      const prompt = `Create a competitive comparison analysis for this product against its main competitors.
      
      Product: ${productData.name || 'Vehicle'}
      Category: ${productData.category || 'Automotive'}
      Price: ${productData.price || 'Variable'}
      
      Generate comparison points for:
      - Price value proposition
      - Feature advantages
      - Performance metrics
      - Warranty and support
      - Total cost of ownership
      
      Format as JSON with:
      - category: comparison category
      - ourProduct: our product's offering
      - competitor1: competitor offering
      - competitor2: competitor offering
      - advantage: our key advantage
      - talkingPoint: how to present this`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a product comparison expert creating sales training materials."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.comparisons || [];
    } catch (error) {
      console.error('Error generating comparisons:', error);
      return [];
    }
  }

  // Generate talking points
  async generateTalkingPoints(productData) {
    try {
      const prompt = `Generate key talking points for selling this product. Focus on benefits over features.
      
      Product: ${productData.name || 'Vehicle'}
      Features: ${JSON.stringify(productData.features || [])}
      
      Create talking points for:
      - Opening pitch (30 seconds)
      - Value proposition
      - Emotional benefits
      - Practical benefits
      - Closing summary
      
      Keep responses concise and impactful. Format as JSON.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Gabru, a smart sales coach who knows how to connect with customers emotionally."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.talkingPoints || [];
    } catch (error) {
      console.error('Error generating talking points:', error);
      return this.getFallbackTalkingPoints();
    }
  }

  // Generate role-play scripts
  async generateRolePlayScripts(productData) {
    try {
      const prompt = `Create 3 role-play conversation scripts for sales training on this product.
      
      Product: ${productData.name || 'Vehicle'}
      
      Script 1: First-time buyer who is nervous
      Script 2: Experienced buyer comparing options
      Script 3: Budget-conscious family customer
      
      Format each script as a dialogue with:
      - scenario: brief setup
      - dialogue: array of {speaker: 'salesperson'/'customer', text: 'what they say'}
      - learningPoints: key lessons from this script
      - variations: ways to adapt the approach`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are creating realistic sales conversation scripts for training."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.scripts || [];
    } catch (error) {
      console.error('Error generating role-play scripts:', error);
      return [];
    }
  }

  // Build context from product data and knowledge
  buildContext(productData, existingKnowledge) {
    let context = '';
    
    if (productData) {
      context += `Product: ${productData.name || 'Unknown'}\n`;
      context += `Category: ${productData.category || 'Unknown'}\n`;
      context += `Price: ${productData.price || 'Unknown'}\n`;
      
      if (productData.specs) {
        context += `Specifications: ${JSON.stringify(productData.specs)}\n`;
      }
      
      if (productData.features) {
        context += `Features: ${productData.features.join(', ')}\n`;
      }
    }
    
    if (existingKnowledge) {
      context += `\nAdditional Information:\n${existingKnowledge.substring(0, 1000)}`;
    }
    
    return context;
  }

  // Fallback methods for when AI is unavailable
  getFallbackQuizQuestions(productData) {
    return [
      {
        question: `What is the price range of ${productData.name || 'this product'}?`,
        options: ['Under $30,000', '$30,000-$40,000', '$40,000-$50,000', 'Over $50,000'],
        correctAnswer: 1,
        explanation: 'Price knowledge is essential for sales',
        difficulty: 'easy',
        category: 'pricing'
      },
      {
        question: 'What type of customer would benefit most from this product?',
        options: ['First-time buyers', 'Luxury seekers', 'Budget conscious', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Understanding target customers is crucial',
        difficulty: 'medium',
        category: 'features'
      }
    ];
  }

  getFallbackScenarios() {
    return [
      {
        title: 'First-Time Buyer Scenario',
        customerType: 'first-time buyer',
        situation: 'A young professional looking for their first vehicle',
        customerNeeds: ['Reliability', 'Good financing', 'Easy maintenance'],
        concerns: ['High price', 'Complex features', 'Long-term costs'],
        suggestedApproach: 'Focus on value and support',
        keySellingPoints: ['Warranty', 'Financing options', 'Safety features']
      }
    ];
  }

  getFallbackObjectionHandlers() {
    return [
      {
        objection: 'The price is too high',
        response: 'I understand price is important. Let me show you the total value...',
        keyPoints: ['Long-term savings', 'Quality features', 'Warranty coverage'],
        alternativeApproach: 'Compare with competitor pricing',
        closingStatement: 'When you consider the total package, this is excellent value.'
      }
    ];
  }

  getFallbackTalkingPoints() {
    return [
      {
        category: 'opening',
        point: 'Welcome! I\'m excited to show you our latest models.',
        duration: '30 seconds'
      },
      {
        category: 'value',
        point: 'This vehicle offers the perfect blend of luxury and efficiency.',
        duration: '1 minute'
      }
    ];
  }

  // Generate personalized training plan
  async generatePersonalizedPlan(userId, performanceData, preferences) {
    try {
      const prompt = `Create a personalized training plan for a salesperson with the following profile:
      
      Performance: ${JSON.stringify(performanceData)}
      Preferences: ${JSON.stringify(preferences)}
      
      Generate a structured plan with:
      - Daily goals
      - Weekly milestones
      - Focus areas
      - Recommended exercises
      - Success metrics`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Gabru, a personalized sales training coach."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      const plan = JSON.parse(response.choices[0].message.content);
      
      // Save plan to database
      await this.knowledgeBase.saveAnalytics({
        userId,
        type: 'training_plan',
        plan,
        createdAt: new Date()
      });
      
      return plan;
    } catch (error) {
      console.error('Error generating personalized plan:', error);
      return this.getDefaultTrainingPlan();
    }
  }

  getDefaultTrainingPlan() {
    return {
      dailyGoals: ['Complete 1 product quiz', 'Practice 2 objection handlers', 'Review 1 product comparison'],
      weeklyMilestones: ['Master 3 products', 'Complete 10 role-plays', 'Achieve 80% quiz accuracy'],
      focusAreas: ['Product knowledge', 'Objection handling', 'Closing techniques'],
      recommendedExercises: ['Daily role-play practice', 'Weekly product reviews', 'Customer scenario analysis'],
      successMetrics: ['Quiz scores', 'Role-play performance', 'Customer feedback']
    };
  }
}

module.exports = TrainingGenerator;