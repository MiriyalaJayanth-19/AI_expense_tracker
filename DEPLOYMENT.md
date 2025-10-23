# Deployment Guide - AI Expense Tracker

Complete guide for deploying the AI Expense Tracker to production.

## 📱 App Store Deployment

### iOS App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Valid provisioning profiles and certificates

#### Steps

1. **Update App Configuration**
```bash
cd ios
open AIExpenseTracker.xcworkspace
```

2. **Configure Signing**
- Select project in Xcode
- Go to "Signing & Capabilities"
- Select your team
- Update Bundle Identifier

3. **Update Version**
- In Xcode: General → Version & Build
- Or edit `ios/AIExpenseTracker/Info.plist`

4. **Archive Build**
- Product → Archive
- Wait for build to complete
- Click "Distribute App"
- Select "App Store Connect"
- Upload to App Store

5. **App Store Connect**
- Go to https://appstoreconnect.apple.com
- Create new app
- Fill in metadata:
  - App name: AI Expense Tracker
  - Category: Finance
  - Description: (Use from README)
  - Keywords: expense, budget, voice, AI
  - Screenshots: (Create 6.5" and 5.5" sizes)
  - Privacy Policy URL
  - Support URL

6. **Submit for Review**
- Add build to version
- Submit for review
- Wait 1-3 days for approval

### Android Play Store

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Studio
- Keystore for signing

#### Steps

1. **Generate Keystore**
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing**
Edit `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

Edit `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
}
```

3. **Build Release APK/AAB**
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

4. **Google Play Console**
- Go to https://play.google.com/console
- Create new app
- Fill in metadata:
  - App name: AI Expense Tracker
  - Category: Finance
  - Description: (Use from README)
  - Screenshots: (Multiple device sizes)
  - Feature graphic
  - Privacy Policy URL

5. **Upload AAB**
- Production → Create new release
- Upload app-release.aab
- Add release notes
- Review and rollout

6. **Submit for Review**
- Complete content rating questionnaire
- Set pricing (Free with in-app purchases)
- Submit for review
- Wait 1-3 days for approval

## ☁️ Firebase Deployment

### Initial Setup

1. **Create Firebase Project**
```bash
firebase login
firebase init
# Select: Functions, Hosting (optional)
# Select: JavaScript
# Install dependencies: Yes
```

2. **Configure Environment**
```bash
cd firebase/functions
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

3. **Deploy Functions**
```bash
firebase deploy --only functions
```

4. **Get Function URL**
After deployment, note the URL:
```
https://us-central1-your-project-id.cloudfunctions.net/parseExpense
```

### Update Mobile App

1. **Set Environment Variable**
Create `.env` file:
```
FIREBASE_FUNCTION_URL=https://your-function-url/parseExpense
```

2. **Or Initialize in Code**
```javascript
import AIParsingService from './src/services/AIParsingService';
AIParsingService.initialize('YOUR_FUNCTION_URL');
```

### Monitoring

1. **Firebase Console**
- Go to https://console.firebase.google.com
- Select your project
- Functions → Logs
- Monitor usage and errors

2. **Set Up Alerts**
- Cloud Functions → Metrics
- Create alert policies
- Set up email notifications

## 🔐 Security Checklist

### Before Production

- [ ] Remove all console.log statements
- [ ] Enable ProGuard (Android)
- [ ] Enable code obfuscation
- [ ] Update API keys to production
- [ ] Restrict Firebase function CORS
- [ ] Add rate limiting to functions
- [ ] Enable Firebase App Check
- [ ] Review all permissions
- [ ] Test on real devices
- [ ] Security audit of code

### API Keys

**Never commit:**
- `.env` file
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)
- Firebase config
- Keystore files

**Use:**
- Environment variables
- Firebase Remote Config
- Secure key management services

## 📊 Analytics Setup

### Firebase Analytics

1. **Add Firebase SDK**
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

2. **Track Events**
```javascript
import analytics from '@react-native-firebase/analytics';

// Track expense added
await analytics().logEvent('expense_added', {
  category: 'Food',
  amount: 50,
  method: 'voice',
});

// Track premium purchase
await analytics().logEvent('purchase', {
  value: 4.99,
  currency: 'USD',
  plan: 'monthly',
});
```

### Google Analytics

1. **Create GA4 Property**
- Go to https://analytics.google.com
- Create new property
- Link to Firebase

2. **Track Key Metrics**
- User acquisition
- Engagement rate
- Conversion rate
- Revenue

## 💰 In-App Purchases Setup

### iOS (StoreKit)

1. **App Store Connect**
- Go to In-App Purchases
- Create subscriptions:
  - Monthly: $4.99
  - Yearly: $39.99
  - Lifetime: $99.99

2. **Add react-native-iap**
```bash
npm install react-native-iap
cd ios && pod install
```

3. **Implement Purchases**
```javascript
import * as RNIap from 'react-native-iap';

const productIds = [
  'com.aiexpensetracker.monthly',
  'com.aiexpensetracker.yearly',
  'com.aiexpensetracker.lifetime',
];

// Purchase flow
const purchase = await RNIap.requestPurchase(productId);
```

### Android (Google Play Billing)

1. **Play Console**
- Go to Monetization → Products
- Create subscriptions
- Set pricing

2. **Implement Purchases**
```javascript
// Same react-native-iap library
const purchase = await RNIap.requestPurchase(productId);
```

## 🚀 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build Android
        run: cd android && ./gradlew bundleRelease
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.SERVICE_ACCOUNT_JSON }}
          packageName: com.aiexpensetracker
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: production

  deploy-firebase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 📈 Post-Launch Monitoring

### Key Metrics to Track

1. **User Metrics**
   - Daily Active Users (DAU)
   - Monthly Active Users (MAU)
   - Retention rate (Day 1, 7, 30)
   - Session length

2. **Business Metrics**
   - Free to Premium conversion
   - Monthly Recurring Revenue (MRR)
   - Customer Lifetime Value (LTV)
   - Churn rate

3. **Technical Metrics**
   - Crash rate
   - API response time
   - Voice recognition accuracy
   - AI parsing success rate

### Tools

- **Firebase Analytics**: User behavior
- **Crashlytics**: Crash reporting
- **Sentry**: Error tracking
- **Mixpanel**: Product analytics
- **App Store Connect**: iOS metrics
- **Play Console**: Android metrics

## 🔄 Update Strategy

### Versioning

Use Semantic Versioning (SemVer):
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features
- **Patch** (1.1.1): Bug fixes

### Release Cycle

1. **Weekly Patches**: Bug fixes
2. **Monthly Minor**: New features
3. **Quarterly Major**: Major updates

### Over-the-Air Updates

Use CodePush for non-native updates:
```bash
npm install -g code-push-cli
code-push release-react AIExpenseTracker-iOS ios
code-push release-react AIExpenseTracker-Android android
```

## 🆘 Rollback Plan

### If Critical Bug Found

1. **Immediate Actions**
   - Pause rollout in app stores
   - Revert to previous version
   - Notify users via in-app message

2. **Fix and Redeploy**
   - Fix bug in hotfix branch
   - Test thoroughly
   - Deploy patch version
   - Resume rollout

3. **Communication**
   - Update app store description
   - Post on social media
   - Email affected users

## 📞 Support Setup

### Support Channels

1. **Email**: support@aiexpensetracker.com
2. **In-App**: Help & Support section
3. **Social Media**: Twitter, Facebook
4. **Community**: Discord server

### Response Time Goals

- Critical bugs: < 4 hours
- General issues: < 24 hours
- Feature requests: < 7 days

## ✅ Pre-Launch Checklist

- [ ] All features tested on real devices
- [ ] App store listings complete
- [ ] Screenshots and videos ready
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email set up
- [ ] Firebase functions deployed
- [ ] Analytics configured
- [ ] Crash reporting enabled
- [ ] In-app purchases configured
- [ ] Beta testing completed
- [ ] Security audit passed
- [ ] Performance optimized
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Marketing materials ready

## 🎉 Launch Day

1. **Morning**
   - Final smoke tests
   - Monitor error rates
   - Check server capacity

2. **Launch**
   - Submit to app stores
   - Announce on social media
   - Post on Product Hunt
   - Email beta testers

3. **Evening**
   - Monitor analytics
   - Respond to feedback
   - Fix critical issues

4. **Week 1**
   - Daily monitoring
   - Gather user feedback
   - Plan first update

---

**Good luck with your launch! 🚀**
