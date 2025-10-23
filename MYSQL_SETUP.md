# 🗄️ MySQL Database Setup Guide

## 📋 Prerequisites

1. **MySQL Server** installed on your system
2. **Node.js** (v14 or higher)
3. **npm** or **yarn**

---

## 🚀 Quick Setup

### Step 1: Install MySQL

**Windows:**
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Or use Chocolatey:
choco install mysql
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Step 2: Secure MySQL Installation

```bash
mysql_secure_installation
```

Follow prompts to:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### Step 3: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE expense_tracker;

# Create user (optional but recommended)
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### Step 4: Configure Backend

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Edit .env file:**
```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-this

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
```

### Step 5: Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ Connected to MySQL database
✅ Users table ready
✅ Expenses table ready
✅ Budgets table ready
✅ Analytics table ready
✅ Sessions table ready
✅ Payments table ready
🚀 Server running on http://localhost:5000
📊 MySQL database connected
```

---

## 📊 Database Schema

### Tables Created Automatically:

#### 1. **users**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);
```

#### 2. **expenses**
```sql
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  currency VARCHAR(10) DEFAULT 'INR',
  date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. **budgets**
```sql
CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  monthly_limit DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 4. **usage_analytics**
```sql
CREATE TABLE usage_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 5. **sessions**
```sql
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 6. **payments**
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔧 Troubleshooting

### Issue: "Access denied for user"
```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Issue: "Can't connect to MySQL server"
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list           # Mac
net start MySQL              # Windows

# Start MySQL if not running
sudo systemctl start mysql   # Linux
brew services start mysql    # Mac
net start MySQL              # Windows
```

### Issue: "Database doesn't exist"
```bash
# The app will create it automatically
# Or create manually:
mysql -u root -p
CREATE DATABASE expense_tracker;
```

### Issue: "Table doesn't exist"
```bash
# Tables are created automatically on first run
# If needed, restart the server
npm run dev
```

---

## 🧪 Testing Database

### Using MySQL Command Line:

```bash
# Login
mysql -u root -p expense_tracker

# View tables
SHOW TABLES;

# View users
SELECT * FROM users;

# View expenses
SELECT * FROM expenses;

# View analytics
SELECT action, COUNT(*) as count 
FROM usage_analytics 
GROUP BY action;

# Exit
EXIT;
```

### Using MySQL Workbench:

1. Download: https://dev.mysql.com/downloads/workbench/
2. Connect to localhost
3. Browse tables visually
4. Run queries

---

## 🔐 Clear Premium Status

### Method 1: Using Web Interface

1. Open browser: `http://localhost:3000/clear-premium.html`
2. Click "Clear Premium Status"
3. Refresh main app

### Method 2: Using MySQL

```sql
-- Login to MySQL
mysql -u root -p expense_tracker

-- Clear premium status for all users
UPDATE users SET is_premium = FALSE;

-- Clear premium for specific user
UPDATE users SET is_premium = FALSE WHERE email = 'user@example.com';

-- Delete all payments
DELETE FROM payments;
```

### Method 3: Using localStorage (Frontend)

```javascript
// Open browser console (F12)
localStorage.removeItem('isPremium');
localStorage.removeItem('premiumPayment');
location.reload();
```

---

## 📈 Database Maintenance

### Backup Database:

```bash
# Full backup
mysqldump -u root -p expense_tracker > backup.sql

# Backup with timestamp
mysqldump -u root -p expense_tracker > backup_$(date +%Y%m%d).sql
```

### Restore Database:

```bash
mysql -u root -p expense_tracker < backup.sql
```

### View Database Size:

```sql
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'expense_tracker'
ORDER BY (data_length + index_length) DESC;
```

---

## 🎯 API Endpoints

All endpoints use: `http://localhost:5000/api`

### Authentication:
- `POST /auth/register` - Sign up
- `POST /auth/login` - Login

### Expenses:
- `GET /expenses` - Get all expenses
- `POST /expenses` - Add expense
- `DELETE /expenses/:id` - Delete expense

### Budget:
- `GET /budget` - Get budget
- `POST /budget` - Set budget

### Analytics:
- `GET /analytics` - Get usage stats

---

## 🔄 Migration from SQLite

If you were using SQLite before:

```bash
# Export from SQLite
sqlite3 expense_tracker.db .dump > sqlite_dump.sql

# Convert and import to MySQL
# (Manual conversion needed for syntax differences)
```

---

## 🚀 Production Deployment

### Using Cloud MySQL:

**AWS RDS:**
```env
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

**Google Cloud SQL:**
```env
DB_HOST=/cloudsql/project:region:instance
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

**Azure MySQL:**
```env
DB_HOST=your-server.mysql.database.azure.com
DB_USER=admin@your-server
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

---

## ✅ Verification Checklist

- [ ] MySQL installed and running
- [ ] Database created
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] Server starts without errors
- [ ] All 6 tables created
- [ ] Can register new user
- [ ] Can login
- [ ] Can add expenses
- [ ] Can set budget

---

**Your MySQL database is ready!** 🎉

**Backend API**: http://localhost:5000
**Frontend App**: http://localhost:3000
**Clear Premium**: http://localhost:3000/clear-premium.html
