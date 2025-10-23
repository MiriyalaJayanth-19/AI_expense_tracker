import { Q } from '@nozbe/watermelondb';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import database from '../database';
import ExpenseService from './ExpenseService';
import NotificationService from './NotificationService';

class BudgetService {
  /**
   * Create a new budget
   * @param {string} userId - User ID
   * @param {Object} budgetData - Budget data
   * @returns {Promise<Object>} Created budget
   */
  async createBudget(userId, budgetData) {
    try {
      const { category, limitAmount, period, notificationThreshold } = budgetData;

      if (!limitAmount || limitAmount <= 0) {
        throw new Error('Limit amount must be greater than 0');
      }

      if (!period || !['monthly', 'yearly'].includes(period)) {
        throw new Error('Period must be either monthly or yearly');
      }

      // Check if budget already exists for this category and period
      const existingBudget = await this.getBudgetByCategory(userId, category, period);
      if (existingBudget) {
        throw new Error(`Budget already exists for ${category} (${period})`);
      }

      const budgetsCollection = database.collections.get('budgets');

      const budget = await database.write(async () => {
        return await budgetsCollection.create(newBudget => {
          newBudget.userId = userId;
          newBudget.category = category;
          newBudget.limitAmount = limitAmount;
          newBudget.period = period;
          newBudget.startDate = new Date();
          newBudget.notificationThreshold = notificationThreshold || 80;
          newBudget.isActive = true;
        });
      });

      console.log('Budget created:', budget.id);
      return budget;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  }

  /**
   * Get all budgets for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of budgets
   */
  async getBudgets(userId) {
    try {
      const budgetsCollection = database.collections.get('budgets');
      const budgets = await budgetsCollection
        .query(Q.where('user_id', userId), Q.where('is_active', true))
        .fetch();

      return budgets;
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  }

  /**
   * Get budget by category
   * @param {string} userId - User ID
   * @param {string} category - Category name
   * @param {string} period - Period (monthly/yearly)
   * @returns {Promise<Object|null>} Budget or null
   */
  async getBudgetByCategory(userId, category, period) {
    try {
      const budgetsCollection = database.collections.get('budgets');
      const budgets = await budgetsCollection
        .query(
          Q.where('user_id', userId),
          Q.where('category', category),
          Q.where('period', period),
          Q.where('is_active', true)
        )
        .fetch();

      return budgets.length > 0 ? budgets[0] : null;
    } catch (error) {
      console.error('Get budget by category error:', error);
      throw error;
    }
  }

  /**
   * Update a budget
   * @param {string} budgetId - Budget ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated budget
   */
  async updateBudget(budgetId, updates) {
    try {
      const budgetsCollection = database.collections.get('budgets');
      const budget = await budgetsCollection.find(budgetId);

      const updatedBudget = await database.write(async () => {
        return await budget.update(b => {
          if (updates.limitAmount !== undefined) b.limitAmount = updates.limitAmount;
          if (updates.notificationThreshold !== undefined) {
            b.notificationThreshold = updates.notificationThreshold;
          }
          if (updates.isActive !== undefined) b.isActive = updates.isActive;
        });
      });

      return updatedBudget;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  }

  /**
   * Delete a budget
   * @param {string} budgetId - Budget ID
   */
  async deleteBudget(budgetId) {
    try {
      const budgetsCollection = database.collections.get('budgets');
      const budget = await budgetsCollection.find(budgetId);

      await database.write(async () => {
        await budget.update(b => {
          b.isActive = false;
        });
      });

      console.log('Budget deleted:', budgetId);
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }

  /**
   * Get budget status (current spending vs limit)
   * @param {string} userId - User ID
   * @param {string} budgetId - Budget ID
   * @returns {Promise<Object>} Budget status
   */
  async getBudgetStatus(userId, budgetId) {
    try {
      const budgetsCollection = database.collections.get('budgets');
      const budget = await budgetsCollection.find(budgetId);

      // Calculate period dates
      const now = new Date();
      let startDate, endDate;

      if (budget.period === 'monthly') {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      } else {
        startDate = startOfYear(now);
        endDate = endOfYear(now);
      }

      // Get expenses for this category and period
      const expenses = await ExpenseService.getExpensesByPeriod(userId, startDate, endDate);
      const categoryExpenses = expenses.filter(exp => exp.category === budget.category);
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      const remaining = budget.limitAmount - spent;
      const percentage = (spent / budget.limitAmount) * 100;
      const isOverBudget = spent > budget.limitAmount;
      const shouldNotify = percentage >= budget.notificationThreshold;

      return {
        budget,
        spent,
        remaining,
        percentage,
        isOverBudget,
        shouldNotify,
        expenseCount: categoryExpenses.length,
      };
    } catch (error) {
      console.error('Get budget status error:', error);
      throw error;
    }
  }

  /**
   * Get all budget statuses for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of budget statuses
   */
  async getAllBudgetStatuses(userId) {
    try {
      const budgets = await this.getBudgets(userId);
      const statuses = await Promise.all(
        budgets.map(budget => this.getBudgetStatus(userId, budget.id))
      );

      return statuses;
    } catch (error) {
      console.error('Get all budget statuses error:', error);
      throw error;
    }
  }

  /**
   * Check budgets and send notifications if needed
   * @param {string} userId - User ID
   */
  async checkBudgetsAndNotify(userId) {
    try {
      const statuses = await this.getAllBudgetStatuses(userId);

      for (const status of statuses) {
        if (status.isOverBudget) {
          await NotificationService.createNotification(userId, {
            title: '🚨 Budget Exceeded!',
            message: `You've exceeded your ${status.budget.category} budget by ${Math.abs(status.remaining).toFixed(2)}`,
            type: 'budget_exceeded',
          });
        } else if (status.shouldNotify && status.percentage >= status.budget.notificationThreshold) {
          await NotificationService.createNotification(userId, {
            title: '⚠️ Budget Warning',
            message: `You've used ${status.percentage.toFixed(0)}% of your ${status.budget.category} budget`,
            type: 'budget_warning',
          });
        }
      }
    } catch (error) {
      console.error('Check budgets and notify error:', error);
    }
  }

  /**
   * Get budget recommendations based on spending patterns
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Recommendations
   */
  async getBudgetRecommendations(userId) {
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const categoryTotals = await ExpenseService.getSpendingByCategory(
        userId,
        monthStart,
        monthEnd
      );

      const recommendations = [];

      for (const [category, spent] of Object.entries(categoryTotals)) {
        const budget = await this.getBudgetByCategory(userId, category, 'monthly');

        if (!budget) {
          // Suggest creating a budget with 20% buffer
          const suggestedLimit = Math.ceil(spent * 1.2);
          recommendations.push({
            category,
            type: 'create',
            message: `Consider setting a monthly budget of ${suggestedLimit} for ${category}`,
            suggestedLimit,
          });
        } else {
          const status = await this.getBudgetStatus(userId, budget.id);
          
          if (status.isOverBudget) {
            const suggestedLimit = Math.ceil(spent * 1.1);
            recommendations.push({
              category,
              type: 'increase',
              message: `Your ${category} budget might be too low. Consider increasing to ${suggestedLimit}`,
              suggestedLimit,
            });
          }
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Get budget recommendations error:', error);
      throw error;
    }
  }
}

export default new BudgetService();
