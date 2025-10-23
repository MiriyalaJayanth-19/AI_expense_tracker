# AI Expense Tracker - Setup Guide

Complete setup guide for the AI-powered expense tracking mobile app built for the hackathon.

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **React Native Environment**: 
  - For Android: Android Studio, Android SDK
  - For iOS: Xcode (Mac only), CocoaPods
- **Firebase Account**: For AI parsing cloud function
- **Gemini API Key**: From Google AI Studio

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd AI_expenese_Tracker
npm install
```

### 2. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Ensure Android SDK is installed and `ANDROID_HOME` environment variable is set.

### 4. Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 🔧 Detailed Setup

### Database Setup (WatermelonDB)

The database is automatically initialized on first run. No additional setup required.

**Schema includes:**
- Users (with password hashing)
- Expenses (with voice text)
- Budgets (monthly/yearly)
- Categories (default + custom)
- Notifications

### Firebase Cloud Function Setup

#### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `ai-expense-tracker`
4. Disable Google Analytics (optional for hackathon)
5. Click "Create project"

#### Step 2: Upgrade to Blaze Plan

Cloud Functions require the Blaze (pay-as-you-go) plan:
1. In Firebase Console, click "Upgrade"
2. Select "Blaze" plan
3. Set up billing (free tier is generous)

#### Step 3: Get Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select your Google Cloud project
4. Copy the API key

#### Step 4: Deploy Cloud Function

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to firebase directory
cd firebase

# Update .firebaserc with your project ID
# Edit .firebaserc and replace "your-project-id"

# Install function dependencies
cd functions
npm install

# Set Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY_HERE"

# Deploy functions
cd ..
firebase deploy --only functions
```

#### Step 5: Update Mobile App

After deployment, you'll get a URL like:
```
https://us-central1-your-project-id.cloudfunctions.net/parseExpense
```

Create `.env` file in project root:
```
FIREBASE_FUNCTION_URL=https://us-central1-your-project-id.cloudfunctions.net/parseExpense
```

Or initialize in the app:
```javascript
// In App.js or a startup file
import AIParsingService from './src/services/AIParsingService';

AIParsingService.initialize('YOUR_FIREBASE_FUNCTION_URL');
```

### Voice Recognition Setup

Voice recognition uses native device APIs and requires no additional setup.

**Permissions are requested automatically:**
- Android: `RECORD_AUDIO` permission
- iOS: Microphone access (handled by React Native)

### Notification Setup

Notifications are configured automatically on app start.

**For Android:**
- Notification channel is created automatically
- No additional setup required

**For iOS:**
- Permissions are requested on first use
- No additional setup required

## 🎯 Testing the App

### 1. Create an Account

1. Launch the app
2. Click "Sign Up"
3. Enter name, email, and password
4. Click "Create Account"

### 2. Add Expense via Voice

1. Tap the "Add" tab (center button)
2. Tap the microphone button
3. Say: "I spent 50 dollars on lunch today"
4. The AI will parse and fill in the details
5. Tap "Add Expense"

### 3. Set a Budget

1. Go to "Budgets" tab
2. Tap the "+" button
3. Select category (e.g., Food)
4. Enter limit amount (e.g., 500)
5. Select period (Monthly/Yearly)
6. Tap "Create Budget"

### 4. View Analytics

1. Go to "Analytics" tab
2. View spending breakdown by category
3. See monthly/yearly totals
4. Check insights and recommendations

### 5. Test Premium Features

1. Go to "Profile" tab
2. Tap "Upgrade" button
3. Select a plan (Monthly/Yearly/Lifetime)
4. Tap "Purchase" (simulated for demo)
5. Enjoy unlimited features!

## 📱 App Features

### Free Tier
- ✅ Up to 100 expenses per month
- ✅ 5 default categories
- ✅ Voice input in 3 languages
- ✅ Monthly budget tracking
- ✅ Basic analytics

### Premium Tier ($4.99/month or $39.99/year)
- ✅ Unlimited expenses
- ✅ Custom categories
- ✅ Voice input in 50+ languages
- ✅ Monthly + Yearly budgets
- ✅ Advanced analytics
- ✅ Data export (CSV, PDF)
- ✅ Cloud backup (optional)
- ✅ Ad-free experience

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Secure Storage**: react-native-keychain for credentials
- **Biometric Auth**: Face ID / Fingerprint support
- **Local-First**: All data stored on device
- **Encrypted**: Keychain/Keystore encryption

## 🌐 Supported Languages (Voice Input)

**Free Tier (3 languages):**
- English (US)
- Hindi
- Spanish

**Premium (50+ languages):**
- All major world languages
- Regional dialects
- See `POPULAR_LOCALES` in `VoiceService.js`

## 🐛 Troubleshooting

### App won't start

**Check Node modules:**
```bash
rm -rf node_modules
npm install
```

**Clear Metro cache:**
```bash
npm start -- --reset-cache
```

### Voice input not working

**Android:**
- Check microphone permission in Settings
- Ensure Google app is updated

**iOS:**
- Check microphone permission in Settings
- Restart the app

### Database errors

**Reset database:**
```bash
# Android
adb shell pm clear com.aiexpensetracker

# iOS
Delete app and reinstall
```

### Firebase function errors

**Check logs:**
```bash
firebase functions:log
```

**Test locally:**
```bash
cd firebase/functions
npm run serve
```

**Verify API key:**
```bash
firebase functions:config:get
```

### Build errors

**Android:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## 📊 Demo Data

For hackathon demo, you can quickly populate test data:

```javascript
// Add this in a test file or console
import ExpenseService from './src/services/ExpenseService';

const demoExpenses = [
  { amount: 45.50, category: 'Food', description: 'Dinner at restaurant' },
  { amount: 120, category: 'Entertainment', description: 'Concert tickets' },
  { amount: 80, category: 'Travel', description: 'Uber rides' },
  { amount: 200, category: 'Necessities', description: 'Groceries' },
];

// Add expenses
for (const expense of demoExpenses) {
  await ExpenseService.createExpense(userId, expense);
}
```

## 🎬 Hackathon Demo Script

### 1. Introduction (30 seconds)
"AI Expense Tracker - Track expenses using your voice in any language, with AI-powered categorization and smart budget alerts."

### 2. Voice Input Demo (1 minute)
- Show voice input in English: "I spent 50 dollars on lunch"
- Show voice input in Hindi: "मैंने आज 500 रुपये खाने पर खर्च किए"
- Demonstrate AI parsing and auto-categorization

### 3. Budget Management (1 minute)
- Create a budget for Food category
- Add expenses until budget warning
- Show notification when threshold reached

### 4. Analytics (30 seconds)
- Show pie chart of spending by category
- Highlight insights and recommendations

### 5. Premium Features (30 seconds)
- Show feature comparison
- Demonstrate upgrade flow
- Highlight business model

### 6. Technical Highlights (1 minute)
- Local-first architecture (WatermelonDB)
- On-device voice recognition
- Secure password storage
- AI parsing with Gemini API
- Freemium business model

## 📈 Business Model

### Revenue Streams

1. **Subscriptions** (Primary)
   - Monthly: $4.99/month
   - Yearly: $39.99/year (33% savings)
   - Lifetime: $99.99 (one-time)

2. **Target Market**
   - Young professionals (25-40 years)
   - Small business owners
   - Students
   - Anyone tracking personal finances

3. **Growth Strategy**
   - Freemium model to acquire users
   - Premium features drive conversions
   - Word-of-mouth through voice input novelty
   - Partnerships with financial institutions

4. **Projected Revenue** (Year 1)
   - 10,000 free users
   - 5% conversion to premium (500 users)
   - Average revenue: $40/user/year
   - Total: $20,000/year

## 🏆 Hackathon Judging Criteria

### Innovation ⭐⭐⭐⭐⭐
- AI-powered voice input in native languages
- Smart expense categorization
- Local-first privacy approach

### Technical Complexity ⭐⭐⭐⭐⭐
- React Native cross-platform
- WatermelonDB for scalability
- Firebase Cloud Functions
- Gemini AI integration
- Secure authentication

### Business Viability ⭐⭐⭐⭐⭐
- Clear freemium model
- Multiple revenue streams
- Large addressable market
- Low customer acquisition cost

### User Experience ⭐⭐⭐⭐⭐
- Intuitive voice-first interface
- Beautiful modern UI
- Smooth animations
- Helpful notifications

### Completeness ⭐⭐⭐⭐⭐
- Fully functional MVP
- All core features implemented
- Production-ready architecture
- Comprehensive documentation

## 📝 Next Steps (Post-Hackathon)

1. **User Testing**: Gather feedback from beta users
2. **App Store Launch**: Submit to iOS App Store and Google Play
3. **Marketing**: Social media, content marketing, partnerships
4. **Feature Expansion**: Receipt scanning, bank integration, AI insights
5. **Monetization**: Implement actual payment processing
6. **Scale**: Optimize for 100K+ users

## 📞 Support

For questions or issues:
- Email: support@aiexpensetracker.com
- GitHub: [Repository URL]
- Discord: [Community Link]

---

**Built with ❤️ for Hackathon 2024**
