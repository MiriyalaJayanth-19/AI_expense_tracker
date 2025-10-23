import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import './ExpenseList.css';

const CATEGORY_EMOJIS = {
  Food: '🍔',
  Entertainment: '🎬',
  Travel: '✈️',
  Necessities: '🛒',
  Loans: '💰',
  Healthcare: '🏥',
  Education: '📚',
  Utilities: '💡',
  Other: '📦',
};

function ExpenseList({ expenses, onDelete, onUpdate }) {
  // Group by currency
  const totals = expenses.reduce((acc, exp) => {
    const curr = exp.currency || 'USD';
    acc[curr] = (acc[curr] || 0) + exp.amount;
    return acc;
  }, {});

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <h2>📭 No expenses yet</h2>
        <p>Start by adding your first expense using voice or manual entry!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="list-header">
        <h2>💸 Your Expenses</h2>
        <div className="total-badges">
          {Object.entries(totals).map(([curr, amount]) => (
            <div key={curr} className="total-badge">
              {curr === 'INR' ? '₹' : '$'}{amount.toFixed(2)} {curr}
            </div>
          ))}
        </div>
      </div>

      <div className="expenses-grid">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <span className="category-emoji">
                {CATEGORY_EMOJIS[expense.category] || '📦'}
              </span>
              <span className="category-name">{expense.category}</span>
              <button 
                className="delete-btn"
                onClick={() => onDelete(expense.id)}
                title="Delete expense"
              >
                🗑️
              </button>
            </div>
            
            <div className="expense-amount">
              {expense.currency === 'INR' ? '₹' : '$'}{expense.amount.toFixed(2)}
              <span className="currency-code">{expense.currency || 'USD'}</span>
            </div>
            
            <div className="expense-description">
              {expense.description}
            </div>
            
            <div className="expense-datetime">
              <div className="expense-date">
                📅 {format(new Date(expense.date), 'MMM dd, yyyy')}
              </div>
              <div className="expense-time">
                🕐 {format(new Date(expense.date), 'hh:mm a')}
              </div>
              <div className="expense-relative">
                {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
