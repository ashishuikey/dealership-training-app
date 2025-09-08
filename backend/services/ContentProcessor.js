const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const { createWorker } = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

class ContentProcessor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Process different file types and extract content
  async processFile(filePath, fileType) {
    console.log(`Processing file: ${filePath} of type: ${fileType}`);
    
    let content = '';
    let metadata = {};

    try {
      switch (fileType.toLowerCase()) {
        case 'pdf':
          content = await this.processPDF(filePath);
          metadata.type = 'pdf';
          break;
        
        case 'docx':
        case 'doc':
          content = await this.processWord(filePath);
          metadata.type = 'document';
          break;
        
        case 'xlsx':
        case 'xls':
        case 'csv':
          content = await this.processSpreadsheet(filePath);
          metadata.type = 'spreadsheet';
          break;
        
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'webp':
          content = await this.processImage(filePath);
          metadata.type = 'image';
          break;
        
        case 'mp3':
        case 'wav':
        case 'ogg':
        case 'm4a':
          content = await this.processAudio(filePath);
          metadata.type = 'audio';
          break;
        
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
          content = await this.processVideo(filePath);
          metadata.type = 'video';
          break;
        
        case 'txt':
          content = await fs.readFile(filePath, 'utf-8');
          metadata.type = 'text';
          break;
        
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Extract structured data from content
      const structuredData = await this.extractStructuredData(content, metadata.type);
      
      return {
        rawContent: content,
        structuredData,
        metadata,
        processedAt: new Date()
      };

    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      throw error;
    }
  }

  // Process PDF files
  async processPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF processing error:', error);
      throw error;
    }
  }

  // Process Word documents
  async processWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('Word document processing error:', error);
      throw error;
    }
  }

  // Process spreadsheets
  async processSpreadsheet(filePath) {
    try {
      const workbook = xlsx.readFile(filePath);
      let content = '';
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        content += `Sheet: ${sheetName}\n`;
        jsonData.forEach((row, index) => {
          if (Array.isArray(row) && row.length > 0) {
            content += row.join(' | ') + '\n';
          }
        });
        content += '\n';
      });
      
      return content;
    } catch (error) {
      console.error('Spreadsheet processing error:', error);
      throw error;
    }
  }

  // Process images using OCR and AI vision
  async processImage(filePath) {
    try {
      // First try OCR for text extraction
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(filePath);
      await worker.terminate();
      
      // Also use OpenAI Vision API for better understanding
      const imageData = await fs.readFile(filePath);
      const base64Image = imageData.toString('base64');
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract all text, product information, specifications, and features from this image. If it's a product image, describe the product details." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });
      
      const aiDescription = response.choices[0].message.content;
      
      return `OCR Text: ${text}\n\nAI Analysis: ${aiDescription}`;
    } catch (error) {
      console.error('Image processing error:', error);
      // Fallback to just OCR if AI fails
      try {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(filePath);
        await worker.terminate();
        return text;
      } catch (ocrError) {
        throw ocrError;
      }
    }
  }

  // Process audio files using Whisper API
  async processAudio(filePath) {
    try {
      const audioFile = await fs.readFile(filePath);
      
      // Use OpenAI Whisper for transcription
      const transcription = await this.openai.audio.transcriptions.create({
        file: await fs.openReadStream(filePath),
        model: "whisper-1",
        language: "en"
      });
      
      return transcription.text;
    } catch (error) {
      console.error('Audio processing error:', error);
      return 'Audio transcription not available. Please ensure the audio file contains product information.';
    }
  }

  // Process video files (extract audio and transcribe)
  async processVideo(filePath) {
    try {
      // For now, we'll treat video as audio and transcribe the audio track
      // In production, you might want to use ffmpeg to extract audio first
      return await this.processAudio(filePath);
    } catch (error) {
      console.error('Video processing error:', error);
      return 'Video processing not available. Please extract audio or provide subtitles.';
    }
  }

  // Extract structured data using AI
  async extractStructuredData(content, contentType) {
    try {
      const prompt = `Extract structured product information from the following ${contentType} content. 
      Focus on:
      - Product names and models
      - Specifications (engine, fuel economy, dimensions, etc.)
      - Features and benefits
      - Pricing information
      - Warranty details
      - Safety ratings
      - Technology features
      - Comparison points
      
      Content:
      ${content.substring(0, 3000)}
      
      Return as JSON with these fields: products (array), features (array), specifications (object), pricing (object), keyPoints (array)`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a data extraction specialist. Extract structured product information and return valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Structure extraction error:', error);
      return {
        products: [],
        features: [],
        specifications: {},
        pricing: {},
        keyPoints: []
      };
    }
  }

  // Generate embeddings for vector search
  async generateEmbeddings(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.substring(0, 8000) // Limit text length
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      return null;
    }
  }

  // Chunk content for better processing
  chunkContent(content, chunkSize = 1000) {
    const chunks = [];
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    
    let currentChunk = '';
    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length <= chunkSize) {
        currentChunk += sentence + ' ';
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence + ' ';
      }
    });
    
    if (currentChunk) chunks.push(currentChunk.trim());
    
    return chunks;
  }

  // Process multiple files in batch
  async processBatch(files) {
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.processFile(file.path, file.type);
        results.push({
          filename: file.originalname,
          ...result
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

module.exports = ContentProcessor;