import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthService from '../../services/AuthService';
import BudgetService from '../../services/BudgetService';
import { DEFAULT_CATEGORIES } from '../../database/seed';

export default function BudgetsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [budgetStatuses, setBudgetStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    limitAmount: '',
    period: 'monthly',
    notificationThreshold: '80',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const statuses = await BudgetService.getAllBudgetStatuses(currentUser.id);
        setBudgetStatuses(statuses);
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudget.limitAmount || parseFloat(newBudget.limitAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await BudgetService.createBudget(user.id, {
        category: newBudget.category,
        limitAmount: parseFloat(newBudget.limitAmount),
        period: newBudget.period,
        notificationThreshold: parseFloat(newBudget.notificationThreshold),
      });

      setShowAddModal(false);
      setNewBudget({
        category: 'Food',
        limitAmount: '',
        period: 'monthly',
        notificationThreshold: '80',
      });
      loadData();
      Alert.alert('Success', 'Budget created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create budget');
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await BudgetService.deleteBudget(budgetId);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget');
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category) => {
    const cat = DEFAULT_CATEGORIES.find(c => c.name === category);
    return cat ? cat.color : '#A29BFE';
  };

  const getStatusColor = (status) => {
    if (status.isOverBudget) return '#EF4444';
    if (status.percentage >= 80) return '#F59E0B';
    return '#10B981';
  };

  const renderBudgetItem = ({ item }) => {
    const statusColor = getStatusColor(item);
    const categoryColor = getCategoryColor(item.budget.category);

    return (
      <TouchableOpacity
        style={styles.budgetCard}
        onPress={() => navigation.navigate('BudgetDetail', { budgetId: item.budget.id })}
        onLongPress={() => handleDeleteBudget(item.budget.id)}
      >
        <View style={styles.budgetHeader}>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetCategory}>{item.budget.category}</Text>
            <Text style={styles.budgetPeriod}>{item.budget.period}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.percentage.toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.budgetFooter}>
          <View>
            <Text style={styles.amountLabel}>Spent</Text>
            <Text style={styles.amountValue}>${item.spent.toFixed(2)}</Text>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.amountLabel}>Budget</Text>
            <Text style={styles.amountValue}>${item.budget.limitAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.amountLabel}>Remaining</Text>
            <Text style={[styles.amountValue, { color: statusColor }]}>
              ${Math.abs(item.remaining).toFixed(2)}
            </Text>
          </View>
        </View>

        {item.isOverBudget && (
          <View style={styles.warningBanner}>
            <Icon name="warning" size={16} color="#EF4444" />
            <Text style={styles.warningText}>Budget exceeded!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Budget List */}
      <FlatList
        data={budgetStatuses}
        renderItem={renderBudgetItem}
        keyExtractor={item => item.budget.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="wallet-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No budgets yet</Text>
            <Text style={styles.emptySubtext}>
              Set budgets to track your spending limits
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyButtonText}>Create Budget</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Budget Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Budget</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Category Selection */}
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {DEFAULT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.name}
                    style={[
                      styles.categoryChip,
                      newBudget.category === cat.name && {
                        backgroundColor: cat.color + '20',
                        borderColor: cat.color,
                      },
                    ]}
                    onPress={() => setNewBudget({ ...newBudget, category: cat.name })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        newBudget.category === cat.name && { color: cat.color },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Amount Input */}
              <Text style={styles.inputLabel}>Budget Limit</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={newBudget.limitAmount}
                  onChangeText={(text) => setNewBudget({ ...newBudget, limitAmount: text })}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>

              {/* Period Selection */}
              <Text style={styles.inputLabel}>Period</Text>
              <View style={styles.periodContainer}>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    newBudget.period === 'monthly' && styles.periodButtonActive,
                  ]}
                  onPress={() => setNewBudget({ ...newBudget, period: 'monthly' })}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      newBudget.period === 'monthly' && styles.periodButtonTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    newBudget.period === 'yearly' && styles.periodButtonActive,
                  ]}
                  onPress={() => setNewBudget({ ...newBudget, period: 'yearly' })}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      newBudget.period === 'yearly' && styles.periodButtonTextActive,
                    ]}
                  >
                    Yearly
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Notification Threshold */}
              <Text style={styles.inputLabel}>Alert at {newBudget.notificationThreshold}%</Text>
              <TextInput
                style={styles.thresholdInput}
                value={newBudget.notificationThreshold}
                onChangeText={(text) => setNewBudget({ ...newBudget, notificationThreshold: text })}
                keyboardType="number-pad"
              />

              <TouchableOpacity style={styles.createButton} onPress={handleAddBudget}>
                <Text style={styles.createButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
  },
  budgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  budgetPeriod: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    paddingVertical: 12,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#6366F1',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },
  thresholdInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  createButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
