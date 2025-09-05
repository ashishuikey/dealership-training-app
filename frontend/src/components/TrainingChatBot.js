import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './TrainingChatBot.css';

function TrainingChatBot({ trainingScenario = null }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Sales Coach.\n\nTo get started, could you tell me a bit about your sales experience and what products or services you sell?\n\nOnce I know more, I\'ll present you with some realistic sales scenarios and help you practice your skills!',
      timestamp: new Date(),
      source: 'system'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (trainingScenario && trainingScenario !== currentScenario) {
      handleScenarioStart(trainingScenario);
      setCurrentScenario(trainingScenario);
    }
  }, [trainingScenario, currentScenario]);

  const handleScenarioStart = (scenario) => {
    const scenarioMessages = {
      'objection-handling': 'Let\'s practice handling customer objections! I\'ll play the role of a customer with concerns about price, features, or financing. Are you ready to start?',
      'product-knowledge': 'Time for a product knowledge quiz! I\'ll ask you questions about our vehicle specifications, features, and benefits. Let\'s begin with our hybrid models.',
      'closing-techniques': 'Let\'s work on closing techniques. I\'ll present you with different customer situations, and you can practice various closing strategies. Ready to practice?',
      'customer-interaction': 'Let\'s practice customer interaction scenarios. I\'ll simulate different types of customers - first-time buyers, returning customers, budget-conscious, luxury seekers. Which type would you like to practice with?'
    };

    const scenarioMessage = {
      id: Date.now(),
      type: 'bot',
      content: scenarioMessages[scenario] || 'Let\'s start this training session!',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, scenarioMessage]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot/training', {
        message: inputMessage.trim(),
        context: 'sales_training',
        scenario: currentScenario,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
        feedback: response.data.feedback,
        score: response.data.score,
        source: response.data.source || 'unknown',
        usage: response.data.usage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Training chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I\'m having trouble connecting right now. Let\'s continue with your training - try asking about sales techniques, product features, or customer handling strategies.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    const quickActions = {
      'roleplay': 'I\'d like to do some role-playing exercises.',
      'quiz': 'Can you quiz me on product knowledge?',
      'tips': 'Give me some sales tips for today.',
      'objections': 'Help me practice handling common objections.',
      'features': 'Tell me about key features I should highlight to customers.',
      'closing': 'What are some effective closing techniques?'
    };

    setInputMessage(quickActions[action] || action);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AI Sales Coach.\n\nTo get started, could you tell me a bit about your sales experience and what products or services you sell?\n\nOnce I know more, I\'ll present you with some realistic sales scenarios and help you practice your skills!',
        timestamp: new Date(),
        source: 'system'
      }
    ]);
    setCurrentScenario(null);
  };

  const quickActions = [
    { key: 'roleplay', icon: '🎭', text: 'Role Play' },
    { key: 'quiz', icon: '❓', text: 'Quiz Me' },
    { key: 'tips', icon: '💡', text: 'Sales Tips' },
    { key: 'objections', icon: '🛡️', text: 'Objections' },
    { key: 'features', icon: '⭐', text: 'Key Features' },
    { key: 'closing', icon: '🎯', text: 'Closing' }
  ];

  return (
    <div className="training-chatbot">
      <div className="training-chatbot-header">
        <div className="header-info">
          <div className="trainer-avatar">🤖</div>
          <div className="trainer-details">
            <h3>AI Training Coach</h3>
            <span className="trainer-status">
              {currentScenario ? `Training: ${currentScenario.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 'Ready to Train'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="clear-btn" onClick={clearChat} title="Reset Training">
            🔄
          </button>
        </div>
      </div>

      <div className="training-messages">
        {messages.map((message) => (
          <div key={message.id} className={`training-message ${message.type}`}>
            <div className="message-content">
              {message.type === 'bot' && <span className="trainer-icon">🤖</span>}
              <div className="message-bubble">
                {message.content}
                {message.source === 'gpt' && (
                  <div className="gpt-indicator">
                    <span className="gpt-badge">✨ Powered by GPT</span>
                  </div>
                )}
                {message.feedback && (
                  <div className="training-feedback">
                    <div className="feedback-header">
                      <span className="feedback-icon">📝</span>
                      <span className="feedback-title">Feedback:</span>
                      {message.score && (
                        <span className="feedback-score">Score: {message.score}/10</span>
                      )}
                    </div>
                    <div className="feedback-content">{message.feedback}</div>
                  </div>
                )}
              </div>
              {message.type === 'user' && <span className="user-icon">👤</span>}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="training-message bot">
            <div className="message-content">
              <span className="trainer-icon">🤖</span>
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="training-quick-actions">
        <div className="quick-actions-title">Quick Actions:</div>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.key}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action.key)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      <form className="training-input-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about sales techniques, practice scenarios, or request training..."
            className="training-input"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={isTyping || !inputMessage.trim()}
            title="Send message"
          >
            📤
          </button>
        </div>
      </form>
    </div>
  );
}

export default TrainingChatBot;