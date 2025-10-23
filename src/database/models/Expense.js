import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class Expense extends Model {
  static table = 'expenses';
  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  };

  @field('user_id') userId;
  @field('amount') amount;
  @field('category') category;
  @field('description') description;
  @date('date') date;
  @field('voice_text') voiceText;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('users', 'user_id') user;
}
