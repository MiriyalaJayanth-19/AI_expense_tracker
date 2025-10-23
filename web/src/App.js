import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import BudgetSettings from './components/BudgetSettings';
import PremiumPayment from './components/PremiumPayment';

function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('add'); // 'add', 'list', 'dashboard', 'budget'
  const [isPremium, setIsPremium] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  // Load expenses from localStorage
  useEffect(() => {
    if (user) {
      const userExpenses = localStorage.getItem(`expenses_${user.email}`);
      if (userExpenses) {
        setExpenses(JSON.parse(userExpenses));
      }
    }
  }, [user]);

  // Save expenses to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`expenses_${user.email}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsPremium(userData.isPremium || false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setExpenses([]);
    setIsPremium(false);
  };

  // Load premium status
  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremium');
    if (premiumStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  const handleUpgrade = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumUpgrade = () => {
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    setShowPremiumModal(false);
    
    // Update user premium status
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const addExpense = (expense) => {
    // Check free tier limit (49 entries)
    if (!isPremium && expenses.length >= 49) {
      const upgrade = window.confirm(
        '🚫 Free Tier Limit Reached!\n\n' +
        'You\'ve used all 49 free entries.\n\n' +
        'Upgrade to Premium for:\n' +
        '✅ Unlimited entries\n' +
        '✅ Advanced analytics\n' +
        '✅ Category budgets\n' +
        '✅ Export data\n\n' +
        'Upgrade now for just ₹29/month?'
      );
      
      if (upgrade) {
        handleUpgrade();
      }
      return;
    }

    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, ...updatedExpense } : exp
    ));
  };

  // Show auth screen if not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`App ${theme}`}>
      <header className="app-header">
        <div className="header-top">
          <div className="user-info">
            <span>👤 {user.name}</span>
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
        <div className="header-content">
          <div>
            <h1>🎙️ AI Expense Tracker</h1>
            <p>Voice-powered expense management</p>
          </div>
          {!isPremium && (
            <div className={`entry-counter ${
              expenses.length >= 45 ? 'danger' : 
              expenses.length >= 40 ? 'warning' : ''
            }`}>
              <div className="counter-label">Free Entries</div>
              <div className="counter-value">
                {expenses.length} / 49
              </div>
              <div className="counter-remaining">
                {expenses.length >= 45 ? '⚠️ ' : ''}
                {49 - expenses.length} remaining
                {expenses.length >= 45 ? ' - Upgrade!' : ''}
              </div>
            </div>
          )}
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={view === 'add' ? 'active' : ''} 
          onClick={() => setView('add')}
        >
          ➕ Add Expense
        </button>
        <button 
          className={view === 'list' ? 'active' : ''} 
          onClick={() => setView('list')}
        >
          📋 Expenses
        </button>
        <button 
          className={view === 'dashboard' ? 'active' : ''} 
          onClick={() => setView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={view === 'budget' ? 'active' : ''} 
          onClick={() => setView('budget')}
        >
          💰 Budget {!isPremium && '⭐'}
        </button>
      </nav>

      <main className="app-content">
        {view === 'add' && (
          <ExpenseForm onAddExpense={addExpense} />
        )}
        {view === 'list' && (
          <ExpenseList 
            expenses={expenses} 
            onDelete={deleteExpense}
            onUpdate={updateExpense}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard expenses={expenses} />
        )}
        {view === 'budget' && (
          <BudgetSettings 
            expenses={expenses} 
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
          />
        )}
      </main>

      {isPremium && (
        <div className="premium-indicator">
          ⭐ Premium Active
        </div>
      )}

      {showPremiumModal && (
        <PremiumPayment 
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handlePremiumUpgrade}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default App;
