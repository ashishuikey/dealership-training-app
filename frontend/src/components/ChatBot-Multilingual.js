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
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Supported languages
  const languages = {
    'auto': { name: 'Auto-detect', code: 'auto' },
    'en-US': { name: 'English (US)', code: 'en-US' },
    'hi-IN': { name: 'हिंदी', code: 'hi-IN' },
    'es-ES': { name: 'Español', code: 'es-ES' },
    'fr-FR': { name: 'Français', code: 'fr-FR' },
    'de-DE': { name: 'Deutsch', code: 'de-DE' },
    'zh-CN': { name: '中文', code: 'zh-CN' },
    'ja-JP': { name: '日本語', code: 'ja-JP' },
    'ar-SA': { name: 'العربية', code: 'ar-SA' },
    'pt-BR': { name: 'Português', code: 'pt-BR' },
    'ru-RU': { name: 'Русский', code: 'ru-RU' },
    'ko-KR': { name: '한국어', code: 'ko-KR' },
    'it-IT': { name: 'Italiano', code: 'it-IT' },
    'ta-IN': { name: 'தமிழ்', code: 'ta-IN' },
    'te-IN': { name: 'తెలుగు', code: 'te-IN' },
    'bn-IN': { name: 'বাংলা', code: 'bn-IN' },
    'mr-IN': { name: 'मराठी', code: 'mr-IN' },
    'gu-IN': { name: 'ગુજરાતી', code: 'gu-IN' },
    'kn-IN': { name: 'ಕನ್ನಡ', code: 'kn-IN' },
    'ml-IN': { name: 'മലയാളം', code: 'ml-IN' },
    'pa-IN': { name: 'ਪੰਜਾਬੀ', code: 'pa-IN' }
  };

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

  // Initialize multilingual speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
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
        
        if (finalTranscript) {
          setInputMessage(finalTranscript);
          setIsListening(false);
          recognitionRef.current.stop();
          
          setTimeout(() => {
            const submitButton = document.querySelector('.send-btn');
            if (submitButton && finalTranscript.trim()) {
              submitButton.click();
            }
          }, 100);
        } else {
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

  // Update speech recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      const langCode = selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage;
      recognitionRef.current.lang = langCode;
    }
  }, [selectedLanguage, detectedLanguage]);

  // Detect language from text
  const detectLanguage = (text) => {
    // Simple language detection based on character sets
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja-JP';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
    if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko-KR';
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
    if (/[\u0B00-\u0B7F]/.test(text)) return 'ta-IN';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'te-IN';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'kn-IN';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
    
    // Check for Latin-based languages
    if (/[àâäæçéèêëíìîïñóòôöœúùûü]/i.test(text)) return 'fr-FR';
    if (/[áéíóúñü]/i.test(text)) return 'es-ES';
    if (/[äöüß]/i.test(text)) return 'de-DE';
    if (/[àèéìíòóùú]/i.test(text)) return 'it-IT';
    if (/[ãõáéíóúâê]/i.test(text)) return 'pt-BR';
    
    return 'en-US';
  };

  // Keyboard shortcuts for voice input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && isOpen && document.activeElement === inputRef.current && event.ctrlKey) {
        event.preventDefault();
        if (isListening) {
          stopListening();
        } else if (speechSupported) {
          startListening();
        }
      }
      
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
        setInputMessage('');
        // Set language for recognition
        const langCode = selectedLanguage === 'auto' ? 'en-US' : selectedLanguage;
        recognitionRef.current.lang = langCode;
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

    // Detect language if auto-detect is enabled
    let messageLang = selectedLanguage;
    if (selectedLanguage === 'auto') {
      messageLang = detectLanguage(inputMessage.trim());
      setDetectedLanguage(messageLang);
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      language: messageLang,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot', {
        message: inputMessage.trim(),
        context: 'luxury_hybrid_sales',
        language: messageLang,
        responseLanguage: messageLang
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        language: response.data.language || messageLang,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Speak the response in the detected language
      if ('speechSynthesis' in window && response.data.response) {
        const utterance = new SpeechSynthesisUtterance(response.data.response);
        utterance.lang = messageLang;
        utterance.rate = 1.1; // Slightly faster for kid-like speech
        utterance.pitch = 1.2; // Higher pitch for child voice
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try asking your question again.',
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

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    
    // Update recognition language immediately
    if (recognitionRef.current) {
      const langCode = e.target.value === 'auto' ? detectedLanguage : e.target.value;
      recognitionRef.current.lang = langCode;
    }
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
            <select 
              className="language-selector"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              title="Select language"
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.name}
                </option>
              ))}
            </select>
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
                  {message.language && message.language !== 'en-US' && (
                    <span className="language-badge">{languages[message.language]?.name || message.language}</span>
                  )}
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
              placeholder={isListening ? `Listening in ${languages[selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage].name}...` : "Type or click the mic to speak..."}
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
                  title={isListening ? "Stop listening" : `Click to speak in ${languages[selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage].name}`}
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
              <span className="listening-text">
                Listening in {languages[selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage].name}... Speak clearly!
              </span>
            </div>
          )}
          {speechSupported && !isListening && (
            <div className="voice-hint">
              💡 Pro tip: Click the microphone 🎤 or press Ctrl+Space for voice input in any language
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