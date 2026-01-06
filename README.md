<<<<<<< HEAD
# 🎙️ AI Expense Tracker - Hackathon Project

> **Voice-Powered Expense Management with AI Intelligence**
> 
> Track expenses in 10+ languages, get smart budget alerts, and manage your finances effortlessly with voice commands.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🏆 Hackathon Highlights

### **Why This Project Stands Out:**

1. **🌍 Multi-Language Voice Recognition** - Speak in 10 Indian languages
2. **🤖 AI-Powered Smart Detection** - Auto-categorizes 100+ food items
3. **💰 Intelligent Budget Alerts** - 90% spending notifications
4. **🎨 Beautiful UI/UX** - Purple gradient theme with dark mode
5. **💳 Production-Ready Payments** - Complete premium payment flow
6. **🗄️ Enterprise Database** - MySQL with proper schema design
7. **📊 Real-Time Analytics** - Dashboard with visual insights

---

## ✨ Key Features

### 🎙️ **Voice Input (10 Languages)**
```
Speak naturally in your language:
• English: "150 rupees for sweets"
• Hindi: "सौ रुपये मिठाई के लिए"
• Tamil: "நூறு ரூபாய் சாப்பாடு"
• Telugu: "వంద రూపాయలు ఆహారం"
```

**Supported Languages:**
- 🇮🇳 English (India), Hindi, Tamil, Telugu
- 🇮🇳 Marathi, Bengali, Kannada, Malayalam, Gujarati
- 🇺🇸 English (US)

### 🤖 **AI-Powered Intelligence**
- **Smart Food Detection**: Recognizes 100+ food items
  - Pizza, burger, biryani, dosa, samosa, sweets, tea, coffee...
  - Works in multiple languages
  - Auto-categorizes as "Food"

- **Gemini AI Parsing**: Extracts amount, category, description
- **Multi-Language Support**: Understands context in any language

### 💰 **Smart Budget Management**
- **Monthly & Yearly Budgets**: Choose your tracking period
- **90% Alert System**: Get notified before overspending
- **Visual Progress**: Beautiful progress bars and charts
- **Browser Notifications**: Desktop alerts for budget limits

### 🎨 **Modern UI/UX**
- **Dual Theme**: Light & Dark mode support
- **Purple Gradient**: Beautiful, modern design
- **Responsive**: Works on all screen sizes
- **Smooth Animations**: Professional transitions

### 💳 **Premium Payment System**
- **3 Pricing Tiers**: Monthly, Quarterly, Yearly
- **Multiple Payment Methods**: Card, UPI, Net Banking
- **Real-time Validation**: Card formatting, expiry checks
- **Transaction Tracking**: Unique transaction IDs

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.2** - Modern UI library
- **CSS3** - Custom styling with gradients
- **Web Speech API** - Voice recognition
- **LocalStorage** - Client-side data persistence

### **Backend**
- **Node.js + Express** - RESTful API server
- **MySQL 8.0** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### **AI/ML**
- **Google Gemini AI** - Natural language processing
- **Custom Parser** - Multi-language expense parsing
- **Smart Categorization** - 100+ food item detection

### **DevOps**
- **Git** - Version control
- **npm** - Package management
- **dotenv** - Environment configuration

## 🏗️ System Architecture

```
┌──────────────────────────────────────────┐
│           React Frontend (Web)           │
│  • Voice Recognition (Web Speech API)   │
│  • State Management (React Hooks)       │
│  • LocalStorage for Client Data         │
└────────────┬─────────────────────────────┘
             │
             │ HTTP/REST API
             ▼
┌──────────────────────────────────────────┐
│        Node.js + Express Backend         │
│  • JWT Authentication                    │
│  • RESTful API Endpoints                │
│  • Password Hashing (bcrypt)            │
└────────────┬─────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌─────────┐   ┌──────────────┐
│  MySQL  │   │  Gemini AI   │
│Database │   │   (Google)   │
│         │   │              │
│• Users  │   │• NLP Parsing │
│• Expenses│  │• Category    │
│• Budgets│   │  Detection   │
│• Payments│  │• Multi-lang  │
└─────────┘   └──────────────┘
```

## 📦 Quick Start

### Prerequisites
```bash
✅ Node.js >= 16
✅ MySQL >= 8.0
✅ npm or yarn
✅ Modern browser (Chrome/Edge recommended)
```

### Installation Steps

**1. Clone Repository**
```bash
git clone https://github.com/yourusername/AI_expenese_Tracker.git
cd AI_expenese_Tracker
```

**2. Setup Frontend**
```bash
cd web
npm install
```

**3. Setup Backend**
```bash
cd ../backend
npm install
```

**4. Configure MySQL Database**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE expense_tracker;

# Create user (optional)
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**5. Configure Environment**
```bash
# In backend folder
cp .env.example .env

# Edit .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
JWT_SECRET=your-secret-key
```

**6. Start Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**7. Start Frontend**
```bash
cd web
npm start
# App opens on http://localhost:3000
```

**8. Access Application**
```
🌐 Frontend: http://localhost:3000
🔌 Backend API: http://localhost:5000
🗄️ Database: MySQL on localhost:3306
```

---

## 🎮 Usage Guide

### **1. Sign Up / Login**
```
1. Open http://localhost:3000
2. Click "Sign Up"
3. Enter name, email, password
4. Click "Create Account"
5. You're in! 🎉
```

### **2. Add Expense with Voice**
```
1. Click "🎙️ Voice Entry" tab
2. Select language (e.g., Hindi)
3. Click microphone button
4. Say: "सौ रुपये मिठाई"
5. AI auto-fills form
6. Click "Add Expense"
```

### **3. Set Budget**
```
1. Go to "💰 Budget" tab
2. Select period (Monthly/Yearly)
3. Enter amount (e.g., ₹5000)
4. Click "Set Budget"
5. Get alerts at 90%!
```

### **4. View Analytics**
```
1. Click "📊 Dashboard" tab
2. See spending breakdown
3. View category charts
4. Track your trends
```

### **5. Upgrade to Premium**
```
1. Click "⭐ Upgrade to Premium"
2. Choose plan (Monthly/Quarterly/Yearly)
3. Select payment method
4. Complete payment
5. Unlock all features!
```

## 💼 Business Model (Freemium)

### 🎁 **Free Tier**
```
✅ 49 expense entries
✅ Voice input (10 languages)
✅ Basic budget tracking
✅ Dashboard analytics
✅ Manual entry
✅ Dark/Light theme
```

### ⭐ **Premium Tier** (₹29/month)
```
✅ Unlimited expenses
✅ Advanced analytics
✅ Category-wise budgets
✅ Export to CSV/PDF
✅ Cloud backup & sync
✅ Priority support
✅ Ad-free experience
✅ Custom categories
✅ Recurring expenses
✅ Multi-currency
```

### 💰 **Pricing Plans**
| Plan | Price | Savings |
|------|-------|---------|
| Monthly | ₹29/month | - |
| Quarterly | ₹79/3 months | ₹8 |
| Yearly | ₹299/year | ₹49 |

### 📈 **Revenue Projections**
```
100 users × ₹29 = ₹2,900/month
1,000 users × ₹29 = ₹29,000/month
10,000 users × ₹29 = ₹2,90,000/month
```

### 🎯 **Target Market**
- Students & Young Professionals
- Small Business Owners
- Freelancers
- Indian Market (Multi-language support)

## 📊 Database Schema

### **MySQL Tables (6 Total)**

#### **1. users**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(255) NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL
is_premium      BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login      TIMESTAMP NULL
```

#### **2. expenses**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT NOT NULL (FK → users.id)
amount          DECIMAL(10,2) NOT NULL
category        VARCHAR(100) NOT NULL
description     TEXT
currency        VARCHAR(10) DEFAULT 'INR'
date            DATETIME NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### **3. budgets**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT NOT NULL (FK → users.id)
monthly_limit   DECIMAL(10,2) NOT NULL
currency        VARCHAR(10) DEFAULT 'INR'
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### **4. usage_analytics**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT NOT NULL (FK → users.id)
action          VARCHAR(100) NOT NULL
details         TEXT
timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### **5. sessions**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT NOT NULL (FK → users.id)
token           TEXT NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
expires_at      TIMESTAMP NOT NULL
```

#### **6. payments**
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT NOT NULL (FK → users.id)
transaction_id  VARCHAR(100) UNIQUE NOT NULL
plan            VARCHAR(50) NOT NULL
amount          DECIMAL(10,2) NOT NULL
currency        VARCHAR(10) DEFAULT 'INR'
payment_method  VARCHAR(50) NOT NULL
status          VARCHAR(50) DEFAULT 'completed'
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
expires_at      TIMESTAMP NULL
```

---

## 🎯 Hackathon Demo Script

### **For Judges (5-Minute Pitch)**

#### **1. Problem Statement (30 seconds)**
```
"Managing expenses is tedious. People forget to track,
struggle with language barriers, and overspend without
realizing. We need a solution that's:
• Easy to use
• Works in native languages
• Provides smart alerts"
```

#### **2. Solution Overview (1 minute)**
```
"AI Expense Tracker solves this with:
✅ Voice input in 10 Indian languages
✅ AI auto-categorization (100+ food items)
✅ Smart budget alerts at 90%
✅ Beautiful, intuitive UI"
```

#### **3. Live Demo (2 minutes)**

**Demo Flow:**
```
1. Login → Show dashboard
2. Voice Entry:
   - Switch to Hindi
   - Say: "सौ रुपये मिठाई"
   - Show auto-detection: Food category
   - Add expense

3. Budget Alert:
   - Show budget: ₹5,000
   - Show spending: ₹4,500 (90%)
   - Trigger alert notification

4. Premium Features:
   - Click upgrade
   - Show pricing tiers
   - Show payment modal
```

#### **4. Technical Highlights (1 minute)**
```
✅ React + Node.js + MySQL stack
✅ Google Gemini AI integration
✅ Multi-language NLP parsing
✅ Real-time notifications
✅ Secure JWT authentication
✅ Production-ready payment flow
```

#### **5. Business Model (30 seconds)**
```
"Freemium model:
• Free: 49 entries
• Premium: ₹29/month
• Target: 10,000 users = ₹2.9L/month
• Scalable & sustainable"
```

---

## 🏆 Competitive Advantages

### **vs. Traditional Apps**
| Feature | Our App | Competitors |
|---------|---------|-------------|
| Voice Input | ✅ 10 languages | ❌ English only |
| Food Detection | ✅ 100+ items | ❌ Manual |
| Budget Alerts | ✅ 90% threshold | ❌ 100% only |
| Pricing | ✅ ₹29/month | ❌ ₹299/month |
| UI/UX | ✅ Modern | ❌ Outdated |

### **Unique Selling Points**
1. **Multi-Language**: Only app with 10 Indian languages
2. **Smart Detection**: AI recognizes food items automatically
3. **Proactive Alerts**: Warns at 90%, not just 100%
4. **Affordable**: 10x cheaper than competitors
5. **Beautiful UI**: Modern purple gradient design

---

## 🚀 Future Roadmap

### **Phase 1 (Next 3 Months)**
- [ ] Receipt scanning with OCR
- [ ] Recurring expense automation
- [ ] Category-wise budget limits
- [ ] Export to PDF/CSV

### **Phase 2 (6 Months)**
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Family expense sharing
- [ ] AI spending insights

### **Phase 3 (1 Year)**
- [ ] Investment tracking
- [ ] Bill payment reminders
- [ ] Merchant partnerships
- [ ] B2B white-label solution

---

## 📸 Screenshots

### **Login Screen**
![Login](screenshots/login.png)

### **Voice Entry**
![Voice](screenshots/voice.png)

### **Dashboard**
![Dashboard](screenshots/dashboard.png)

### **Budget Alerts**
![Budget](screenshots/budget.png)

### **Premium Payment**
![Payment](screenshots/payment.png)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👥 Team

**Built with ❤️ for Hackathon 2025**

- **Developer**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful NLP capabilities
- **React Community** - For amazing libraries
- **MySQL** - For robust database
- **Hackathon Organizers** - For this opportunity

---

## 📞 Contact & Support

**Questions? Feedback? Want to collaborate?**

- 📧 Email: support@aiexpensetracker.com
- 🌐 Website: https://aiexpensetracker.com
- 💬 Discord: [Join our community](https://discord.gg/aiexpensetracker)
- 🐦 Twitter: [@AIExpenseTracker](https://twitter.com/aiexpensetracker)

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with 💜 for the Hackathon**

[Live Demo](https://aiexpensetracker.com) • [Documentation](https://docs.aiexpensetracker.com) • [Report Bug](https://github.com/yourusername/AI_expenese_Tracker/issues)

</div>
=======
# AI_expense_tracker
>>>>>>> 1f878bce1ae2864bde4465a4d498053000fd9d48
