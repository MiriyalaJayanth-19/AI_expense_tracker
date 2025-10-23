import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class Budget extends Model {
  static table = 'budgets';
  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  };

  @field('user_id') userId;
  @field('category') category;
  @field('limit_amount') limitAmount;
  @field('period') period;
  @date('start_date') startDate;
  @field('notification_threshold') notificationThreshold;
  @field('is_active') isActive;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('users', 'user_id') user;
}
