import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import AuthService from '../../services/AuthService';
import PremiumService from '../../services/PremiumService';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const status = PremiumService.getPremiumStatus(currentUser);
        setPremiumStatus(status);
      }
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              // Navigation will be handled by App.js auth state
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = (icon, title, subtitle, onPress, color = '#111827') => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
          </View>
        </View>

        {premiumStatus?.isPremium ? (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Premium')}
          >
            <Icon name="star-outline" size={16} color="#6366F1" />
            <Text style={styles.upgradeText}>Upgrade</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Premium Status */}
        {premiumStatus?.isPremium && (
          <View style={styles.section}>
            <View style={styles.premiumCard}>
              <Icon name="star" size={32} color="#FFD700" />
              <View style={styles.premiumCardContent}>
                <Text style={styles.premiumCardTitle}>Premium Member</Text>
                <Text style={styles.premiumCardText}>
                  {premiumStatus.isLifetime
                    ? 'Lifetime access'
                    : `Expires in ${premiumStatus.daysRemaining} days`}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderMenuItem(
            'person-outline',
            'Edit Profile',
            'Update your personal information',
            () => Alert.alert('Coming Soon', 'This feature is under development'),
            '#6366F1'
          )}
          {renderMenuItem(
            'lock-closed-outline',
            'Change Password',
            'Update your password',
            () => Alert.alert('Coming Soon', 'This feature is under development'),
            '#10B981'
          )}
          {renderMenuItem(
            'notifications-outline',
            'Notifications',
            'Manage notification preferences',
            () => Alert.alert('Coming Soon', 'This feature is under development'),
            '#F59E0B'
          )}
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          {renderMenuItem(
            'settings-outline',
            'Settings',
            'App preferences and configuration',
            () => navigation.navigate('Settings'),
            '#8B5CF6'
          )}
          {renderMenuItem(
            'language-outline',
            'Language',
            'Change app language',
            () => Alert.alert('Coming Soon', 'This feature is under development'),
            '#EC4899'
          )}
          {renderMenuItem(
            'download-outline',
            'Export Data',
            premiumStatus?.isPremium ? 'Download your data' : 'Premium feature',
            () => {
              if (premiumStatus?.isPremium) {
                Alert.alert('Coming Soon', 'Export feature is under development');
              } else {
                navigation.navigate('Premium');
              }
            },
            '#14B8A6'
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderMenuItem(
            'help-circle-outline',
            'Help & Support',
            'Get help with the app',
            () => Alert.alert('Support', 'Contact us at support@aiexpensetracker.com'),
            '#06B6D4'
          )}
          {renderMenuItem(
            'document-text-outline',
            'Privacy Policy',
            'Read our privacy policy',
            () => Alert.alert('Coming Soon', 'This feature is under development'),
            '#64748B'
          )}
          {renderMenuItem(
            'information-circle-outline',
            'About',
            'Version 1.0.0',
            () => Alert.alert('AI Expense Tracker', 'Version 1.0.0\nBuilt for Hackathon 2024'),
            '#64748B'
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  email: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  premiumCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  premiumCardText: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});
