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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchTrainingData();
  }, [productId]);

  const fetchTrainingData = async () => {
    try {
      const endpoint = productId ? `/api/quiz/questions/${productId}` : '/api/quiz/questions';
      const qaEndpoint = productId ? `/api/quiz/qanda/${productId}` : '/api/quiz/qanda';
      const objEndpoint = productId ? `/api/quiz/objections/${productId}` : '/api/quiz/objections';
      
      const [questionsRes, qaRes, objRes] = await Promise.all([
        axios.get(endpoint),
        axios.get(qaEndpoint),
        axios.get(objEndpoint)
      ]);
      
      setQuestions(questionsRes.data);
      setQAndA(qaRes.data || []);
      setObjections(objRes.data || []);
      
      if (productId) {
        const productRes = await axios.get(`/api/products/${productId}`);
        setProduct(productRes.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching training data:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (selectedOption) => {
    if (showFeedback) return; // Prevent selecting another answer after feedback
    
    setSelectedAnswer(selectedOption);
    setShowFeedback(true);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        calculateResults();
      }
    }, 2000);
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const resultData = {
      score: correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      answers: answers,
      questions: questions
    };

    setResults(resultData);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const renderQuizContent = () => {
    if (loading) {
      return <div className="loading">Loading quiz...</div>;
    }

    if (questions.length === 0) {
      return (
        <div className="no-quiz">
          <p>No quiz questions available for this product.</p>
          <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
      );
    }

    if (showResults) {
      return renderResults();
    }

    return renderQuestion();
  };

  const renderResults = () => (
    <div className="quiz-results">
      <div className="results-header">
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-percentage">{results.percentage}%</span>
            <span className="score-text">{results.score} / {results.total}</span>
          </div>
        </div>
      </div>
      
      <div className="results-feedback">
        {results.percentage >= 80 ? (
          <div className="feedback-excellent">
            <h3>Excellent Performance!</h3>
            <p>You have demonstrated strong knowledge of the product.</p>
          </div>
        ) : results.percentage >= 60 ? (
          <div className="feedback-good">
            <h3>Good Job!</h3>
            <p>You have a solid understanding but could benefit from reviewing some areas.</p>
          </div>
        ) : (
          <div className="feedback-improve">
            <h3>Keep Learning!</h3>
            <p>Review the product information and try again to improve your score.</p>
          </div>
        )}
      </div>

      <div className="results-breakdown">
        <h3>Answer Review</h3>
        {results.questions.map((question, index) => (
          <div key={index} className={`result-item ${results.answers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
            <div className="result-question">
              <span className="question-number">Q{index + 1}:</span> {question.question}
            </div>
            <div className="result-answer">
              <p>Your answer: {question.options[results.answers[index]]}</p>
              {results.answers[index] !== question.correctAnswer && (
                <p className="correct-answer">Correct answer: {question.options[question.correctAnswer]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button onClick={resetQuiz} className="btn-primary">Retake Quiz</button>
        <Link to={productId ? `/products/${productId}` : '/products'} className="btn-secondary">
          Back to {productId ? 'Product' : 'Catalog'}
        </Link>
      </div>
    </div>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span className="progress-text">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="quiz-meta">
            <span className="category-badge">{question.category}</span>
            <span className="difficulty-badge difficulty-{question.difficulty}">{question.difficulty}</span>
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">{question.question}</h3>
          <div className="options-grid">
            {question.options.map((option, index) => {
              let buttonClass = "option-button";
              if (showFeedback) {
                if (index === question.correctAnswer) {
                  buttonClass += " correct-answer";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += " wrong-answer";
                }
              }
              
              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {showFeedback && index === question.correctAnswer && (
                    <span className="feedback-icon">✓</span>
                  )}
                  {showFeedback && index === selectedAnswer && index !== question.correctAnswer && (
                    <span className="feedback-icon">✗</span>
                  )}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className="feedback-message">
              {selectedAnswer === question.correctAnswer ? (
                <p className="feedback-correct">Correct! Well done!</p>
              ) : (
                <p className="feedback-incorrect">
                  Incorrect. The correct answer is: {question.options[question.correctAnswer]}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQAndA = () => {
    const allQAs = qAndA.flatMap(qa => 
      qa.questions.map(q => ({ ...q, category: qa.category }))
    );
    
    if (allQAs.length === 0) {
      return (
        <div className="training-section">
          <h2>Questions & Answers</h2>
          <p>No Q&A available for this product.</p>
        </div>
      );
    }

    const currentQAItem = allQAs[currentQA];

    return (
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span className="progress-text">Question {currentQA + 1} of {allQAs.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQA + 1) / allQAs.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="quiz-meta">
            <span className="category-badge">{currentQAItem.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">{currentQAItem.question}</h3>
          
          {!showQAAnswer ? (
            <button className="btn-primary show-answer-btn" onClick={() => setShowQAAnswer(true)}>
              Show Answer
            </button>
          ) : (
            <div className="qa-answer-section">
              <div className="qa-answer">
                <p>{currentQAItem.answer}</p>
                {currentQAItem.followUp && (
                  <p className="follow-up"><strong>Follow-up:</strong> {currentQAItem.followUp}</p>
                )}
              </div>
              <div className="navigation-buttons">
                {currentQA > 0 && (
                  <button className="btn-secondary" onClick={() => {
                    setCurrentQA(currentQA - 1);
                    setShowQAAnswer(false);
                  }}>Previous</button>
                )}
                {currentQA < allQAs.length - 1 ? (
                  <button className="btn-primary" onClick={() => {
                    setCurrentQA(currentQA + 1);
                    setShowQAAnswer(false);
                  }}>Next Question</button>
                ) : (
                  <button className="btn-primary" onClick={() => {
                    setCurrentQA(0);
                    setShowQAAnswer(false);
                  }}>Restart Q&A</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderObjections = () => {
    const allObjections = objections.flatMap(obj => obj.objections);
    
    if (allObjections.length === 0) {
      return (
        <div className="training-section">
          <h2>Objection Handling</h2>
          <p>No objection handling guide available for this product.</p>
        </div>
      );
    }

    const currentObj = allObjections[currentObjection];

    return (
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span className="progress-text">Scenario {currentObjection + 1} of {allObjections.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentObjection + 1) / allObjections.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="quiz-meta">
            <span className="category-badge">{currentObj.category}</span>
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">Customer Objection: "{currentObj.objection}"</h3>
          
          {!showObjectionResponse ? (
            <button className="btn-primary show-answer-btn" onClick={() => setShowObjectionResponse(true)}>
              Show Response Strategy
            </button>
          ) : (
            <div className="objection-response-section">
              <div className="objection-response">
                <p><strong>Response:</strong> {currentObj.response}</p>
                {currentObj.followUp && (
                  <p><strong>Follow-up:</strong> {currentObj.followUp}</p>
                )}
                {currentObj.proofPoints && (
                  <div className="proof-points">
                    <strong>Proof Points:</strong>
                    <ul>
                      {currentObj.proofPoints.map((point, pointIdx) => (
                        <li key={pointIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="navigation-buttons">
                {currentObjection > 0 && (
                  <button className="btn-secondary" onClick={() => {
                    setCurrentObjection(currentObjection - 1);
                    setShowObjectionResponse(false);
                  }}>Previous</button>
                )}
                {currentObjection < allObjections.length - 1 ? (
                  <button className="btn-primary" onClick={() => {
                    setCurrentObjection(currentObjection + 1);
                    setShowObjectionResponse(false);
                  }}>Next Scenario</button>
                ) : (
                  <button className="btn-primary" onClick={() => {
                    setCurrentObjection(0);
                    setShowObjectionResponse(false);
                  }}>Restart Objections</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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