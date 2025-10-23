# Changelog

All notable changes to AI Expense Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-23

### Added
- 🎙️ Voice input for expense tracking in multiple languages
- 🤖 AI-powered expense categorization using Gemini API
- 💾 Local-first data storage with WatermelonDB
- 🔐 Secure authentication with password hashing and biometric support
- 💰 Budget management with monthly/yearly tracking
- 📊 Beautiful analytics with pie charts and insights
- 🔔 Smart notifications for budget alerts
- ⭐ Freemium business model with premium features
- 🌍 Support for 50+ languages (Premium)
- 📱 Cross-platform support (iOS and Android)

### Features
- User registration and login
- Voice-to-text expense entry
- Automatic expense categorization
- Budget creation and tracking
- Spending analytics and visualizations
- Budget alerts and notifications
- Premium subscription management
- Biometric authentication
- Data export (Premium)
- Custom categories (Premium)

### Technical
- React Native 0.72.6
- WatermelonDB for local database
- Firebase Cloud Functions for AI parsing
- Google Gemini API integration
- bcrypt.js for password security
- react-native-keychain for secure storage
- react-native-voice for speech recognition
- react-native-push-notification for alerts

### Security
- Password hashing with bcrypt (10 salt rounds)
- Secure credential storage in device keychain
- Biometric authentication support
- Local-first data architecture
- No cloud storage of sensitive data

### Business Model
- Free tier: 100 expenses/month, 5 categories, 3 languages
- Premium Monthly: $4.99/month
- Premium Yearly: $39.99/year (33% savings)
- Premium Lifetime: $99.99 one-time

## [Unreleased]

### Planned Features
- Receipt scanning with OCR
- Recurring expense automation
- Multi-currency support
- Family/group expense sharing
- Bank API integration
- Wear OS / Apple Watch support
- Web dashboard
- Dark mode
- Export to CSV/PDF
- Cloud backup (optional)

### Known Issues
- None reported

---

For more details, see the [README.md](README.md) and [SETUP_GUIDE.md](SETUP_GUIDE.md).
