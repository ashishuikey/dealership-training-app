import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hey there! I\'m Gabru! I know EVERYTHING about cars! 🚗 My dad says I\'m a genius! What car stuff do you wanna know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;  // Enable interim results
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update input with interim or final results
        if (finalTranscript) {
          // Set the message and stop listening
          setInputMessage(finalTranscript);
          setIsListening(false);
          recognitionRef.current.stop();
          
          // Use a flag to trigger submission after state update
          setTimeout(() => {
            const submitButton = document.querySelector('.send-btn');
            if (submitButton && finalTranscript.trim()) {
              submitButton.click();
            }
          }, 100);
        } else {
          // Show interim results while speaking
          setInputMessage(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permission to use voice input.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Keyboard shortcuts for voice input
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Spacebar to start/stop voice input (only when chatbot is open and input is focused)
      if (event.code === 'Space' && isOpen && document.activeElement === inputRef.current && event.ctrlKey) {
        event.preventDefault();
        if (isListening) {
          stopListening();
        } else if (speechSupported) {
          startListening();
        }
      }
      
      // Escape to stop listening
      if (event.key === 'Escape' && isListening) {
        stopListening();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isListening, speechSupported]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Clear any existing text first
        setInputMessage('');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        alert('Failed to start voice input. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
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
      const response = await axios.post('/api/chatbot', {
        message: inputMessage.trim(),
        context: 'luxury_hybrid_sales'
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try asking your question again, or refer to the product documentation for immediate assistance.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const quickQuestions = [
    "Cars available between 30-40 Lakhs?",
    "Best hybrid models in stock?",
    "Latest incentives and offers?"
  ];

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Okay, clean slate! Ask me anything about cars! I memorized ALL the specs! 🤓',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤓'}
      </div>

      {/* Chat Window */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="gabru-avatar animated">
              <div className="gabru-head">
                <div className="gabru-glasses">👓</div>
                <div className="gabru-face">🤓</div>
              </div>
              <div className="gabru-bubble">Hi!</div>
            </div>
            <div>
              <h3>Gabru - Car Genius Kid</h3>
              <span className="chatbot-status">Super smart & ready!</span>
            </div>
          </div>
          <div className="chatbot-controls">
            <button className="clear-chat-btn" onClick={clearChat} title="Clear chat">
              🗑️
            </button>
            <button className="close-btn" onClick={() => setIsOpen(false)} title="Close chat">
              ✕
            </button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'bot' && <span className="bot-avatar">🤓</span>}
                <div className="message-bubble">
                  {message.content}
                </div>
                {message.type === 'user' && <span className="user-avatar">👤</span>}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <span className="bot-avatar">🤓</span>
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

        {/* Quick Questions */}
        <div className="quick-questions">
          <div className="quick-questions-title">Quick Questions:</div>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening... (auto-submits when done)" : "Type or click the mic to speak..."}
              className={`chat-input ${isListening ? 'listening' : ''}`}
              disabled={isTyping}
            />
            <div className="input-buttons">
              {speechSupported && (
                <button
                  type="button"
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isTyping}
                  title={isListening ? "Stop listening" : "Click to speak"}
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              )}
              <button 
                type="submit" 
                className="send-btn" 
                disabled={isTyping || !inputMessage.trim()}
                title="Send message"
              >
                📤
              </button>
            </div>
          </div>
          {isListening && (
            <div className="listening-indicator">
              <div className="sound-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="listening-text">Listening... Speak clearly!</span>
            </div>
          )}
          {speechSupported && !isListening && (
            <div className="voice-hint">
              💡 Pro tip: Click the microphone 🎤 or press Ctrl+Space for voice input
            </div>
          )}
        </form>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chatbot-backdrop" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default ChatBot;