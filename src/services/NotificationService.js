import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import database from '../database';

class NotificationService {
  constructor() {
    this.configured = false;
  }

  /**
   * Configure push notifications
   */
  configure() {
    if (this.configured) return;

    PushNotification.configure({
      onRegister: function (token) {
        console.log('Notification token:', token);
      },

      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'budget-alerts',
          channelName: 'Budget Alerts',
          channelDescription: 'Notifications for budget warnings and exceeded limits',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`Channel created: ${created}`)
      );
    }

    this.configured = true;
  }

  /**
   * Request notification permissions
   * @returns {Promise<boolean>}
   */
  async requestPermissions() {
    return new Promise((resolve, reject) => {
      PushNotification.checkPermissions(permissions => {
        if (permissions.alert) {
          resolve(true);
        } else {
          PushNotification.requestPermissions()
            .then(() => resolve(true))
            .catch(() => resolve(false));
        }
      });
    });
  }

  /**
   * Send a local notification
   * @param {Object} notification - Notification data
   */
  sendLocalNotification(notification) {
    const { title, message, data } = notification;

    PushNotification.localNotification({
      channelId: 'budget-alerts',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: data || {},
    });
  }

  /**
   * Schedule a notification
   * @param {Object} notification - Notification data
   * @param {Date} date - When to send the notification
   */
  scheduleNotification(notification, date) {
    const { title, message, data } = notification;

    PushNotification.localNotificationSchedule({
      channelId: 'budget-alerts',
      title,
      message,
      date,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: data || {},
    });
  }

  /**
   * Cancel all notifications
   */
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Create a notification record in database
   * @param {string} userId - User ID
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(userId, notificationData) {
    try {
      const { title, message, type } = notificationData;

      const notificationsCollection = database.collections.get('notifications');

      const notification = await database.write(async () => {
        return await notificationsCollection.create(newNotification => {
          newNotification.userId = userId;
          newNotification.title = title;
          newNotification.message = message;
          newNotification.type = type;
          newNotification.isRead = false;
        });
      });

      // Send local notification
      this.sendLocalNotification({
        title,
        message,
        data: { notificationId: notification.id, type },
      });

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of notifications
   */
  async getNotifications(userId) {
    try {
      const notificationsCollection = database.collections.get('notifications');
      const notifications = await notificationsCollection
        .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
        .fetch();

      return notifications;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markAsRead(notificationId) {
    try {
      const notificationsCollection = database.collections.get('notifications');
      const notification = await notificationsCollection.find(notificationId);

      await database.write(async () => {
        await notification.update(n => {
          n.isRead = true;
        });
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @param {string} userId - User ID
   */
  async markAllAsRead(userId) {
    try {
      const notifications = await this.getNotifications(userId);
      const unreadNotifications = notifications.filter(n => !n.isRead);

      await database.write(async () => {
        const promises = unreadNotifications.map(n =>
          n.update(notification => {
            notification.isRead = true;
          })
        );
        await Promise.all(promises);
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   */
  async deleteNotification(notificationId) {
    try {
      const notificationsCollection = database.collections.get('notifications');
      const notification = await notificationsCollection.find(notificationId);

      await database.write(async () => {
        await notification.markAsDeleted();
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
}

export default new NotificationService();
