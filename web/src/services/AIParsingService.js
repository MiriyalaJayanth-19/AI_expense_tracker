import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDchyyMfCsEzQr5oJYr-TZBCNWf6xbbQGM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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
  async parseExpense(text) {
    try {
      const prompt = `Parse this expense description (in ANY language - English, Hindi, Tamil, Telugu, etc.) into JSON format:
"${text}"

Extract:
- amount (number) - Look for numbers, "rupees", "रुपये", "dollars", "डॉलर", etc.
- category (one of: Food, Entertainment, Travel, Necessities, Loans, Healthcare, Education, Utilities, Other)
  * Food: lunch, dinner, breakfast, खाना, भोजन, சாப்பாடு, food items
  * Entertainment: movie, cinema, मूवी, சினிமா, games, fun
  * Travel: taxi, bus, train, यात्रा, பயணம், flight, uber
  * Necessities: groceries, shopping, किराना, மளிகை, clothes
  * Healthcare: doctor, medicine, दवा, மருத்துவம், hospital
  * Education: books, course, पढ़ाई, கல்வி, tuition
  * Utilities: electricity, internet, बिजली, மின்சாரம், rent
- description (string) - the original text
- date (ISO format, default to today if not mentioned)
- currency (INR for rupees/रुपये/ரூபாய், USD for dollars, default to INR)

Respond ONLY with valid JSON in this exact format:
{"amount": 0, "category": "Other", "description": "", "date": "2025-10-23", "currency": "INR"}`;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
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
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            amount: parseFloat(parsed.amount) || 0,
            category: parsed.category || 'Other',
            description: parsed.description || text,
            date: parsed.date ? new Date(parsed.date) : new Date(),
            currency: parsed.currency || 'INR',
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

  localParse(text) {
    const lowerText = text.toLowerCase();

    let amount = 0;
    let currency = 'INR'; // Default to INR
    
    // Check for currency indicators (multi-language)
    if (lowerText.includes('dollar') || lowerText.includes('डॉलर') || lowerText.includes('usd') || text.includes('$')) {
      currency = 'USD';
    } else if (lowerText.includes('rupee') || lowerText.includes('रुपये') || lowerText.includes('ரூபாய்') || 
               lowerText.includes('inr') || text.includes('₹') || lowerText.includes('rs')) {
      currency = 'INR';
    }
    
    // Extract amount (handles numbers in any format)
    const amountMatches = text.match(/(\$|₹|€|£|rs\.?|rs)?\s*(\d+(?:[.,]\d+)?)/i);
    if (amountMatches) {
      amount = parseFloat(amountMatches[2].replace(',', ''));
    }

    let category = 'Other';
    const categoryKeywords = {
      Food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'coffee', 'meal', 'ate', 'eating',
             // Common food items
             'pizza', 'burger', 'sandwich', 'biryani', 'rice', 'dal', 'roti', 'naan', 'curry', 'chicken', 'mutton',
             'fish', 'egg', 'milk', 'bread', 'butter', 'cheese', 'paneer', 'dosa', 'idli', 'vada', 'samosa',
             'pakora', 'chaat', 'pani puri', 'bhel', 'sweets', 'dessert', 'ice cream', 'cake', 'pastry',
             'tea', 'chai', 'juice', 'soda', 'water', 'snacks', 'chips', 'biscuits', 'chocolate', 'fruits',
             'vegetables', 'salad', 'soup', 'noodles', 'pasta', 'momos', 'paratha', 'puri', 'sabzi',
             // Hindi
             'खाना', 'भोजन', 'लंच', 'डिनर', 'नाश्ता', 'चाय', 'दूध', 'रोटी', 'चावल', 'दाल', 'सब्जी', 'मिठाई',
             'बिरयानी', 'समोसा', 'पकोड़ा', 'चाट', 'डोसा', 'इडली', 'वडा', 'परांठा', 'पूरी', 'पनीर',
             // Tamil
             'சாப்பாடு', 'உணவு', 'மதிய உணவு', 'இரவு உணவு', 'காலை உணவு', 'டோசை', 'இட்லி', 'வடை', 'சாம்பார்',
             'பிரியாணி', 'சப்பாத்தி', 'பரோட்டா', 'சாதம்', 'கறி', 'மிட்டாய்', 'டீ', 'காபி',
             // Telugu
             'ఆహారం', 'భోజనం', 'లంచ్', 'డిన్నర్', 'బ్రేక్ఫాస్ట్', 'డోసా', 'ఇడ్లీ', 'వడ', 'బిర్యానీ',
             'రొట్టె', 'అన్నం', 'కూర', 'టీ', 'కాఫీ', 'స్వీట్స్',
             // Kannada
             'ಆಹಾರ', 'ಊಟ', 'ಡೋಸೆ', 'ಇಡ್ಲಿ', 'ವಡೆ', 'ಬಿರಿಯಾನಿ', 'ರೊಟ್ಟಿ', 'ಅನ್ನ', 'ಟೀ', 'ಕಾಫಿ',
             // Bengali
             'খাবার', 'খাদ্য', 'ভাত', 'রুটি', 'ডাল', 'তরকারি', 'মিষ্টি', 'চা', 'দুধ'],
      Entertainment: ['movie', 'cinema', 'concert', 'game', 'entertainment', 'fun', 'party', 'show',
                     'मूवी', 'सिनेमा', 'मनोरंजन', // Hindi
                     'சினிமா', 'திரைப்படம்', 'விளையாட்டு', // Tamil
                     'సినిమా', 'వినోదం'], // Telugu
      Travel: ['travel', 'flight', 'hotel', 'taxi', 'uber', 'train', 'bus', 'trip', 'vacation', 'auto',
              'यात्रा', 'टैक्सी', 'ट्रेन', 'बस', // Hindi
              'பயணம்', 'டாக்ஸி', 'ரயில்', 'பஸ்', // Tamil
              'ప్రయాణం', 'టాక్సీ', 'రైలు'], // Telugu
      Necessities: ['grocery', 'groceries', 'shopping', 'clothes', 'clothing', 'supermarket', 'store', 'market',
                   'किराना', 'खरीदारी', 'कपड़े', // Hindi
                   'மளிகை', 'கடை', 'துணி', // Tamil
                   'కిరాణా', 'షాపింగ్'], // Telugu
      Loans: ['loan', 'emi', 'installment', 'payment', 'debt', 'borrowed', 'lent',
             'कर्ज', 'ऋण', 'किस्त', // Hindi
             'கடன்', 'தவணை'], // Tamil
      Healthcare: ['doctor', 'hospital', 'medicine', 'medical', 'health', 'pharmacy', 'clinic',
                  'डॉक्टर', 'अस्पताल', 'दवा', 'दवाई', // Hindi
                  'மருத்துவர்', 'மருத்துவம்', 'மருந்து', // Tamil
                  'డాక్టర్', 'ఆసుపత్రి', 'మందు'], // Telugu
      Education: ['education', 'course', 'book', 'school', 'college', 'tuition', 'class', 'study',
                 'पढ़ाई', 'किताब', 'स्कूल', 'कॉलेज', // Hindi
                 'கல்வி', 'புத்தகம்', 'பள்ளி', // Tamil
                 'చదువు', 'పుస్తకం', 'పాఠశాల'], // Telugu
      Utilities: ['electricity', 'water', 'gas', 'internet', 'phone', 'bill', 'utility', 'rent',
                 'बिजली', 'पानी', 'गैस', 'इंटरनेट', 'किराया', // Hindi
                 'மின்சாரம்', 'தண்ணீர்', 'வாடகை', // Tamil
                 'విద్యుత్', 'నీరు', 'అద్దె'], // Telugu
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        category = cat;
        break;
      }
    }

    let date = new Date();
    if (lowerText.includes('yesterday')) {
      date = new Date();
      date.setDate(date.getDate() - 1);
    }

    const description = text.trim();

    return {
      amount,
      category,
      description,
      date,
      currency,
      confidence: 0.6,
    };
  }
}

export default new AIParsingService();
