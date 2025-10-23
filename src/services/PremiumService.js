import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './AuthService';

const PREMIUM_FEATURES_KEY = '@premium_features';

// Free tier limits
const FREE_LIMITS = {
  maxExpensesPerMonth: 100,
  maxCategories: 5,
  maxLanguages: 3,
  canExportData: false,
  canUseCloudBackup: false,
  hasAdvancedAnalytics: false,
  hasCustomCategories: false,
  hasYearlyBudgets: false,
};

// Premium tier features
const PREMIUM_FEATURES = {
  maxExpensesPerMonth: Infinity,
  maxCategories: Infinity,
  maxLanguages: Infinity,
  canExportData: true,
  canUseCloudBackup: true,
  hasAdvancedAnalytics: true,
  hasCustomCategories: true,
  hasYearlyBudgets: true,
};

// Pricing
const PRICING = {
  monthly: {
    price: 4.99,
    currency: 'USD',
    period: 'month',
  },
  yearly: {
    price: 39.99,
    currency: 'USD',
    period: 'year',
    savings: '33%',
  },
  lifetime: {
    price: 99.99,
    currency: 'USD',
    period: 'lifetime',
  },
};

class PremiumService {
  /**
   * Check if user has premium access
   * @param {Object} user - User object
   * @returns {boolean}
   */
  isPremium(user) {
    if (!user) return false;

    if (!user.isPremium) return false;

    // Check if premium has expired
    if (user.premiumExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(user.premiumExpiresAt);
      return now < expiresAt;
    }

    // Lifetime premium (no expiration date)
    return true;
  }

  /**
   * Get features available to user
   * @param {Object} user - User object
   * @returns {Object} Available features
   */
  getFeatures(user) {
    return this.isPremium(user) ? PREMIUM_FEATURES : FREE_LIMITS;
  }

  /**
   * Check if user can access a specific feature
   * @param {Object} user - User object
   * @param {string} feature - Feature name
   * @returns {boolean}
   */
  canAccessFeature(user, feature) {
    const features = this.getFeatures(user);
    return features[feature] === true || features[feature] === Infinity;
  }

  /**
   * Get pricing information
   * @returns {Object} Pricing details
   */
  getPricing() {
    return PRICING;
  }

  /**
   * Simulate premium purchase (for hackathon demo)
   * In production, integrate with App Store/Play Store
   * @param {string} userId - User ID
   * @param {string} plan - Plan type (monthly, yearly, lifetime)
   * @returns {Promise<boolean>} Success status
   */
  async purchasePremium(userId, plan) {
    try {
      if (!['monthly', 'yearly', 'lifetime'].includes(plan)) {
        throw new Error('Invalid plan type');
      }

      let expiresAt = null;

      if (plan === 'monthly') {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (plan === 'yearly') {
        expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }
      // lifetime has no expiration

      await AuthService.updatePremiumStatus(userId, true, expiresAt);

      // Store purchase info
      await AsyncStorage.setItem(
        PREMIUM_FEATURES_KEY,
        JSON.stringify({
          plan,
          purchasedAt: new Date().toISOString(),
          expiresAt: expiresAt ? expiresAt.toISOString() : null,
        })
      );

      console.log(`Premium ${plan} plan activated for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Purchase premium error:', error);
      throw error;
    }
  }

  /**
   * Cancel premium subscription
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async cancelPremium(userId) {
    try {
      await AuthService.updatePremiumStatus(userId, false, null);
      await AsyncStorage.removeItem(PREMIUM_FEATURES_KEY);

      console.log(`Premium cancelled for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Cancel premium error:', error);
      throw error;
    }
  }

  /**
   * Get premium status details
   * @param {Object} user - User object
   * @returns {Object} Premium status
   */
  getPremiumStatus(user) {
    const isPremium = this.isPremium(user);
    const features = this.getFeatures(user);

    let daysRemaining = null;
    if (isPremium && user.premiumExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(user.premiumExpiresAt);
      daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    }

    return {
      isPremium,
      features,
      expiresAt: user.premiumExpiresAt,
      daysRemaining,
      isLifetime: isPremium && !user.premiumExpiresAt,
    };
  }

  /**
   * Get feature comparison for upgrade screen
   * @returns {Array} Feature comparison list
   */
  getFeatureComparison() {
    return [
      {
        feature: 'Monthly Expenses',
        free: '100 expenses',
        premium: 'Unlimited',
        icon: 'receipt',
      },
      {
        feature: 'Categories',
        free: '5 default',
        premium: 'Unlimited custom',
        icon: 'folder',
      },
      {
        feature: 'Voice Languages',
        free: '3 languages',
        premium: '50+ languages',
        icon: 'language',
      },
      {
        feature: 'Budget Tracking',
        free: 'Monthly only',
        premium: 'Monthly + Yearly',
        icon: 'trending-up',
      },
      {
        feature: 'Analytics',
        free: 'Basic',
        premium: 'Advanced insights',
        icon: 'analytics',
      },
      {
        feature: 'Data Export',
        free: '✗',
        premium: 'CSV, PDF',
        icon: 'download',
      },
      {
        feature: 'Cloud Backup',
        free: '✗',
        premium: '✓ Optional',
        icon: 'cloud',
      },
      {
        feature: 'Ads',
        free: 'Yes',
        premium: 'Ad-free',
        icon: 'close-circle',
      },
    ];
  }

  /**
   * Check usage against limits
   * @param {Object} user - User object
   * @param {number} currentUsage - Current usage count
   * @param {string} limitType - Type of limit to check
   * @returns {Object} Usage status
   */
  checkUsageLimit(user, currentUsage, limitType) {
    const features = this.getFeatures(user);
    const limit = features[limitType];

    if (limit === Infinity) {
      return {
        canProceed: true,
        isNearLimit: false,
        remaining: Infinity,
        percentage: 0,
      };
    }

    const remaining = limit - currentUsage;
    const percentage = (currentUsage / limit) * 100;
    const canProceed = currentUsage < limit;
    const isNearLimit = percentage >= 80;

    return {
      canProceed,
      isNearLimit,
      remaining,
      percentage,
      limit,
    };
  }
}

export default new PremiumService();
