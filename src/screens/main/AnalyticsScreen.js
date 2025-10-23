import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { startOfMonth, endOfMonth } from 'date-fns';
import AuthService from '../../services/AuthService';
import ExpenseService from '../../services/ExpenseService';
import { DEFAULT_CATEGORIES } from '../../database/seed';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const stats = await ExpenseService.getStatistics(currentUser.id);
        setStatistics(stats);

        // Prepare pie chart data
        const pieData = Object.entries(stats.monthlyCategoryTotals).map(([category, amount]) => {
          const cat = DEFAULT_CATEGORIES.find(c => c.name === category);
          return {
            name: category,
            amount: amount,
            color: cat ? cat.color : '#A29BFE',
            legendFontColor: '#6B7280',
            legendFontSize: 12,
          };
        });
        setCategoryData(pieData);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  if (!statistics) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
      >
        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {renderStatCard(
            'This Month',
            `$${statistics.monthlyTotal.toFixed(2)}`,
            'calendar',
            '#6366F1'
          )}
          {renderStatCard(
            'This Year',
            `$${statistics.yearlyTotal.toFixed(2)}`,
            'trending-up',
            '#10B981'
          )}
          {renderStatCard(
            'All Time',
            `$${statistics.allTimeTotal.toFixed(2)}`,
            'stats-chart',
            '#F59E0B'
          )}
          {renderStatCard(
            'Transactions',
            `${statistics.monthlyExpenseCount} this month`,
            'receipt',
            '#8B5CF6'
          )}
        </View>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            {/* Category List */}
            <View style={styles.categoryList}>
              {categoryData.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Category */}
        {statistics.topCategory !== 'None' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights</Text>
            <View style={styles.insightCard}>
              <Icon name="bulb" size={32} color="#F59E0B" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Spending Category</Text>
                <Text style={styles.insightText}>
                  You spent the most on <Text style={styles.insightHighlight}>{statistics.topCategory}</Text> this month
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Average per transaction */}
        <View style={styles.section}>
          <View style={styles.insightCard}>
            <Icon name="calculator" size={32} color="#6366F1" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Average Transaction</Text>
              <Text style={styles.insightText}>
                ${statistics.monthlyExpenseCount > 0 
                  ? (statistics.monthlyTotal / statistics.monthlyExpenseCount).toFixed(2)
                  : '0.00'} per expense
              </Text>
            </View>
          </View>
        </View>
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
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: 'bold',
    color: '#6366F1',
  },
});
