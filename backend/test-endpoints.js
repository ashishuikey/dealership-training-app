const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const ADMIN_TOKEN = '9999999999_admin'; // Admin token

async function testUrlProcessing() {
  console.log('\n=== Testing URL Processing ===');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/process-url`, {
      url: 'https://www.example.com',
      token: ADMIN_TOKEN
    });
    
    console.log('✅ URL Processing works!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ URL Processing failed:', error.response?.data || error.message);
  }
}

async function testFileUpload() {
  console.log('\n=== Testing File Upload (Video Support) ===');
  
  // Create a test file
  const testContent = 'Test product information for video upload test';
  fs.writeFileSync('test.txt', testContent);
  
  try {
    const form = new FormData();
    form.append('files', fs.createReadStream('test.txt'));
    form.append('token', ADMIN_TOKEN);
    
    const response = await axios.post(
      `${BASE_URL}/api/admin/process-vehicle-files`,
      form,
      {
        headers: form.getHeaders()
      }
    );
    
    console.log('✅ File Upload works!');
    console.log('Response:', response.data);
    
    // Clean up test file
    fs.unlinkSync('test.txt');
  } catch (error) {
    console.log('❌ File Upload failed:', error.response?.data || error.message);
    // Clean up test file
    if (fs.existsSync('test.txt')) {
      fs.unlinkSync('test.txt');
    }
  }
}

async function testEnhancedEndpoints() {
  console.log('\n=== Testing Enhanced AI Endpoints ===');
  
  try {
    // Test knowledge search
    const searchResponse = await axios.post(`${BASE_URL}/api/ai/chat/search`, {
      query: 'hybrid vehicles'
    });
    
    console.log('✅ Knowledge Search works!');
    console.log('Results count:', searchResponse.data.results?.length || 0);
    
    // Test enhanced chat
    const chatResponse = await axios.post(`${BASE_URL}/api/ai/chat/`, {
      message: 'Tell me about hybrid cars',
      userId: 'test_user'
    });
    
    console.log('✅ Enhanced Chat works!');
    console.log('Response:', chatResponse.data.response?.substring(0, 100) + '...');
    
  } catch (error) {
    console.log('❌ Enhanced endpoints failed:', error.response?.data || error.message);
  }
}

async function listAcceptedFileTypes() {
  console.log('\n=== Accepted File Types ===');
  console.log('Documents: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Text (.txt), CSV');
  console.log('Images: JPEG, PNG, WebP');
  console.log('Audio: MP3, WAV, OGG, M4A');
  console.log('Video: MP4, AVI, MOV, WMV, WebM, MKV');
  console.log('Max file size: 100MB');
}

async function runAllTests() {
  console.log('🧪 Starting Endpoint Tests...\n');
  
  await listAcceptedFileTypes();
  await testUrlProcessing();
  await testFileUpload();
  await testEnhancedEndpoints();
  
  console.log('\n✨ All tests completed!');
}

// Run tests
runAllTests().catch(console.error);