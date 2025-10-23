import React, { useState, useEffect } from 'react';
import './BudgetSettings.css';

function BudgetSettings({ expenses, isPremium, onUpgrade }) {
  const [budgetLimit, setBudgetLimit] = useState('');
  const [savedLimit, setSavedLimit] = useState(null);
  const [currency, setCurrency] = useState('INR');
  const [budgetPeriod, setBudgetPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  const [showNotification, setShowNotification] = useState(false);

  // Load saved budget from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('budgetSettings');
    if (saved) {
      const budget = JSON.parse(saved);
      setSavedLimit(budget.limit);
      setCurrency(budget.currency);
      setBudgetPeriod(budget.period || 'monthly');
    }
  }, []);

  // Calculate current period spending (monthly or yearly)
  const getCurrentPeriodTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        if (budgetPeriod === 'monthly') {
          return expDate.getMonth() === currentMonth && 
                 expDate.getFullYear() === currentYear &&
                 (exp.currency || 'INR') === currency;
        } else {
          // Yearly
          return expDate.getFullYear() === currentYear &&
                 (exp.currency || 'INR') === currency;
        }
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const currentSpending = getCurrentPeriodTotal();
  const percentage = savedLimit ? (currentSpending / savedLimit) * 100 : 0;
  const remaining = savedLimit ? savedLimit - currentSpending : 0;

  // Check if notification should be shown (90% threshold)
  useEffect(() => {
    if (savedLimit && percentage >= 90 && percentage < 100) {
      setShowNotification(true);
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Budget Alert! ⚠️', {
          body: `You've spent ${percentage.toFixed(1)}% of your ${budgetPeriod} budget!`,
          icon: '💰'
        });
      }
    } else if (percentage >= 100) {
      setShowNotification(true);
      if (Notification.permission === 'granted') {
        new Notification('Budget Exceeded! 🚨', {
          body: `You've exceeded your ${budgetPeriod} budget by ${currency === 'INR' ? '₹' : '$'}${Math.abs(remaining).toFixed(2)}`,
          icon: '🚨'
        });
      }
    }
  }, [savedLimit, percentage, remaining, currency, budgetPeriod]);

  const handleSaveBudget = () => {
    if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    const budget = {
      limit: parseFloat(budgetLimit),
      currency: currency,
      period: budgetPeriod
    };

    localStorage.setItem('budgetSettings', JSON.stringify(budget));
    setSavedLimit(budget.limit);
    setBudgetLimit('');
    alert(`${budgetPeriod.charAt(0).toUpperCase() + budgetPeriod.slice(1)} budget saved successfully!`);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleClearBudget = () => {
    localStorage.removeItem('budgetSettings');
    setSavedLimit(null);
    setBudgetLimit('');
    setShowNotification(false);
  };

  return (
    <div className="budget-settings">
      <div className="budget-header">
        <h2>💰 {budgetPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Budget</h2>
        {!isPremium && (
          <button className="premium-badge" onClick={onUpgrade}>
            ⭐ Upgrade to Premium
          </button>
        )}
      </div>

      {showNotification && savedLimit && (
        <div className={`budget-alert ${percentage >= 100 ? 'danger' : 'warning'}`}>
          <div className="alert-icon">{percentage >= 100 ? '🚨' : '⚠️'}</div>
          <div className="alert-content">
            <strong>
              {percentage >= 100 ? 'Budget Exceeded!' : 'Budget Alert!'}
            </strong>
            <p>
              {percentage >= 100 
                ? `You've exceeded your ${budgetPeriod} budget by ${currency === 'INR' ? '₹' : '$'}${Math.abs(remaining).toFixed(2)}`
                : `You've used ${percentage.toFixed(1)}% of your ${budgetPeriod} budget`
              }
            </p>
          </div>
          <button className="alert-close" onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}

      {savedLimit && (
        <div className="budget-overview">
          <div className="budget-stats">
            <div className="budget-stat">
              <div className="stat-label">Budget Limit</div>
              <div className="stat-amount">
                {currency === 'INR' ? '₹' : '$'}{savedLimit.toFixed(2)}
              </div>
            </div>
            <div className="budget-stat">
              <div className="stat-label">Spent This {budgetPeriod === 'monthly' ? 'Month' : 'Year'}</div>
              <div className="stat-amount spent">
                {currency === 'INR' ? '₹' : '$'}{currentSpending.toFixed(2)}
              </div>
            </div>
            <div className="budget-stat">
              <div className="stat-label">Remaining</div>
              <div className={`stat-amount ${remaining < 0 ? 'negative' : 'positive'}`}>
                {currency === 'INR' ? '₹' : '$'}{remaining.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="budget-progress">
            <div className="progress-header">
              <span>Budget Usage</span>
              <span className="progress-percentage">{percentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${percentage >= 100 ? 'exceeded' : percentage >= 95 ? 'warning' : 'normal'}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          <button className="clear-budget-btn" onClick={handleClearBudget}>
            Clear Budget
          </button>
        </div>
      )}

      <div className="budget-form">
        <h3>{savedLimit ? `Update ${budgetPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Budget` : 'Set Budget'}</h3>
        
        {!isPremium && (
          <div className="freemium-notice">
            <p>🎁 <strong>Free Plan:</strong> Basic budget tracking</p>
            <p>⭐ <strong>Premium:</strong> Advanced analytics, category-wise budgets, and more!</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Budget Period</label>
            <select value={budgetPeriod} onChange={(e) => setBudgetPeriod(e.target.value)}>
              <option value="monthly">📅 Monthly</option>
              <option value="yearly">📆 Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR">₹ Indian Rupee (INR)</option>
              <option value="USD">$ US Dollar (USD)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>{budgetPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Limit</label>
          <div className="amount-input">
            <span className="currency-symbol">{currency === 'INR' ? '₹' : '$'}</span>
            <input
              type="number"
              step="100"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              placeholder={budgetPeriod === 'monthly' ? '5000' : '60000'}
            />
          </div>
        </div>

        <button className="save-budget-btn" onClick={handleSaveBudget}>
          {savedLimit ? 'Update Budget' : 'Set Budget'}
        </button>
      </div>

      {isPremium && (
        <div className="premium-features">
          <h3>🌟 Premium Features Active</h3>
          <ul>
            <li>✅ Unlimited budget tracking</li>
            <li>✅ Category-wise budget limits</li>
            <li>✅ Advanced spending insights</li>
            <li>✅ Export data to CSV/PDF</li>
            <li>✅ Priority support</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default BudgetSettings;
