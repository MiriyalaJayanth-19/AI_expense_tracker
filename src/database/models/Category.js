import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';
  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  };

  @field('name') name;
  @field('icon') icon;
  @field('color') color;
  @field('is_custom') isCustom;
  @field('user_id') userId;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('users', 'user_id') user;
}
