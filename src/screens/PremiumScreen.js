import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthService from '../services/AuthService';
import PremiumService from '../services/PremiumService';

export default function PremiumScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const pricing = PremiumService.getPricing();
  const features = PremiumService.getFeatureComparison();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const handlePurchase = async () => {
    Alert.alert(
      'Confirm Purchase',
      `Upgrade to Premium ${selectedPlan}?\n\nPrice: $${pricing[selectedPlan].price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            try {
              await PremiumService.purchasePremium(user.id, selectedPlan);
              Alert.alert(
                'Success! 🎉',
                'You are now a Premium member! Enjoy unlimited features.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to process purchase');
            }
          },
        },
      ]
    );
  };

  const renderFeatureRow = (feature) => (
    <View key={feature.feature} style={styles.featureRow}>
      <View style={styles.featureInfo}>
        <Icon name={feature.icon} size={20} color="#6366F1" style={styles.featureIcon} />
        <Text style={styles.featureName}>{feature.feature}</Text>
      </View>
      <View style={styles.featureValues}>
        <Text style={styles.freeValue}>{feature.free}</Text>
        <Text style={styles.premiumValue}>{feature.premium}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Icon name="star" size={64} color="#FFD700" />
        <Text style={styles.heroTitle}>Upgrade to Premium</Text>
        <Text style={styles.heroSubtitle}>
          Unlock unlimited features and take control of your finances
        </Text>
      </View>

      {/* Pricing Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        {/* Monthly Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === 'monthly' && styles.planCardActive,
          ]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planPrice}>${pricing.monthly.price}/month</Text>
            </View>
            {selectedPlan === 'monthly' && (
              <Icon name="checkmark-circle" size={24} color="#6366F1" />
            )}
          </View>
        </TouchableOpacity>

        {/* Yearly Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === 'yearly' && styles.planCardActive,
          ]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Save {pricing.yearly.savings}</Text>
          </View>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Yearly</Text>
              <Text style={styles.planPrice}>${pricing.yearly.price}/year</Text>
              <Text style={styles.planSubtext}>
                ${(pricing.yearly.price / 12).toFixed(2)}/month
              </Text>
            </View>
            {selectedPlan === 'yearly' && (
              <Icon name="checkmark-circle" size={24} color="#6366F1" />
            )}
          </View>
        </TouchableOpacity>

        {/* Lifetime Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === 'lifetime' && styles.planCardActive,
          ]}
          onPress={() => setSelectedPlan('lifetime')}
        >
          <View style={[styles.planBadge, { backgroundColor: '#FFD700' }]}>
            <Text style={[styles.planBadgeText, { color: '#111827' }]}>Best Value</Text>
          </View>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Lifetime</Text>
              <Text style={styles.planPrice}>${pricing.lifetime.price}</Text>
              <Text style={styles.planSubtext}>One-time payment</Text>
            </View>
            {selectedPlan === 'lifetime' && (
              <Icon name="checkmark-circle" size={24} color="#6366F1" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Feature Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        <View style={styles.comparisonTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Feature</Text>
            <View style={styles.tableHeaderValues}>
              <Text style={styles.tableHeaderLabel}>Free</Text>
              <Text style={[styles.tableHeaderLabel, styles.premiumLabel]}>Premium</Text>
            </View>
          </View>
          {features.map(renderFeatureRow)}
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Benefits</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Unlimited expense tracking</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Custom categories</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>50+ voice languages</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Advanced analytics & insights</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Export data (CSV, PDF)</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Priority support</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Ad-free experience</Text>
          </View>
        </View>
      </View>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>
            Upgrade to Premium - ${pricing[selectedPlan].price}
          </Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Cancel anytime. No hidden fees.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginTop: 4,
  },
  planSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  comparisonTable: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  tableHeaderValues: {
    flexDirection: 'row',
    width: 160,
  },
  tableHeaderLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    width: 80,
    textAlign: 'center',
  },
  premiumLabel: {
    color: '#6366F1',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureName: {
    fontSize: 14,
    color: '#111827',
  },
  featureValues: {
    flexDirection: 'row',
    width: 160,
  },
  freeValue: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
    textAlign: 'center',
  },
  premiumValue: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
  },
  benefitsList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  purchaseButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
});
