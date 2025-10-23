# Contributing to AI Expense Tracker

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/AI_expenese_Tracker.git
   cd AI_expenese_Tracker
   ```
3. **Install dependencies**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Style

### JavaScript/React Native

- Use ES6+ syntax
- Follow Airbnb style guide
- Use functional components with hooks
- Use meaningful variable names
- Add comments for complex logic

### File Organization

```
src/
├── database/          # Database models and schema
├── services/          # Business logic services
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   └── main/         # Main app screens
├── components/        # Reusable components
└── utils/            # Utility functions
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Write Tests
- Unit tests for services
- Integration tests for database
- Component tests for screens

## 🔧 Development Workflow

1. **Make changes**
2. **Test locally**
   ```bash
   npm run android  # or npm run ios
   ```
3. **Commit with meaningful message**
   ```bash
   git commit -m "feat: add expense filtering by date"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request**

## 📋 Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

## 🐛 Reporting Bugs

Create an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Device/OS information

## 💡 Feature Requests

Create an issue with:
- Clear description
- Use case
- Proposed solution
- Mockups if applicable

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
