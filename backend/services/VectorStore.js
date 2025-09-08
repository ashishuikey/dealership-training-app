const { ChromaClient, OpenAIEmbeddingFunction } = require('chromadb');
const OpenAI = require('openai');

class VectorStore {
  constructor() {
    this.client = null;
    this.collection = null;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.embeddingFunction = null;
  }

  async initialize() {
    try {
      // Initialize ChromaDB client
      this.client = new ChromaClient({
        path: process.env.CHROMADB_PATH || 'http://localhost:8000'
      });

      // Create embedding function
      this.embeddingFunction = new OpenAIEmbeddingFunction({
        apiKey: process.env.OPENAI_API_KEY,
        model: "text-embedding-3-small"
      });

      // Get or create collection for product knowledge
      try {
        this.collection = await this.client.getCollection({
          name: "product_knowledge",
          embeddingFunction: this.embeddingFunction
        });
      } catch (error) {
        // Collection doesn't exist, create it
        this.collection = await this.client.createCollection({
          name: "product_knowledge",
          embeddingFunction: this.embeddingFunction,
          metadata: { 
            description: "Product knowledge base for AI training system" 
          }
        });
      }

      console.log('VectorStore initialized successfully');
      return true;
    } catch (error) {
      console.error('VectorStore initialization error:', error);
      // Fallback to in-memory storage if ChromaDB is not available
      this.useInMemoryStorage();
      return false;
    }
  }

  // Fallback in-memory storage
  useInMemoryStorage() {
    console.log('Using in-memory vector storage (fallback mode)');
    this.inMemoryStorage = {
      documents: [],
      embeddings: [],
      metadata: []
    };
  }

  // Add documents to vector store
  async addDocuments(documents) {
    try {
      if (this.collection) {
        // Using ChromaDB
        const ids = documents.map((_, index) => 
          `doc_${Date.now()}_${index}`
        );
        
        await this.collection.add({
          ids: ids,
          documents: documents.map(d => d.content),
          metadatas: documents.map(d => d.metadata || {}),
          embeddings: documents.map(d => d.embedding).filter(e => e !== null)
        });

        return { success: true, documentIds: ids };
      } else {
        // Using in-memory storage
        for (const doc of documents) {
          const embedding = doc.embedding || await this.generateEmbedding(doc.content);
          this.inMemoryStorage.documents.push(doc.content);
          this.inMemoryStorage.embeddings.push(embedding);
          this.inMemoryStorage.metadata.push(doc.metadata || {});
        }
        
        return { success: true, documentCount: this.inMemoryStorage.documents.length };
      }
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }

  // Search for similar documents
  async search(query, nResults = 5) {
    try {
      if (this.collection) {
        // Using ChromaDB
        const results = await this.collection.query({
          queryTexts: [query],
          nResults: nResults
        });

        return this.formatSearchResults(results);
      } else {
        // Using in-memory storage
        return await this.inMemorySearch(query, nResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // In-memory search implementation
  async inMemorySearch(query, nResults) {
    if (!this.inMemoryStorage || this.inMemoryStorage.documents.length === 0) {
      return [];
    }

    const queryEmbedding = await this.generateEmbedding(query);
    const similarities = [];

    for (let i = 0; i < this.inMemoryStorage.documents.length; i++) {
      const similarity = this.cosineSimilarity(
        queryEmbedding,
        this.inMemoryStorage.embeddings[i]
      );
      
      similarities.push({
        document: this.inMemoryStorage.documents[i],
        metadata: this.inMemoryStorage.metadata[i],
        similarity: similarity
      });
    }

    // Sort by similarity and return top results
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, nResults);
  }

  // Generate embedding for text
  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.substring(0, 8000)
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      // Return zero vector as fallback
      return new Array(1536).fill(0);
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (normA * normB);
  }

  // Format search results
  formatSearchResults(results) {
    if (!results || !results.documents || results.documents.length === 0) {
      return [];
    }

    const formattedResults = [];
    const documents = results.documents[0];
    const metadatas = results.metadatas ? results.metadatas[0] : [];
    const distances = results.distances ? results.distances[0] : [];

    for (let i = 0; i < documents.length; i++) {
      formattedResults.push({
        document: documents[i],
        metadata: metadatas[i] || {},
        similarity: distances[i] ? (1 - distances[i]) : 0
      });
    }

    return formattedResults;
  }

  // Update document in vector store
  async updateDocument(documentId, content, metadata) {
    try {
      if (this.collection) {
        await this.collection.update({
          ids: [documentId],
          documents: [content],
          metadatas: [metadata]
        });
        
        return { success: true };
      } else {
        // In-memory update not implemented for simplicity
        return { success: false, message: 'Update not supported in memory mode' };
      }
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  // Delete documents from vector store
  async deleteDocuments(documentIds) {
    try {
      if (this.collection) {
        await this.collection.delete({
          ids: documentIds
        });
        
        return { success: true, deleted: documentIds.length };
      } else {
        // In-memory delete not implemented for simplicity
        return { success: false, message: 'Delete not supported in memory mode' };
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  // Get collection statistics
  async getStats() {
    try {
      if (this.collection) {
        const count = await this.collection.count();
        return {
          documentCount: count,
          storageType: 'ChromaDB'
        };
      } else {
        return {
          documentCount: this.inMemoryStorage ? this.inMemoryStorage.documents.length : 0,
          storageType: 'In-Memory'
        };
      }
    } catch (error) {
      console.error('Stats error:', error);
      return {
        documentCount: 0,
        storageType: 'Unknown'
      };
    }
  }

  // Clear all documents
  async clearAll() {
    try {
      if (this.collection) {
        // Delete and recreate collection
        await this.client.deleteCollection({ name: "product_knowledge" });
        this.collection = await this.client.createCollection({
          name: "product_knowledge",
          embeddingFunction: this.embeddingFunction,
          metadata: { 
            description: "Product knowledge base for AI training system" 
          }
        });
        
        return { success: true, message: 'Collection cleared' };
      } else {
        // Clear in-memory storage
        this.inMemoryStorage = {
          documents: [],
          embeddings: [],
          metadata: []
        };
        
        return { success: true, message: 'Memory storage cleared' };
      }
    } catch (error) {
      console.error('Clear error:', error);
      throw error;
    }
  }
}

module.exports = VectorStore;