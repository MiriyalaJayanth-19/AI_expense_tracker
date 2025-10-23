import bcrypt from 'bcryptjs';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '../database';
import { seedDefaultCategories } from '../database/seed';

const SALT_ROUNDS = 10;
const CURRENT_USER_KEY = '@current_user_id';

class AuthService {
  /**
   * Register a new user
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} The created user
   */
  async register(name, email, password) {
    try {
      // Validate input
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const usersCollection = database.collections.get('users');
      const existingUsers = await usersCollection
        .query()
        .fetch();
      
      const userExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await database.write(async () => {
        return await usersCollection.create(newUser => {
          newUser.name = name;
          newUser.email = email.toLowerCase();
          newUser.passwordHash = passwordHash;
          newUser.isPremium = false;
          newUser.premiumExpiresAt = null;
        });
      });

      // Store credentials in Keychain
      await Keychain.setGenericPassword(email, passwordHash, {
        service: 'ai-expense-tracker',
      });

      // Seed default categories for the user
      await seedDefaultCategories(user.id);

      // Set as current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} The logged in user
   */
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find user by email
      const usersCollection = database.collections.get('users');
      const users = await usersCollection
        .query()
        .fetch();
      
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Store credentials in Keychain
      await Keychain.setGenericPassword(email, user.passwordHash, {
        service: 'ai-expense-tracker',
      });

      // Set as current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    try {
      await Keychain.resetGenericPassword({ service: 'ai-expense-tracker' });
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current logged in user
   * @returns {Promise<Object|null>} The current user or null
   */
  async getCurrentUser() {
    try {
      const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (!userId) {
        return null;
      }

      const usersCollection = database.collections.get('users');
      const user = await usersCollection.find(userId);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'ai-expense-tracker',
      });
      return !!credentials;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify biometric authentication
   * @returns {Promise<boolean>}
   */
  async verifyBiometric() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'ai-expense-tracker',
        authenticationPrompt: {
          title: 'Authenticate',
          subtitle: 'Unlock AI Expense Tracker',
        },
      });
      return !!credentials;
    } catch (error) {
      console.error('Biometric verification error:', error);
      return false;
    }
  }

  /**
   * Update user premium status
   * @param {string} userId - User ID
   * @param {boolean} isPremium - Premium status
   * @param {Date|null} expiresAt - Expiration date
   */
  async updatePremiumStatus(userId, isPremium, expiresAt = null) {
    try {
      const usersCollection = database.collections.get('users');
      const user = await usersCollection.find(userId);

      await database.write(async () => {
        await user.update(u => {
          u.isPremium = isPremium;
          u.premiumExpiresAt = expiresAt;
        });
      });

      return true;
    } catch (error) {
      console.error('Update premium status error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const usersCollection = database.collections.get('users');
      const user = await usersCollection.find(userId);

      // Verify old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password
      await database.write(async () => {
        await user.update(u => {
          u.passwordHash = newPasswordHash;
        });
      });

      // Update Keychain
      await Keychain.setGenericPassword(user.email, newPasswordHash, {
        service: 'ai-expense-tracker',
      });

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export default new AuthService();
