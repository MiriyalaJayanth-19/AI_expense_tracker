# Privacy Policy - AI Expense Tracker

**Last Updated: October 23, 2024**

## Introduction

AI Expense Tracker ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.

## Information We Collect

### Information You Provide
- **Account Information**: Name, email address, and encrypted password
- **Expense Data**: Amount, category, description, date, and voice input text
- **Budget Information**: Budget limits, categories, and notification preferences

### Automatically Collected Information
- **Device Information**: Device type, operating system, app version
- **Usage Data**: Features used, session duration, crash reports
- **Voice Data**: Temporary audio recordings for speech-to-text conversion (processed on-device)

## How We Use Your Information

### Local Storage
- All your expense and budget data is stored **locally on your device**
- We do NOT store your financial data on our servers
- Your data never leaves your device unless you explicitly use cloud features (Premium)

### AI Processing
- Voice input text is sent to our secure Firebase Cloud Function for AI parsing
- The text is processed using Google's Gemini API to extract expense information
- We do NOT store voice recordings or transcripts on our servers
- Processing is done in real-time and data is immediately discarded

### Analytics
- We collect anonymous usage statistics to improve the app
- Analytics data is aggregated and cannot identify individual users
- You can opt-out of analytics in app settings

## Data Security

### Encryption
- Passwords are hashed using bcrypt with 10 salt rounds
- Credentials are stored in device's secure keychain/keystore
- All data transmission uses HTTPS encryption

### Biometric Authentication
- Biometric data (fingerprint, Face ID) never leaves your device
- We only receive authentication success/failure status
- Biometric data is managed by your device's operating system

### Local Database
- All expense data is stored in an encrypted SQLite database
- Database is only accessible by the app
- Data is automatically deleted when you uninstall the app

## Data Sharing

We do NOT sell, trade, or rent your personal information to third parties.

### Third-Party Services
- **Google Gemini API**: Processes voice input text for expense parsing (text only, no storage)
- **Firebase**: Hosts our cloud function (no data storage)
- **Analytics Services**: Anonymous usage statistics only

### Legal Requirements
We may disclose your information if required by law or to:
- Comply with legal obligations
- Protect our rights and property
- Prevent fraud or security issues
- Protect user safety

## Your Rights

### Access and Control
- View all your data within the app
- Edit or delete any expense or budget
- Export your data (Premium feature)
- Delete your account and all associated data

### Data Portability
- Premium users can export data in CSV or PDF format
- Data export includes all expenses, budgets, and categories

### Account Deletion
- You can delete your account at any time
- All data is permanently deleted from your device
- Cloud backups (if enabled) are also deleted

## Children's Privacy

Our app is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us.

## Changes to Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by:
- Posting the new Privacy Policy in the app
- Updating the "Last Updated" date
- Sending an in-app notification for significant changes

## Contact Us

If you have questions about this Privacy Policy, please contact us:

- **Email**: privacy@aiexpensetracker.com
- **Website**: https://aiexpensetracker.com/privacy
- **Address**: [Your Business Address]

## Consent

By using AI Expense Tracker, you consent to this Privacy Policy and agree to its terms.

---

## Data Processing Details

### Voice Input Processing
1. You speak into the microphone
2. Device converts speech to text (on-device)
3. Text is sent to our Firebase Cloud Function
4. Gemini API processes the text to extract expense details
5. Structured data is returned to your device
6. Text is immediately discarded (not stored)

### Data Storage Locations
- **Your Device**: All expense, budget, and user data
- **Firebase**: Cloud Function code only (no data storage)
- **Google Cloud**: Temporary processing of voice text (not stored)

### Data Retention
- **Local Data**: Stored until you delete it or uninstall the app
- **Cloud Processing**: Data is processed in real-time and immediately discarded
- **Analytics**: Anonymous data retained for 14 months

## GDPR Compliance (EU Users)

If you are in the European Union, you have additional rights under GDPR:

### Right to Access
Request a copy of your personal data

### Right to Rectification
Correct inaccurate personal data

### Right to Erasure
Request deletion of your personal data

### Right to Restrict Processing
Limit how we use your data

### Right to Data Portability
Receive your data in a machine-readable format

### Right to Object
Object to processing of your personal data

To exercise these rights, contact us at gdpr@aiexpensetracker.com

## CCPA Compliance (California Users)

If you are a California resident, you have rights under CCPA:

### Right to Know
What personal information we collect and how it's used

### Right to Delete
Request deletion of your personal information

### Right to Opt-Out
Opt-out of sale of personal information (Note: We do not sell personal information)

### Right to Non-Discrimination
Equal service regardless of privacy rights exercise

To exercise these rights, contact us at ccpa@aiexpensetracker.com

---

**This Privacy Policy is effective as of October 23, 2024.**
