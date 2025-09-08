const { MongoClient } = require('mongodb');
const ContentProcessor = require('./ContentProcessor');
const VectorStore = require('./VectorStore');
const fs = require('fs').promises;
const path = require('path');

class KnowledgeBase {
  constructor() {
    this.client = null;
    this.db = null;
    this.contentProcessor = new ContentProcessor();
    this.vectorStore = new VectorStore();
    this.collections = {
      products: null,
      knowledge: null,
      training: null,
      analytics: null
    };
  }

  async initialize() {
    try {
      // Initialize MongoDB connection
      const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
      this.client = new MongoClient(mongoUrl);
      await this.client.connect();
      
      this.db = this.client.db('dealership_training');
      
      // Initialize collections
      this.collections.products = this.db.collection('products');
      this.collections.knowledge = this.db.collection('knowledge_documents');
      this.collections.training = this.db.collection('training_materials');
      this.collections.analytics = this.db.collection('training_analytics');
      
      // Create indexes
      await this.createIndexes();
      
      // Initialize vector store
      await this.vectorStore.initialize();
      
      console.log('KnowledgeBase initialized successfully');
      return true;
    } catch (error) {
      console.error('KnowledgeBase initialization error:', error);
      // Fallback to file-based storage
      this.useFallbackStorage();
      return false;
    }
  }

  // Create database indexes
  async createIndexes() {
    try {
      // Products indexes
      await this.collections.products.createIndex({ name: 1 });
      await this.collections.products.createIndex({ category: 1 });
      await this.collections.products.createIndex({ 'metadata.lastUpdated': -1 });
      
      // Knowledge documents indexes
      await this.collections.knowledge.createIndex({ productId: 1 });
      await this.collections.knowledge.createIndex({ type: 1 });
      await this.collections.knowledge.createIndex({ processedAt: -1 });
      
      // Training materials indexes
      await this.collections.training.createIndex({ productId: 1 });
      await this.collections.training.createIndex({ type: 1 });
      await this.collections.training.createIndex({ difficulty: 1 });
      
      // Analytics indexes
      await this.collections.analytics.createIndex({ userId: 1 });
      await this.collections.analytics.createIndex({ sessionDate: -1 });
      await this.collections.analytics.createIndex({ productId: 1 });
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }

  // Fallback to file-based storage
  useFallbackStorage() {
    console.log('Using file-based fallback storage');
    this.fallbackMode = true;
    this.fallbackPath = path.join(__dirname, '../data/knowledge');
  }

  // Process and store uploaded files
  async processUploadedFiles(files, productId = null) {
    const results = [];
    
    for (const file of files) {
      try {
        console.log(`Processing file: ${file.originalname}`);
        
        // Determine file type from extension
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        
        // Process the file
        const processed = await this.contentProcessor.processFile(file.path, ext);
        
        // Generate embeddings for chunks
        const chunks = this.contentProcessor.chunkContent(processed.rawContent);
        const documents = [];
        
        for (const chunk of chunks) {
          const embedding = await this.contentProcessor.generateEmbeddings(chunk);
          documents.push({
            content: chunk,
            embedding: embedding,
            metadata: {
              filename: file.originalname,
              productId: productId,
              type: processed.metadata.type,
              uploadedAt: new Date()
            }
          });
        }
        
        // Store in vector database
        await this.vectorStore.addDocuments(documents);
        
        // Store in MongoDB
        const knowledgeDoc = {
          filename: file.originalname,
          productId: productId,
          type: processed.metadata.type,
          rawContent: processed.rawContent,
          structuredData: processed.structuredData,
          chunks: chunks.length,
          processedAt: processed.processedAt,
          metadata: {
            size: file.size,
            mimetype: file.mimetype,
            encoding: file.encoding
          }
        };
        
        if (this.collections.knowledge) {
          await this.collections.knowledge.insertOne(knowledgeDoc);
        } else {
          // Fallback to file storage
          await this.saveToFile('knowledge', knowledgeDoc);
        }
        
        results.push({
          success: true,
          filename: file.originalname,
          chunksCreated: chunks.length,
          structuredData: processed.structuredData
        });
        
      } catch (error) {
        console.error(`Error processing ${file.originalname}:`, error);
        results.push({
          success: false,
          filename: file.originalname,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Search knowledge base
  async search(query, filters = {}) {
    try {
      // Vector search for semantic similarity
      const vectorResults = await this.vectorStore.search(query, filters.limit || 5);
      
      // Enhance with database metadata if available
      if (this.collections.knowledge) {
        const enhancedResults = [];
        
        for (const result of vectorResults) {
          const metadata = result.metadata;
          if (metadata && metadata.filename) {
            const dbDoc = await this.collections.knowledge.findOne({
              filename: metadata.filename
            });
            
            if (dbDoc) {
              enhancedResults.push({
                ...result,
                fullDocument: dbDoc
              });
            } else {
              enhancedResults.push(result);
            }
          } else {
            enhancedResults.push(result);
          }
        }
        
        return enhancedResults;
      }
      
      return vectorResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Get knowledge for specific product
  async getProductKnowledge(productId) {
    try {
      if (this.collections.knowledge) {
        return await this.collections.knowledge.find({ productId }).toArray();
      } else {
        return await this.loadFromFile('knowledge', { productId });
      }
    } catch (error) {
      console.error('Error fetching product knowledge:', error);
      return [];
    }
  }

  // Update product with new knowledge
  async updateProductKnowledge(productId, knowledge) {
    try {
      const update = {
        $set: {
          knowledgeBase: {
            documents: knowledge.documents || [],
            lastUpdated: new Date(),
            trainingMaterials: knowledge.trainingMaterials || []
          }
        }
      };
      
      if (this.collections.products) {
        await this.collections.products.updateOne(
          { id: productId },
          update,
          { upsert: true }
        );
      } else {
        await this.updateFile('products', productId, update.$set);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating product knowledge:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate training materials from knowledge
  async generateTrainingMaterials(productId) {
    try {
      // Get all knowledge for the product
      const knowledge = await this.getProductKnowledge(productId);
      
      if (!knowledge || knowledge.length === 0) {
        return { success: false, message: 'No knowledge found for product' };
      }
      
      // Combine all content
      const combinedContent = knowledge.map(k => k.rawContent || '').join('\n\n');
      
      // Generate training materials using AI
      const trainingMaterials = await this.generateMaterialsWithAI(combinedContent, productId);
      
      // Store training materials
      if (this.collections.training) {
        await this.collections.training.insertMany(trainingMaterials);
      } else {
        await this.saveToFile('training', trainingMaterials);
      }
      
      return {
        success: true,
        materialsGenerated: trainingMaterials.length,
        materials: trainingMaterials
      };
    } catch (error) {
      console.error('Error generating training materials:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate materials using AI
  async generateMaterialsWithAI(content, productId) {
    const materials = [];
    
    // This would be enhanced with actual AI generation
    // For now, creating sample structure
    materials.push({
      productId,
      type: 'quiz',
      content: {
        questions: []
      },
      difficulty: 'medium',
      generatedAt: new Date()
    });
    
    materials.push({
      productId,
      type: 'scenario',
      content: {
        scenarios: []
      },
      difficulty: 'medium',
      generatedAt: new Date()
    });
    
    materials.push({
      productId,
      type: 'comparison',
      content: {
        comparisons: []
      },
      difficulty: 'easy',
      generatedAt: new Date()
    });
    
    return materials;
  }

  // Save training analytics
  async saveAnalytics(analyticsData) {
    try {
      const analytics = {
        ...analyticsData,
        timestamp: new Date()
      };
      
      if (this.collections.analytics) {
        await this.collections.analytics.insertOne(analytics);
      } else {
        await this.saveToFile('analytics', analytics);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Get training performance
  async getTrainingPerformance(userId, dateRange) {
    try {
      const query = { userId };
      
      if (dateRange) {
        query.timestamp = {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        };
      }
      
      if (this.collections.analytics) {
        return await this.collections.analytics.find(query).toArray();
      } else {
        return await this.loadFromFile('analytics', query);
      }
    } catch (error) {
      console.error('Error fetching performance:', error);
      return [];
    }
  }

  // File-based storage fallback methods
  async saveToFile(collection, data) {
    if (!this.fallbackPath) {
      await fs.mkdir(path.join(__dirname, '../data/knowledge'), { recursive: true });
      this.fallbackPath = path.join(__dirname, '../data/knowledge');
    }
    
    const filePath = path.join(this.fallbackPath, `${collection}.json`);
    let existing = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet
    }
    
    if (Array.isArray(data)) {
      existing.push(...data);
    } else {
      existing.push(data);
    }
    
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
  }

  async loadFromFile(collection, filter = {}) {
    if (!this.fallbackPath) {
      this.fallbackPath = path.join(__dirname, '../data/knowledge');
    }
    
    const filePath = path.join(this.fallbackPath, `${collection}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Simple filtering
      if (Object.keys(filter).length > 0) {
        return data.filter(item => {
          for (const key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      }
      
      return data;
    } catch (error) {
      return [];
    }
  }

  async updateFile(collection, id, update) {
    const data = await this.loadFromFile(collection);
    const index = data.findIndex(item => item.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...update };
    } else {
      data.push({ id, ...update });
    }
    
    const filePath = path.join(this.fallbackPath, `${collection}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  // Cleanup method
  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

module.exports = KnowledgeBase;