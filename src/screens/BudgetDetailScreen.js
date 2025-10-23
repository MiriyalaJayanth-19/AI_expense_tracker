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
import BudgetService from '../services/BudgetService';
import AuthService from '../services/AuthService';

export default function BudgetDetailScreen({ route, navigation }) {
  const { budgetId } = route.params;
  const [budgetStatus, setBudgetStatus] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        const status = await BudgetService.getBudgetStatus(currentUser.id, budgetId);
        setBudgetStatus(status);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load budget');
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Budget', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await BudgetService.deleteBudget(budgetId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!budgetStatus) return null;

  const statusColor = budgetStatus.isOverBudget ? '#EF4444' : budgetStatus.percentage >= 80 ? '#F59E0B' : '#10B981';

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: statusColor }]}>
        <Text style={styles.category}>{budgetStatus.budget.category}</Text>
        <Text style={styles.percentage}>{budgetStatus.percentage.toFixed(0)}%</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Budget</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 40, alignItems: 'center' },
  category: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  percentage: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginTop: 8 },
  content: { padding: 20 },
  deleteButton: { backgroundColor: '#EF4444', padding: 16, borderRadius: 12, alignItems: 'center' },
  deleteText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
