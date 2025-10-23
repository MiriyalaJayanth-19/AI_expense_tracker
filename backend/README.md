# AI Expense Tracker - Backend API

SQL database backend with Express.js and SQLite

## 🗄️ Database Schema

### Tables:

**1. users**
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email (login)
- `password` - Hashed password
- `is_premium` - Premium status (0/1)
- `created_at` - Registration date
- `last_login` - Last login timestamp

**2. expenses**
- `id` - Primary key
- `user_id` - Foreign key to users
- `amount` - Expense amount
- `category` - Expense category
- `description` - Expense description
- `currency` - INR/USD
- `date` - Expense date
- `created_at` - Record creation time

**3. budgets**
- `id` - Primary key
- `user_id` - Foreign key to users
- `monthly_limit` - Budget limit
- `currency` - INR/USD
- `created_at` - Budget set date
- `updated_at` - Last update

**4. usage_analytics**
- `id` - Primary key
- `user_id` - Foreign key to users
- `action` - Action performed
- `details` - JSON details
- `timestamp` - When action occurred

**5. sessions**
- `id` - Primary key
- `user_id` - Foreign key to users
- `token` - JWT token
- `created_at` - Session start
- `expires_at` - Session expiry

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Expenses (Requires Auth Token)

**GET** `/api/expenses`
- Headers: `Authorization: Bearer <token>`

**POST** `/api/expenses`
```json
{
  "amount": 500,
  "category": "Food",
  "description": "Lunch",
  "currency": "INR",
  "date": "2025-10-23"
}
```

**DELETE** `/api/expenses/:id`
- Headers: `Authorization: Bearer <token>`

### Budget (Requires Auth Token)

**GET** `/api/budget`
- Headers: `Authorization: Bearer <token>`

**POST** `/api/budget`
```json
{
  "monthly_limit": 5000,
  "currency": "INR"
}
```

### Analytics (Requires Auth Token)

**GET** `/api/analytics`
- Headers: `Authorization: Bearer <token>`

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Token-based sessions
- ✅ SQL injection protection
- ✅ CORS enabled
- ✅ Input validation

---

## 📊 Usage Analytics Tracked

- `user_registered` - New user signup
- `user_login` - User login
- `add_expense` - Expense added
- `delete_expense` - Expense deleted
- `view_expenses` - Expenses viewed
- `set_budget` - Budget set

---

## 🛠️ Database File

SQLite database: `expense_tracker.db`

Location: `backend/expense_tracker.db`

---

## 🔄 Connecting Frontend

Update frontend to use API:

```javascript
const API_URL = 'http://localhost:5000/api';

// Login example
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

---

## 📝 Environment Variables

Create `.env` file:

```
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

---

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Start server: `npm run dev`
3. Test with Postman or frontend
4. Database auto-creates on first run
5. Check `expense_tracker.db` file

---

**Backend is ready! Start the server and connect your frontend!** 🚀
