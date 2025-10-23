import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';
import AIParsingService from '../services/AIParsingService';

const CATEGORIES = [
  'Food', 'Entertainment', 'Travel', 'Necessities', 
  'Loans', 'Healthcare', 'Education', 'Utilities', 'Other'
];

function ExpenseForm({ onAddExpense }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [currency, setCurrency] = useState('INR'); // 'USD' or 'INR'
  const [language, setLanguage] = useState('en-IN'); // Voice recognition language
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [mode, setMode] = useState('voice'); // 'voice' or 'manual'

  // Detect user's location and set currency
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Try to get timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Indian timezones
        if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
          setCurrency('INR');
        } else if (timezone.includes('America')) {
          setCurrency('USD');
        } else {
          // Fallback: try IP-based detection
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data.country_code === 'IN') {
            setCurrency('INR');
          } else if (data.country_code === 'US') {
            setCurrency('USD');
          } else {
            setCurrency('INR'); // Default to INR
          }
        }
      } catch (error) {
        console.error('Currency detection error:', error);
        setCurrency('INR'); // Default to INR on error
      }
    };
    
    detectCurrency();
  }, []);

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set language - browser will auto-detect from user's speech
    // Using en-IN as it supports multiple Indian languages
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
      
      // Parse with AI
      setIsParsing(true);
      try {
        const parsed = await AIParsingService.parseExpense(transcript);
        setAmount(parsed.amount.toString());
        setCategory(parsed.category);
        setCurrency(parsed.currency || 'INR');
      } catch (error) {
        console.error('Parsing error:', error);
      }
      setIsParsing(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in browser settings.');
      } else {
        alert('Voice recognition error: ' + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      category,
      description: text || `${category} expense`,
      date: new Date(), // Auto-capture current date and time
      currency,
    });

    // Reset form
    setText('');
    setAmount('');
    setCategory('Food');
  };

  return (
    <div className="expense-form">
      <div className="mode-toggle">
        <button 
          className={mode === 'voice' ? 'active' : ''} 
          onClick={() => setMode('voice')}
        >
          🎙️ Voice Input
        </button>
        <button 
          className={mode === 'manual' ? 'active' : ''} 
          onClick={() => setMode('manual')}
        >
          ⌨️ Manual Entry
        </button>
      </div>

      {mode === 'voice' && (
        <div className="voice-section">
          <div className="voice-instructions">
            <p>🎯 <strong>Speak in ANY language!</strong></p>
            <p>🇬🇧 "500 rupees for lunch" • 🇮🇳 "100 रुपये खाना" • "50 dollars movie"</p>
            <div className="language-selector">
              <label>Voice Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en-IN">🇮🇳 English (India)</option>
                <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
                <option value="ta-IN">🇮🇳 தமிழ் (Tamil)</option>
                <option value="te-IN">🇮🇳 తెలుగు (Telugu)</option>
                <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
                <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
                <option value="kn-IN">🇮🇳 ಕನ್ನಡ (Kannada)</option>
                <option value="ml-IN">🇮🇳 മലയാളം (Malayalam)</option>
                <option value="gu-IN">🇮🇳 ગુજરાતી (Gujarati)</option>
                <option value="en-US">🇺🇸 English (US)</option>
              </select>
            </div>
          </div>
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceInput}
            disabled={isListening || isParsing}
          >
            {isListening ? '🎤 Listening...' : isParsing ? '⏳ Processing...' : '🎙️ Tap to Speak'}
          </button>
          {text && (
            <div className="voice-text">
              <strong>You said:</strong> "{text}"
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">₹ Indian Rupee (INR)</option>
            <option value="USD">$ US Dollar (USD)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount ({currency === 'INR' ? '₹' : '$'})</label>
          <div className="amount-input">
            <span className="currency-symbol">{currency === 'INR' ? '₹' : '$'}</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {text && (
          <div className="parsed-info">
            <strong>Voice Input:</strong> "{text}"
          </div>
        )}

        <button type="submit" className="submit-button">
          ✅ Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
