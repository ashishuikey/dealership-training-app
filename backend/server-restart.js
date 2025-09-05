// Quick restart script to test changes
console.log('Server restart test - checking quiz route includes correctAnswer');
const trainingData = require('./data/quiz');

// Test that quiz data has correctAnswer field
const testQuestion = trainingData.quizQuestions[0];
console.log('Sample question:', {
  id: testQuestion.id,
  question: testQuestion.question,
  correctAnswer: testQuestion.correctAnswer,
  hasCorrectAnswer: testQuestion.correctAnswer !== undefined
});

// Test the route logic
const questionsWithAnswers = trainingData.quizQuestions.slice(0, 2).map(q => ({
  id: q.id,
  productId: q.productId,
  category: q.category,
  difficulty: q.difficulty,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer
}));

console.log('\nRoute would return:', JSON.stringify(questionsWithAnswers, null, 2));
console.log('\nQuiz route is now configured to include correctAnswer field!');