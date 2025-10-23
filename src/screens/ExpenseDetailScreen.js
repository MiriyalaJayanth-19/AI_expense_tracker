import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import database from '../database';
import ExpenseService from '../services/ExpenseService';
import { DEFAULT_CATEGORIES } from '../database/seed';

export default function ExpenseDetailScreen({ route, navigation }) {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    loadExpense();
  }, []);

  const loadExpense = async () => {
    try {
      const expensesCollection = database.collections.get('expenses');
      const exp = await expensesCollection.find(expenseId);
      setExpense(exp);
    } catch (error) {
      console.error('Load expense error:', error);
      Alert.alert('Error', 'Failed to load expense');
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ExpenseService.deleteExpense(expenseId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
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

  const getCategoryIcon = (category) => {
    const cat = DEFAULT_CATEGORIES.find(c => c.name === category);
    return cat ? cat.icon : 'ellipsis-horizontal';
  };

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const categoryColor = getCategoryColor(expense.category);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: categoryColor }]}>
        <View style={styles.iconContainer}>
          <Icon name={getCategoryIcon(expense.category)} size={48} color="#FFF" />
        </View>
        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        <Text style={styles.category}>{expense.category}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{expense.description || 'No description'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {format(new Date(expense.date), 'MMMM dd, yyyy')}
          </Text>
        </View>

        {expense.voiceText && (
          <View style={styles.section}>
            <Text style={styles.label}>Voice Input</Text>
            <View style={styles.voiceContainer}>
              <Icon name="mic" size={16} color="#6366F1" />
              <Text style={styles.voiceText}>{expense.voiceText}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>
            {format(new Date(expense.createdAt), 'MMM dd, yyyy h:mm a')}
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  category: {
    fontSize: 20,
    color: '#FFF',
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
  },
  voiceText: {
    flex: 1,
    marginLeft: 8,
    color: '#4F46E5',
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});
