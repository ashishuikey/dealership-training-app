const express = require('express');
const router = express.Router();
const trainingData = require('../data/quiz');

router.get('/questions', (req, res) => {
  const questionsWithAnswers = trainingData.quizQuestions.map(q => ({
    id: q.id,
    productId: q.productId,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
  res.json(questionsWithAnswers);
});

router.get('/questions/:productId', (req, res) => {
  const productQuestions = trainingData.quizQuestions
    .filter(q => q.productId === parseInt(req.params.productId))
    .map(q => ({
      id: q.id,
      productId: q.productId,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));
  res.json(productQuestions);
});

// Get all Q&A
router.get('/qanda', (req, res) => {
  res.json(trainingData.qAndA || []);
});

// Get Q&A for a specific product
router.get('/qanda/:productId', (req, res) => {
  const productId = req.params.productId === 'general' ? 'general' : parseInt(req.params.productId);
  const productQA = trainingData.qAndA.filter(qa => qa.productId === productId);
  res.json(productQA);
});

// Get all objections
router.get('/objections', (req, res) => {
  res.json(trainingData.objectionHandling || []);
});

// Get objection handling for a specific product
router.get('/objections/:productId', (req, res) => {
  const productId = req.params.productId === 'general' ? 'general' : parseInt(req.params.productId);
  const productObjections = trainingData.objectionHandling.filter(obj => obj.productId === productId);
  res.json(productObjections);
});

router.post('/submit', (req, res) => {
  const { answers } = req.body;
  let score = 0;
  const results = [];

  answers.forEach(answer => {
    const question = trainingData.quizQuestions.find(q => q.id === answer.questionId);
    if (question) {
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;
      results.push({
        questionId: answer.questionId,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        salesTip: question.salesTip
      });
    }
  });

  res.json({
    score,
    totalQuestions: answers.length,
    percentage: Math.round((score / answers.length) * 100),
    results
  });
});

module.exports = router;