import database from './index';

// Default categories for all users
export const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { name: 'Entertainment', icon: 'movie', color: '#4ECDC4' },
  { name: 'Travel', icon: 'airplane', color: '#45B7D1' },
  { name: 'Necessities', icon: 'shopping-cart', color: '#96CEB4' },
  { name: 'Loans', icon: 'credit-card', color: '#FFEAA7' },
  { name: 'Healthcare', icon: 'medical', color: '#DFE6E9' },
  { name: 'Education', icon: 'school', color: '#74B9FF' },
  { name: 'Utilities', icon: 'flash', color: '#FD79A8' },
  { name: 'Other', icon: 'ellipsis-horizontal', color: '#A29BFE' },
];

/**
 * Seeds default categories for a user
 * @param {string} userId - The user ID to seed categories for
 */
export async function seedDefaultCategories(userId) {
  try {
    const categoriesCollection = database.collections.get('categories');
    
    await database.write(async () => {
      const promises = DEFAULT_CATEGORIES.map(cat =>
        categoriesCollection.create(category => {
          category.name = cat.name;
          category.icon = cat.icon;
          category.color = cat.color;
          category.isCustom = false;
          category.userId = userId;
        })
      );
      
      await Promise.all(promises);
    });
    
    console.log('Default categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

/**
 * Creates a default monthly budget for a category
 * @param {string} userId - The user ID
 * @param {string} category - The category name
 * @param {number} limitAmount - The budget limit
 */
export async function createDefaultBudget(userId, category, limitAmount) {
  try {
    const budgetsCollection = database.collections.get('budgets');
    
    await database.write(async () => {
      await budgetsCollection.create(budget => {
        budget.userId = userId;
        budget.category = category;
        budget.limitAmount = limitAmount;
        budget.period = 'monthly';
        budget.startDate = new Date();
        budget.notificationThreshold = 80; // Notify at 80%
        budget.isActive = true;
      });
    });
    
    console.log(`Budget created for ${category}`);
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
}
