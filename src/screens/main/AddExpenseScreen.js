import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import AuthService from '../../services/AuthService';
import VoiceService, { POPULAR_LOCALES } from '../../services/VoiceService';
import AIParsingService from '../../services/AIParsingService';
import ExpenseService from '../../services/ExpenseService';
import BudgetService from '../../services/BudgetService';
import { DEFAULT_CATEGORIES } from '../../database/seed';

export default function AddExpenseScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState('en-US');

  useEffect(() => {
    loadUser();
    return () => {
      VoiceService.destroy();
    };
  }, []);

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      await VoiceService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      await VoiceService.startListening(
        selectedLocale,
        async (text) => {
          setVoiceText(text);
          setIsListening(false);
          
          // Parse the voice text
          setParsing(true);
          try {
            const parsed = await AIParsingService.parseExpense(text);
            setAmount(parsed.amount.toString());
            setCategory(parsed.category);
            setDescription(parsed.description);
            setDate(parsed.date);
          } catch (error) {
            console.error('Parsing error:', error);
          } finally {
            setParsing(false);
          }
        },
        (error) => {
          setIsListening(false);
          Alert.alert('Voice Error', error.message || 'Failed to recognize speech');
        }
      );
    } catch (error) {
      setIsListening(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleAddExpense = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    try {
      await ExpenseService.createExpense(user.id, {
        amount: parseFloat(amount),
        category,
        description: description || voiceText,
        date,
        voiceText,
      });

      // Check budgets and notify if needed
      await BudgetService.checkBudgetsAndNotify(user.id);

      Alert.alert('Success', 'Expense added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setAmount('');
            setCategory('Food');
            setDescription('');
            setVoiceText('');
            setDate(new Date());
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryButton = (cat) => (
    <TouchableOpacity
      key={cat.name}
      style={[
        styles.categoryButton,
        category === cat.name && styles.categoryButtonActive,
        { borderColor: cat.color },
      ]}
      onPress={() => setCategory(cat.name)}
    >
      <Icon
        name={cat.icon}
        size={24}
        color={category === cat.name ? cat.color : '#6B7280'}
      />
      <Text
        style={[
          styles.categoryButtonText,
          category === cat.name && { color: cat.color },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Expense</Text>
          <TouchableOpacity onPress={() => setShowLanguageModal(true)}>
            <Icon name="language" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Voice Input Button */}
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceInput}
          disabled={parsing}
        >
          {parsing ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <>
              <Icon
                name={isListening ? 'mic' : 'mic-outline'}
                size={48}
                color="#FFF"
              />
              <Text style={styles.voiceButtonText}>
                {isListening ? 'Listening...' : 'Tap to speak'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {voiceText ? (
          <View style={styles.voiceTextContainer}>
            <Icon name="chatbubble-outline" size={16} color="#6366F1" />
            <Text style={styles.voiceText}>{voiceText}</Text>
          </View>
        ) : null}

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesGrid}>
            {DEFAULT_CATEGORIES.map(renderCategoryButton)}
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.dateText}>{format(date, 'MMMM dd, yyyy')}</Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExpense}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {POPULAR_LOCALES.map((locale) => (
                <TouchableOpacity
                  key={locale.code}
                  style={styles.languageItem}
                  onPress={() => {
                    setSelectedLocale(locale.code);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.languageFlag}>{locale.flag}</Text>
                  <Text style={styles.languageName}>{locale.name}</Text>
                  {selectedLocale === locale.code && (
                    <Icon name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
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
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  voiceButton: {
    backgroundColor: '#6366F1',
    borderRadius: 100,
    width: 160,
    height: 160,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
  },
  voiceButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  voiceTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  voiceText: {
    flex: 1,
    marginLeft: 8,
    color: '#4F46E5',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    paddingVertical: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#F9FAFB',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
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
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
});
