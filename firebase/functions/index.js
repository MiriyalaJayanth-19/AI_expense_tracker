const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors')({ origin: true });

// Initialize Gemini AI
// IMPORTANT: Set your Gemini API key in Firebase config
// Run: firebase functions:config:set gemini.api_key="YOUR_API_KEY"
const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

// Categories for expense classification
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

/**
 * Cloud Function to parse expense from voice text using Gemini AI
 * 
 * Request body:
 * {
 *   "text": "I spent 50 dollars on lunch today"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "amount": 50,
 *   "category": "Food",
 *   "description": "lunch",
 *   "date": "2024-10-23",
 *   "confidence": 0.95
 * }
 */
exports.parseExpense = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Create the prompt for Gemini
      const prompt = `
You are an AI assistant that parses expense information from natural language text.

Extract the following information from the text:
1. Amount (numeric value)
2. Category (must be one of: ${CATEGORIES.join(', ')})
3. Description (brief description of the expense)
4. Date (if mentioned, otherwise use today's date)

Text: "${text}"

Respond ONLY with a valid JSON object in this exact format:
{
  "amount": <number>,
  "category": "<one of the valid categories>",
  "description": "<brief description>",
  "date": "<YYYY-MM-DD format>",
  "confidence": <number between 0 and 1>
}

Rules:
- Amount must be a positive number
- Category must be exactly one of the provided categories
- If no clear category, use "Other"
- Date should be in YYYY-MM-DD format
- Confidence should reflect how certain you are about the extraction (0.0 to 1.0)
- Do not include any explanation, only return the JSON object
`;

      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Parse the JSON response
      let parsedData;
      try {
        // Remove markdown code blocks if present
        const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', generatedText);
        throw new Error('Invalid response format from AI');
      }

      // Validate the parsed data
      if (!parsedData.amount || parsedData.amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!CATEGORIES.includes(parsedData.category)) {
        parsedData.category = 'Other';
      }

      // Return successful response
      return res.status(200).json({
        success: true,
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description || text,
        date: parsedData.date || new Date().toISOString().split('T')[0],
        confidence: parsedData.confidence || 0.8,
      });

    } catch (error) {
      console.error('Parse expense error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to parse expense',
      });
    }
  });
});

/**
 * Health check endpoint
 */
exports.health = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AI Expense Parser',
    version: '1.0.0',
  });
});
