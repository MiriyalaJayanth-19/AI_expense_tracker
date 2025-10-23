import React from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Dashboard.css';

const COLORS = {
  Food: '#FF6384',
  Entertainment: '#36A2EB',
  Travel: '#FFCE56',
  Necessities: '#4BC0C0',
  Loans: '#9966FF',
  Healthcare: '#FF9F40',
  Education: '#FF6384',
  Utilities: '#C9CBCF',
  Other: '#4BC0C0',
};

function Dashboard({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <h2>📊 No data to display</h2>
        <p>Add some expenses to see your spending analytics!</p>
      </div>
    );
  }

  // Calculate totals by currency
  const currencyTotals = expenses.reduce((acc, exp) => {
    const curr = exp.currency || 'INR';
    acc[curr] = (acc[curr] || 0) + exp.amount;
    return acc;
  }, {});

  // Primary currency (most used)
  const primaryCurrency = Object.keys(currencyTotals).reduce((a, b) => 
    currencyTotals[a] > currencyTotals[b] ? a : b, 'INR'
  );
  
  const totalAmount = currencyTotals[primaryCurrency] || 0;

  // Group by category
  const categoryData = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Get current month expenses
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthlyExpenses = expenses.filter(exp => 
    isWithinInterval(new Date(exp.date), { start: monthStart, end: monthEnd })
  );
  
  const monthlyTotals = monthlyExpenses.reduce((acc, exp) => {
    const curr = exp.currency || 'INR';
    acc[curr] = (acc[curr] || 0) + exp.amount;
    return acc;
  }, {});
  
  const monthlyTotal = monthlyTotals[primaryCurrency] || 0;

  // Recent expenses (last 7 days by category)
  const last7Days = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const daysDiff = (now - expDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    })
    .reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.amount;
      return acc;
    }, {});

  const barData = Object.entries(last7Days).map(([category, amount]) => ({
    category,
    amount: parseFloat(amount.toFixed(2)),
  }));

  return (
    <div className="dashboard">
      <h2>📊 Spending Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">
              {primaryCurrency === 'INR' ? '₹' : '$'}{totalAmount.toFixed(2)}
            </div>
            <div className="stat-sublabel">{primaryCurrency}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">This Month</div>
            <div className="stat-value">
              {primaryCurrency === 'INR' ? '₹' : '$'}{monthlyTotal.toFixed(2)}
            </div>
            <div className="stat-sublabel">{primaryCurrency}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{Object.keys(categoryData).length}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>💸 Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#999'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${primaryCurrency === 'INR' ? '₹' : '$'}${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>📈 Last 7 Days by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${primaryCurrency === 'INR' ? '₹' : '$'}${value.toFixed(2)}`} />
              <Bar dataKey="amount" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="category-breakdown">
        <h3>📋 Category Breakdown</h3>
        <div className="breakdown-list">
          {Object.entries(categoryData)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
              const percentage = (amount / totalAmount * 100).toFixed(1);
              return (
                <div key={category} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-category">{category}</span>
                    <span className="breakdown-amount">
                      {primaryCurrency === 'INR' ? '₹' : '$'}{amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS[category] || '#999'
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage">{percentage}%</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
