require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const quizRouter = require('./routes/quiz');
const chatbotRouter = require('./routes/chatbot');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

// Enhanced AI routes
const chatbotEnhancedRouter = require('./routes/chatbot-enhanced');
const adminEnhancedRouter = require('./routes/admin-enhanced');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Enhanced AI endpoints
app.use('/api/ai/chat', chatbotEnhancedRouter);
app.use('/api/ai/admin', adminEnhancedRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});