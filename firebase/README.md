# Firebase Cloud Functions - AI Expense Parser

This directory contains the Firebase Cloud Function that uses Google's Gemini AI to parse expense information from voice input text.

## Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Cloud Functions (Blaze plan required)

### 4. Update Project ID

Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID.

### 5. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 6. Set Environment Variables

```bash
cd firebase/functions
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

### 7. Install Dependencies

```bash
cd functions
npm install
```

### 8. Deploy Functions

```bash
firebase deploy --only functions
```

After deployment, you'll get a URL like:
```
https://us-central1-your-project-id.cloudfunctions.net/parseExpense
```

### 9. Update Mobile App

Copy the function URL and update it in your mobile app:

1. Create a `.env` file in the root of your React Native project:
```
FIREBASE_FUNCTION_URL=https://us-central1-your-project-id.cloudfunctions.net/parseExpense
```

2. Or set it directly in the app using:
```javascript
import AIParsingService from './src/services/AIParsingService';

AIParsingService.initialize('https://your-function-url/parseExpense');
```

## Testing Locally

### Run Functions Emulator

```bash
cd firebase/functions
npm run serve
```

This will start the emulator at `http://localhost:5001`

### Test with cURL

```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/parseExpense \
  -H "Content-Type: application/json" \
  -d '{"text": "I spent 50 dollars on lunch today"}'
```

Expected response:
```json
{
  "success": true,
  "amount": 50,
  "category": "Food",
  "description": "lunch",
  "date": "2024-10-23",
  "confidence": 0.95
}
```

## API Documentation

### POST /parseExpense

Parses expense information from natural language text using Gemini AI.

**Request Body:**
```json
{
  "text": "I spent 50 dollars on lunch today"
}
```

**Response:**
```json
{
  "success": true,
  "amount": 50,
  "category": "Food",
  "description": "lunch",
  "date": "2024-10-23",
  "confidence": 0.95
}
```

**Categories:**
- Food
- Entertainment
- Travel
- Necessities
- Loans
- Healthcare
- Education
- Utilities
- Other

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "AI Expense Parser",
  "version": "1.0.0"
}
```

## Cost Considerations

### Gemini API
- Free tier: 60 requests per minute
- Paid tier: Pay per request

### Firebase Cloud Functions
- Free tier: 2M invocations/month
- Paid tier: $0.40 per million invocations

For a hackathon demo, the free tiers should be sufficient.

## Security

- The Gemini API key is stored securely in Firebase config
- CORS is enabled for all origins (restrict in production)
- Input validation is performed on all requests

## Troubleshooting

### Function not deploying
- Ensure you're on the Blaze (pay-as-you-go) plan
- Check that Node.js version is 18

### API key errors
- Verify the API key is set: `firebase functions:config:get`
- Ensure the key is valid in Google AI Studio

### CORS errors
- The function has CORS enabled for all origins
- For production, restrict to your app's domain

## Production Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Add Firebase Auth to verify users
3. **Monitoring**: Set up Cloud Monitoring and alerts
4. **CORS**: Restrict CORS to your app's domain only
5. **Error Handling**: Implement comprehensive error handling
6. **Caching**: Cache common expense patterns to reduce API calls
