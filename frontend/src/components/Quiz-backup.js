import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

function Quiz() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz');
  const [qAndA, setQAndA] = useState([]);
  const [objections, setObjections] = useState([]);
  const [currentQA, setCurrentQA] = useState(0);
  const [currentObjection, setCurrentObjection] = useState(0);
  const [showQAAnswer, setShowQAAnswer] = useState(false);
  const [showObjectionResponse, setShowObjectionResponse] = useState(false);

  useEffect(() => {
    fetchTrainingData();
  }, [productId]);

  const fetchTrainingData = async () => {
    try {
      const endpoint = productId ? `/api/quiz/questions/${productId}` : '/api/quiz/questions';
      const qaEndpoint = productId ? `/api/quiz/qanda/${productId}` : '/api/quiz/qanda';
      const objEndpoint = productId ? `/api/quiz/objections/${productId}` : '/api/quiz/objections';
      
      const [questionsRes, productRes, qaRes, objectionsRes] = await Promise.all([
        axios.get(endpoint),
        productId ? axios.get(`/api/products/${productId}`) : Promise.resolve({ data: null }),
        axios.get(qaEndpoint),
        axios.get(objEndpoint)
      ]);
      
      setQuestions(questionsRes.data);
      setProduct(productRes.data);
      setQAndA(qaRes.data);
      setObjections(objectionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching training data:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, {
      questionId: questions[currentQuestion].id,
      selectedAnswer: optionIndex
    }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const response = await axios.post('/api/quiz/submit', {
        answers: finalAnswers
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading training materials...</div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-header-nav">
          <Link to={productId ? `/products/${productId}` : '/products'} className="back-link">
            ← Back to {productId ? 'Product' : 'Catalog'}
          </Link>
          <h1>{product ? `${product.name} Training` : 'Product Knowledge Training'}</h1>
        </div>
        
        <div className="results-card">
          <h2 className="results-title">Quiz Results</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-percentage">{results.percentage}%</span>
            </div>
            <p className="score-text">
              You got {results.score} out of {results.totalQuestions} questions correct!
            </p>
            <div className="performance-badge">
              {results.percentage >= 80 ? '🏆 Excellent!' : results.percentage >= 70 ? '👍 Good Job!' : '📚 Keep Studying!'}
            </div>
          </div>
          
          <div className="results-details">
            <h3>Review Your Answers</h3>
            {results.results.map((result, index) => {
              const question = questions.find(q => q.id === result.questionId);
              return (
                <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className={`result-badge ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="question-category">{question.category} • {question.difficulty}</span>
                  </div>
                  <p className="result-question">Q{index + 1}: {question.question}</p>
                  <p className="result-answer">
                    {result.isCorrect ? 
                      <span className="correct-text">Correct!</span> : 
                      <span className="incorrect-text">Correct answer: {question.options[result.correctAnswer]}</span>
                    }
                  </p>
                  <div className="result-explanation">
                    <p><strong>Explanation:</strong> {result.explanation}</p>
                    {result.salesTip && (
                      <p className="sales-tip"><strong>💡 Sales Tip:</strong> {result.salesTip}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="results-actions">
            <button onClick={resetQuiz} className="retry-button">
              Take Quiz Again
            </button>
            <button onClick={() => setActiveTab('qanda')} className="view-qanda-button">
              View Q&A Guide
            </button>
            <button onClick={() => setActiveTab('objections')} className="view-objections-button">
              View Objection Handling
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderQuizContent = () => {
    if (questions.length === 0) {
      return <div className="error">No questions available for this product</div>;
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="question-meta">
            <span className="category-badge">{question.category}</span>
            <span className="difficulty-badge difficulty-{question.difficulty}">{question.difficulty}</span>
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">{question.question}</h3>
          <div className="options-grid">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleAnswer(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQAndA = () => (
    <div className="training-section">
      <h2>Questions & Answers</h2>
      {qAndA.length === 0 ? (
        <p>No Q&A available for this product.</p>
      ) : (
        qAndA.map((qa, index) => (
          <div key={index} className="qa-category">
            <h3 className="qa-category-title">{qa.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <div className="qa-items">
              {qa.questions.map((item, idx) => (
                <div key={idx} className="qa-item">
                  <div className="qa-question">
                    <h4>{item.question}</h4>
                  </div>
                  <div className="qa-answer">
                    <p>{item.answer}</p>
                    {item.followUp && (
                      <p className="follow-up"><strong>Follow-up:</strong> {item.followUp}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderObjections = () => (
    <div className="training-section">
      <h2>Objection Handling</h2>
      {objections.length === 0 ? (
        <p>No objection handling guide available for this product.</p>
      ) : (
        objections.map((obj, index) => (
          <div key={index} className="objections-container">
            <div className="objections-grid">
              {obj.objections.map((objection, idx) => (
                <div key={idx} className="objection-card">
                  <div className="objection-header">
                    <h4 className="objection-title">{objection.objection}</h4>
                    <span className="objection-category">{objection.category}</span>
                  </div>
                  <div className="objection-response">
                    <p><strong>Response:</strong> {objection.response}</p>
                    {objection.followUp && (
                      <p><strong>Follow-up:</strong> {objection.followUp}</p>
                    )}
                  </div>
                  {objection.proofPoints && (
                    <div className="proof-points">
                      <strong>Proof Points:</strong>
                      <ul>
                        {objection.proofPoints.map((point, pointIdx) => (
                          <li key={pointIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="quiz-container">
      <div className="quiz-header-nav">
        <Link to={productId ? `/products/${productId}` : '/products'} className="back-link">
          ← Back to {productId ? 'Product' : 'Catalog'}
        </Link>
        <h1>{product ? `${product.name} Training` : 'Product Knowledge Training'}</h1>
      </div>
      
      <div className="training-tabs">
        <button 
          className={activeTab === 'quiz' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('quiz')}
        >
          📝 Quiz ({questions.length} questions)
        </button>
        <button 
          className={activeTab === 'qanda' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('qanda')}
        >
          ❓ Q&A ({qAndA.reduce((acc, qa) => acc + qa.questions.length, 0)} items)
        </button>
        <button 
          className={activeTab === 'objections' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('objections')}
        >
          🛡️ Objection Handling ({objections.reduce((acc, obj) => acc + obj.objections.length, 0)} scenarios)
        </button>
      </div>
      
      <div className="training-content">
        {activeTab === 'quiz' && renderQuizContent()}
        {activeTab === 'qanda' && renderQAndA()}
        {activeTab === 'objections' && renderObjections()}
      </div>
    </div>
  );
}

export default Quiz;