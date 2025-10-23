import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen({ navigation }) {
  const renderSettingItem = (icon, title, subtitle, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#6366F1" style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        {renderSettingItem(
          'language-outline',
          'Language',
          'English (US)',
          () => Alert.alert('Coming Soon', 'Language settings will be available soon')
        )}
        {renderSettingItem(
          'moon-outline',
          'Dark Mode',
          'Coming soon',
          () => Alert.alert('Coming Soon', 'Dark mode will be available soon')
        )}
        {renderSettingItem(
          'cash-outline',
          'Currency',
          'USD ($)',
          () => Alert.alert('Coming Soon', 'Currency settings will be available soon')
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderSettingItem(
          'notifications-outline',
          'Push Notifications',
          'Enabled',
          () => Alert.alert('Coming Soon', 'Notification settings will be available soon')
        )}
        {renderSettingItem(
          'alarm-outline',
          'Budget Alerts',
          'Notify at 80%',
          () => Alert.alert('Coming Soon', 'Alert settings will be available soon')
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        {renderSettingItem(
          'cloud-upload-outline',
          'Cloud Backup',
          'Premium feature',
          () => navigation.navigate('Premium')
        )}
        {renderSettingItem(
          'download-outline',
          'Export Data',
          'Download your data',
          () => Alert.alert('Coming Soon', 'Export feature will be available soon')
        )}
        {renderSettingItem(
          'trash-outline',
          'Clear All Data',
          'Delete all expenses',
          () => {
            Alert.alert(
              'Clear All Data',
              'This will permanently delete all your expenses. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
                },
              ]
            );
          }
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem(
          'information-circle-outline',
          'Version',
          '1.0.0',
          () => Alert.alert('AI Expense Tracker', 'Version 1.0.0\nBuilt for Hackathon 2024')
        )}
        {renderSettingItem(
          'document-text-outline',
          'Terms of Service',
          null,
          () => Alert.alert('Coming Soon', 'Terms of Service will be available soon')
        )}
        {renderSettingItem(
          'shield-checkmark-outline',
          'Privacy Policy',
          null,
          () => Alert.alert('Coming Soon', 'Privacy Policy will be available soon')
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
