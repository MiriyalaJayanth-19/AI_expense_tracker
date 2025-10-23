import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import User from './models/User';
import Expense from './models/Expense';
import Budget from './models/Budget';
import Category from './models/Category';
import Notification from './models/Notification';

// Create the adapter
const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Use JSI for better performance
  onSetUpError: error => {
    console.error('Database setup error:', error);
  },
});

// Create the database
const database = new Database({
  adapter,
  modelClasses: [User, Expense, Budget, Category, Notification],
});

export default database;
