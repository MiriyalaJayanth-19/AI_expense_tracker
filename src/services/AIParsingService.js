import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY_STORAGE = '@gemini_api_key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Default categories for parsing
const CATEGORIES = [
  'Food',
  'Entertainment',
  'Travel',
  'Necessities',
  'Loans',
  'Healthcare',
  'Education',
  'Utilities',
  'Other',
];

class AIParsingService {
  constructor() {
    this.apiKey = 'AIzaSyDchyyMfCsEzQr5oJYr-TZBCNWf6xbbQGM';
  }

  /**
   * Initialize the service with Gemini API Key
   * @param {string} apiKey - Gemini API Key
   */
  async initialize(apiKey) {
    try {
      this.apiKey = apiKey;
      await AsyncStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);
    } catch (error) {
      console.error('Initialize AI service error:', error);
    }
  }

  /**
   * Get stored Gemini API Key
   * @returns {Promise<string|null>}
   */
  async getApiKey() {
    if (this.apiKey) {
      return this.apiKey;
    }

    try {
      const key = await AsyncStorage.getItem(GEMINI_API_KEY_STORAGE);
      this.apiKey = key || 'AIzaSyDchyyMfCsEzQr5oJYr-TZBCNWf6xbbQGM';
      return this.apiKey;
    } catch (error) {
      console.error('Get API key error:', error);
      return 'AIzaSyDchyyMfCsEzQr5oJYr-TZBCNWf6xbbQGM';
    }
  }

  /**
   * Parse voice text into structured expense data using Gemini AI
   * @param {string} text - Voice input text
   * @returns {Promise<Object>} Parsed expense data
   */
  async parseExpense(text) {
    try {
      const apiKey = await this.getApiKey();

      if (!apiKey) {
        return this.localParse(text);
      }

      const prompt = `Parse this expense description into JSON format:
"${text}"

Extract:
- amount (number)
- category (one of: Food, Entertainment, Travel, Necessities, Loans, Healthcare, Education, Utilities, Other)
- description (string)
- date (ISO format, default to today if not mentioned)

Respond ONLY with valid JSON in this exact format:
{"amount": 0, "category": "Other", "description": "", "date": "2025-10-23"}`;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiText = response.data.candidates[0].content.parts[0].text;
        // Extract JSON from response (remove markdown code blocks if present)
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            amount: parseFloat(parsed.amount) || 0,
            category: parsed.category || 'Other',
            description: parsed.description || text,
            date: parsed.date ? new Date(parsed.date) : new Date(),
            confidence: 0.9,
          };
        }
      }
      
      throw new Error('Invalid AI response');
    } catch (error) {
      console.error('AI parsing error:', error);
      return this.localParse(text);
    }
  }

  /**
   * Local fallback parsing using regex and keywords
   * @param {string} text - Voice input text
   * @returns {Object} Parsed expense data
   */
  localParse(text) {
    const lowerText = text.toLowerCase();

    // Extract amount (looks for numbers with optional currency symbols)
    let amount = 0;
    const amountMatches = text.match(/(\$|₹|€|£)?\s*(\d+(?:[.,]\d+)?)/);
    if (amountMatches) {
      amount = parseFloat(amountMatches[2].replace(',', ''));
    }

    // Extract category based on keywords
    let category = 'Other';
    const categoryKeywords = {
      Food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'coffee', 'meal', 'ate', 'eating'],
      Entertainment: ['movie', 'cinema', 'concert', 'game', 'entertainment', 'fun', 'party', 'show'],
      Travel: ['travel', 'flight', 'hotel', 'taxi', 'uber', 'train', 'bus', 'trip', 'vacation'],
      Necessities: ['grocery', 'groceries', 'shopping', 'clothes', 'clothing', 'supermarket', 'store'],
      Loans: ['loan', 'emi', 'installment', 'payment', 'debt', 'borrowed', 'lent'],
      Healthcare: ['doctor', 'hospital', 'medicine', 'medical', 'health', 'pharmacy', 'clinic'],
      Education: ['education', 'course', 'book', 'school', 'college', 'tuition', 'class'],
      Utilities: ['electricity', 'water', 'gas', 'internet', 'phone', 'bill', 'utility', 'rent'],
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Extract date (looks for date patterns)
    let date = new Date();
    const datePatterns = [
      /yesterday/i,
      /today/i,
      /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
    ];

    if (lowerText.includes('yesterday')) {
      date = new Date();
      date.setDate(date.getDate() - 1);
    }

    // Use the original text as description
    const description = text.trim();

    return {
      amount,
      category,
      description,
      date,
      confidence: 0.6, // Lower confidence for local parsing
    };
  }

  /**
   * Validate parsed expense data
   * @param {Object} expense - Parsed expense data
   * @returns {Object} Validation result
   */
  validateExpense(expense) {
    const errors = [];

    if (!expense.amount || expense.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!expense.category || !CATEGORIES.includes(expense.category)) {
      errors.push('Invalid category');
    }

    if (!expense.description || expense.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!expense.date || !(expense.date instanceof Date)) {
      errors.push('Invalid date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get suggested category based on description
   * @param {string} description - Expense description
   * @returns {string} Suggested category
   */
  suggestCategory(description) {
    const parsed = this.localParse(description);
    return parsed.category;
  }
}

export default new AIParsingService();
