import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class Notification extends Model {
  static table = 'notifications';
  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  };

  @field('user_id') userId;
  @field('title') title;
  @field('message') message;
  @field('type') type;
  @field('is_read') isRead;
  @readonly @date('created_at') createdAt;

  @relation('users', 'user_id') user;
}
