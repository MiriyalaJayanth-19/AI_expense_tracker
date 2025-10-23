import { Q } from '@nozbe/watermelondb';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import database from '../database';

class ExpenseService {
  /**
   * Create a new expense
   * @param {string} userId - User ID
   * @param {Object} expenseData - Expense data
   * @returns {Promise<Object>} Created expense
   */
  async createExpense(userId, expenseData) {
    try {
      const { amount, category, description, date, voiceText } = expenseData;

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!category) {
        throw new Error('Category is required');
      }

      const expensesCollection = database.collections.get('expenses');

      const expense = await database.write(async () => {
        return await expensesCollection.create(newExpense => {
          newExpense.userId = userId;
          newExpense.amount = amount;
          newExpense.category = category;
          newExpense.description = description || '';
          newExpense.date = date || new Date();
          newExpense.voiceText = voiceText || null;
        });
      });

      console.log('Expense created:', expense.id);
      return expense;
    } catch (error) {
      console.error('Create expense error:', error);
      throw error;
    }
  }

  /**
   * Get all expenses for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of expenses
   */
  async getExpenses(userId) {
    try {
      const expensesCollection = database.collections.get('expenses');
      const expenses = await expensesCollection
        .query(Q.where('user_id', userId), Q.sortBy('date', Q.desc))
        .fetch();

      return expenses;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  }

  /**
   * Get expenses for a specific period
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} List of expenses
   */
  async getExpensesByPeriod(userId, startDate, endDate) {
    try {
      const expensesCollection = database.collections.get('expenses');
      const expenses = await expensesCollection
        .query(
          Q.where('user_id', userId),
          Q.where('date', Q.gte(startDate.getTime())),
          Q.where('date', Q.lte(endDate.getTime())),
          Q.sortBy('date', Q.desc)
        )
        .fetch();

      return expenses;
    } catch (error) {
      console.error('Get expenses by period error:', error);
      throw error;
    }
  }

  /**
   * Get expenses for current month
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of expenses
   */
  async getMonthlyExpenses(userId) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return this.getExpensesByPeriod(userId, start, end);
  }

  /**
   * Get expenses for current year
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of expenses
   */
  async getYearlyExpenses(userId) {
    const now = new Date();
    const start = startOfYear(now);
    const end = endOfYear(now);
    return this.getExpensesByPeriod(userId, start, end);
  }

  /**
   * Get expenses by category
   * @param {string} userId - User ID
   * @param {string} category - Category name
   * @returns {Promise<Array>} List of expenses
   */
  async getExpensesByCategory(userId, category) {
    try {
      const expensesCollection = database.collections.get('expenses');
      const expenses = await expensesCollection
        .query(
          Q.where('user_id', userId),
          Q.where('category', category),
          Q.sortBy('date', Q.desc)
        )
        .fetch();

      return expenses;
    } catch (error) {
      console.error('Get expenses by category error:', error);
      throw error;
    }
  }

  /**
   * Update an expense
   * @param {string} expenseId - Expense ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated expense
   */
  async updateExpense(expenseId, updates) {
    try {
      const expensesCollection = database.collections.get('expenses');
      const expense = await expensesCollection.find(expenseId);

      const updatedExpense = await database.write(async () => {
        return await expense.update(exp => {
          if (updates.amount !== undefined) exp.amount = updates.amount;
          if (updates.category !== undefined) exp.category = updates.category;
          if (updates.description !== undefined) exp.description = updates.description;
          if (updates.date !== undefined) exp.date = updates.date;
        });
      });

      return updatedExpense;
    } catch (error) {
      console.error('Update expense error:', error);
      throw error;
    }
  }

  /**
   * Delete an expense
   * @param {string} expenseId - Expense ID
   */
  async deleteExpense(expenseId) {
    try {
      const expensesCollection = database.collections.get('expenses');
      const expense = await expensesCollection.find(expenseId);

      await database.write(async () => {
        await expense.markAsDeleted();
      });

      console.log('Expense deleted:', expenseId);
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }

  /**
   * Get total spending for a period
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total amount
   */
  async getTotalSpending(userId, startDate, endDate) {
    try {
      const expenses = await this.getExpensesByPeriod(userId, startDate, endDate);
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    } catch (error) {
      console.error('Get total spending error:', error);
      throw error;
    }
  }

  /**
   * Get spending by category for a period
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Category-wise spending
   */
  async getSpendingByCategory(userId, startDate, endDate) {
    try {
      const expenses = await this.getExpensesByPeriod(userId, startDate, endDate);
      
      const categoryTotals = {};
      expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
      });

      return categoryTotals;
    } catch (error) {
      console.error('Get spending by category error:', error);
      throw error;
    }
  }

  /**
   * Get expense statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(userId) {
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      const [monthlyExpenses, yearlyExpenses, allExpenses] = await Promise.all([
        this.getExpensesByPeriod(userId, monthStart, monthEnd),
        this.getExpensesByPeriod(userId, yearStart, yearEnd),
        this.getExpenses(userId),
      ]);

      const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const yearlyTotal = yearlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const allTimeTotal = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      const monthlyCategoryTotals = await this.getSpendingByCategory(userId, monthStart, monthEnd);

      return {
        monthlyTotal,
        yearlyTotal,
        allTimeTotal,
        monthlyExpenseCount: monthlyExpenses.length,
        yearlyExpenseCount: yearlyExpenses.length,
        allTimeExpenseCount: allExpenses.length,
        monthlyCategoryTotals,
        topCategory: Object.keys(monthlyCategoryTotals).reduce((a, b) => 
          monthlyCategoryTotals[a] > monthlyCategoryTotals[b] ? a : b, 'None'
        ),
      };
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }

  /**
   * Search expenses
   * @param {string} userId - User ID
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching expenses
   */
  async searchExpenses(userId, query) {
    try {
      const expenses = await this.getExpenses(userId);
      const lowerQuery = query.toLowerCase();

      return expenses.filter(expense => 
        expense.description.toLowerCase().includes(lowerQuery) ||
        expense.category.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Search expenses error:', error);
      throw error;
    }
  }
}

export default new ExpenseService();
