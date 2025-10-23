require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeDatabase, dbHelpers } = require('./database-mysql');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await dbHelpers.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbHelpers.insert(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Log usage
    await dbHelpers.logUsage(result.id, 'user_registered');

    // Create token
    const token = jwt.sign({ id: result.id, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.id, name, email, isPremium: false }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await dbHelpers.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await dbHelpers.update('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Log usage
    await dbHelpers.logUsage(user.id, 'user_login');

    // Create token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.is_premium === 1
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== EXPENSE ROUTES =====

// Get all expenses for user
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await dbHelpers.all(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
      [req.user.id]
    );

    await dbHelpers.logUsage(req.user.id, 'view_expenses');

    res.json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add expense
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { amount, category, description, currency, date } = req.body;

    const result = await dbHelpers.insert(
      'INSERT INTO expenses (user_id, amount, category, description, currency, date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, amount, category, description, currency || 'INR', date]
    );

    await dbHelpers.logUsage(req.user.id, 'add_expense', JSON.stringify({ amount, category }));

    res.status(201).json({
      message: 'Expense added',
      id: result.id
    });
  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    await dbHelpers.delete(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    await dbHelpers.logUsage(req.user.id, 'delete_expense');

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== BUDGET ROUTES =====

// Get budget
app.get('/api/budget', authenticateToken, async (req, res) => {
  try {
    const budget = await dbHelpers.get(
      'SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    res.json(budget || null);
  } catch (err) {
    console.error('Get budget error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set budget
app.post('/api/budget', authenticateToken, async (req, res) => {
  try {
    const { monthly_limit, currency } = req.body;

    const result = await dbHelpers.insert(
      'INSERT INTO budgets (user_id, monthly_limit, currency) VALUES (?, ?, ?)',
      [req.user.id, monthly_limit, currency || 'INR']
    );

    await dbHelpers.logUsage(req.user.id, 'set_budget', JSON.stringify({ monthly_limit }));

    res.status(201).json({
      message: 'Budget set',
      id: result.id
    });
  } catch (err) {
    console.error('Set budget error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== ANALYTICS ROUTES =====

// Get usage analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const analytics = await dbHelpers.all(
      'SELECT action, COUNT(*) as count FROM usage_analytics WHERE user_id = ? GROUP BY action',
      [req.user.id]
    );

    res.json(analytics);
  } catch (err) {
    console.error('Get analytics error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 MySQL database connected`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
