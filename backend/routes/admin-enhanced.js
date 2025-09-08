const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const KnowledgeBase = require('../services/KnowledgeBase');
const ContentProcessor = require('../services/ContentProcessor');
const TrainingGenerator = require('../services/TrainingGenerator');

// Initialize services
const knowledgeBase = new KnowledgeBase();
const contentProcessor = new ContentProcessor();
const trainingGenerator = new TrainingGenerator();

// Initialize services on startup
(async () => {
  await knowledgeBase.initialize();
  await trainingGenerator.initialize();
  console.log('Enhanced admin services initialized');
})();

// Configure multer for enhanced file upload
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
    fileSize: 50 * 1024 * 1024, // 50MB limit for video/audio files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Spreadsheets
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
      // Video
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv',
      // Text
      'text/plain'
    ];
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const isAllowed = allowedTypes.includes(file.mimetype) || 
                     ['.txt', '.csv', '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
                      '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mp4', '.avi'].includes(fileExt);
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype || fileExt}`), false);
    }
  }
});

// Validate admin token middleware
const validateAdmin = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }
  
  // Simple token validation (in production, use proper JWT)
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

// Process and upload knowledge files
router.post('/upload-knowledge', validateAdmin, upload.array('files', 10), async (req, res) => {
  try {
    console.log('Processing knowledge files upload');
    
    const { productId, category } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }
    
    // Process uploaded files
    const results = await knowledgeBase.processUploadedFiles(files, productId);
    
    // Clean up uploaded files
    for (const file of files) {
      try {
        await fs.unlink(file.path);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
    
    // Generate training materials if product ID provided
    if (productId && results.some(r => r.success)) {
      const trainingResult = await knowledgeBase.generateTrainingMaterials(productId);
      
      res.json({
        success: true,
        message: 'Files processed and training materials generated',
        filesProcessed: results,
        trainingGenerated: trainingResult.materialsGenerated || 0,
        totalChunks: results.reduce((sum, r) => sum + (r.chunksCreated || 0), 0)
      });
    } else {
      res.json({
        success: true,
        message: 'Files processed successfully',
        filesProcessed: results,
        totalChunks: results.reduce((sum, r) => sum + (r.chunksCreated || 0), 0)
      });
    }
    
  } catch (error) {
    console.error('Knowledge upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process files',
      error: error.message
    });
  }
});

// Generate training materials for a product
router.post('/generate-training/:productId', validateAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { productData } = req.body;
    
    console.log(`Generating training materials for product: ${productId}`);
    
    // Get existing knowledge
    const existingKnowledge = await knowledgeBase.getProductKnowledge(productId);
    
    // Generate comprehensive training materials
    const materials = await trainingGenerator.generateFromProductData(
      productData || {},
      existingKnowledge ? existingKnowledge.map(k => k.rawContent).join('\n') : null
    );
    
    if (materials.success) {
      // Update product with new materials
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
      message: 'Failed to generate training materials',
      error: error.message
    });
  }
});

// Get knowledge base statistics
router.get('/knowledge-stats', validateAdmin, async (req, res) => {
  try {
    // Get vector store stats
    const vectorStats = await knowledgeBase.vectorStore.getStats();
    
    // Get product knowledge counts
    let productStats = {};
    if (knowledgeBase.collections && knowledgeBase.collections.products) {
      const products = await knowledgeBase.collections.products.find({}).toArray();
      productStats = {
        totalProducts: products.length,
        withKnowledge: products.filter(p => p.knowledgeBase && p.knowledgeBase.documents).length,
        withTraining: products.filter(p => p.knowledgeBase && p.knowledgeBase.trainingMaterials).length
      };
    }
    
    res.json({
      success: true,
      vectorStore: vectorStats,
      products: productStats,
      lastUpdated: new Date()
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// Search knowledge base
router.post('/search-knowledge', validateAdmin, async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
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
      message: 'Search failed'
    });
  }
});

// Get training analytics
router.get('/training-analytics', validateAdmin, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const dateRange = {
      start: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: endDate ? new Date(endDate) : new Date()
    };
    
    // Get analytics data
    let analytics = [];
    
    if (knowledgeBase.collections && knowledgeBase.collections.analytics) {
      const query = {
        timestamp: {
          $gte: dateRange.start,
          $lte: dateRange.end
        }
      };
      
      if (userId) {
        query.userId = userId;
      }
      
      analytics = await knowledgeBase.collections.analytics.find(query).toArray();
    }
    
    // Calculate summary statistics
    const summary = {
      totalSessions: analytics.filter(a => a.type === 'training_session').length,
      totalInteractions: analytics.filter(a => a.type === 'chat_interaction').length,
      uniqueUsers: [...new Set(analytics.map(a => a.userId))].length,
      averageScore: 0,
      topScenarios: {},
      performanceByUser: {}
    };
    
    // Calculate average score
    const scores = analytics.filter(a => a.score).map(a => a.score);
    if (scores.length > 0) {
      summary.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    
    // Count scenarios
    analytics.forEach(item => {
      if (item.scenario) {
        summary.topScenarios[item.scenario] = (summary.topScenarios[item.scenario] || 0) + 1;
      }
      
      if (item.userId) {
        if (!summary.performanceByUser[item.userId]) {
          summary.performanceByUser[item.userId] = {
            sessions: 0,
            averageScore: 0,
            scores: []
          };
        }
        summary.performanceByUser[item.userId].sessions++;
        if (item.score) {
          summary.performanceByUser[item.userId].scores.push(item.score);
        }
      }
    });
    
    // Calculate user averages
    Object.keys(summary.performanceByUser).forEach(userId => {
      const userScores = summary.performanceByUser[userId].scores;
      if (userScores.length > 0) {
        summary.performanceByUser[userId].averageScore = 
          userScores.reduce((a, b) => a + b, 0) / userScores.length;
      }
      delete summary.performanceByUser[userId].scores;
    });
    
    res.json({
      success: true,
      summary,
      dateRange,
      rawDataCount: analytics.length
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

// Clear knowledge base (dangerous - admin only)
router.delete('/clear-knowledge', validateAdmin, async (req, res) => {
  try {
    const { confirmCode } = req.body;
    
    if (confirmCode !== 'CLEAR_ALL_KNOWLEDGE') {
      return res.status(400).json({
        success: false,
        message: 'Invalid confirmation code'
      });
    }
    
    // Clear vector store
    const vectorResult = await knowledgeBase.vectorStore.clearAll();
    
    // Clear MongoDB collections if available
    if (knowledgeBase.collections) {
      if (knowledgeBase.collections.knowledge) {
        await knowledgeBase.collections.knowledge.deleteMany({});
      }
      if (knowledgeBase.collections.training) {
        await knowledgeBase.collections.training.deleteMany({});
      }
    }
    
    res.json({
      success: true,
      message: 'Knowledge base cleared successfully',
      vectorStore: vectorResult
    });
    
  } catch (error) {
    console.error('Clear knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear knowledge base'
    });
  }
});

// Get product knowledge details
router.get('/product-knowledge/:productId', validateAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const knowledge = await knowledgeBase.getProductKnowledge(productId);
    
    res.json({
      success: true,
      productId,
      documents: knowledge,
      count: knowledge.length
    });
    
  } catch (error) {
    console.error('Get knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product knowledge'
    });
  }
});

// Batch process product catalog
router.post('/batch-process-catalog', validateAdmin, async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array required'
      });
    }
    
    const results = [];
    
    for (const product of products) {
      try {
        // Generate training materials for each product
        const materials = await trainingGenerator.generateFromProductData(product);
        
        // Update knowledge base
        if (materials.success) {
          await knowledgeBase.updateProductKnowledge(product.id, {
            trainingMaterials: materials.materials,
            productData: product,
            lastUpdated: new Date()
          });
        }
        
        results.push({
          productId: product.id,
          productName: product.name,
          success: materials.success,
          materialsGenerated: materials.materials ? Object.keys(materials.materials).length : 0
        });
        
      } catch (error) {
        results.push({
          productId: product.id,
          productName: product.name,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      processed: results.length,
      successful: results.filter(r => r.success).length,
      results
    });
    
  } catch (error) {
    console.error('Batch process error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch process catalog'
    });
  }
});

module.exports = router;