import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';
  static associations = {
    expenses: { type: 'has_many', foreignKey: 'user_id' },
    budgets: { type: 'has_many', foreignKey: 'user_id' },
    categories: { type: 'has_many', foreignKey: 'user_id' },
    notifications: { type: 'has_many', foreignKey: 'user_id' },
  };

  @field('name') name;
  @field('email') email;
  @field('password_hash') passwordHash;
  @field('is_premium') isPremium;
  @date('premium_expires_at') premiumExpiresAt;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('expenses') expenses;
  @children('budgets') budgets;
  @children('categories') categories;
  @children('notifications') notifications;
}
