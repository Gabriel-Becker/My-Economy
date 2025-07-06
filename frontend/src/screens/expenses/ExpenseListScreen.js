import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getExpenses, deleteExpense } from '../../services/expenseService';
import { COLORS, SIZES } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpenseListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth]);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const response = await getExpenses(year, month);
      const expensesArray = Array.isArray(response) ? response : [response];
      const filteredExpenses = expensesArray.filter(expense => expense !== null && expense !== undefined);
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao carregar despesas';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
              loadExpenses();
            } catch (error) {
              const errorMessage = error.response?.data?.error || 
                                  error.response?.data?.message || 
                                  'Erro ao excluir despesa';
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  };

  const canEditExpense = (expenseDate) => {
    const expenseMonth = new Date(expenseDate);
    const currentMonth = new Date();
    
    // Permite edição para mês atual e meses futuros
    const expenseYear = expenseMonth.getFullYear();
    const expenseMonthNum = expenseMonth.getMonth();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();
    
    return expenseYear > currentYear || (expenseYear === currentYear && expenseMonthNum >= currentMonthNum);
  };

  const navigateToMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setSelectedMonth(newMonth);
  };

  const getMonthDisplay = () => {
    return selectedMonth.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const canModifyMonth = () => {
    const currentMonth = new Date();
    const selectedYear = selectedMonth.getFullYear();
    const selectedMonthNum = selectedMonth.getMonth();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();
    
    return selectedYear > currentYear || (selectedYear === currentYear && selectedMonthNum >= currentMonthNum);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Despesas</Text>
        
        <View style={styles.monthNavigator}>
          <TouchableOpacity onPress={() => navigateToMonth('prev')}>
            <Icon name="chevron-left" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>{getMonthDisplay()}</Text>
          
          <TouchableOpacity onPress={() => navigateToMonth('next')}>
            <Icon name="chevron-right" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>

        {!canModifyMonth() && (
          <View style={styles.viewModeIndicator}>
            <Icon name="visibility" size={16} color={COLORS.TEXT_LIGHT} />
            <Text style={styles.viewModeText}>Modo Visualização</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {!expenses || expenses.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="receipt" size={48} color={COLORS.GRAY} />
              <Text style={styles.emptyText}>
                Nenhuma despesa encontrada para {getMonthDisplay()}
              </Text>
            </View>
          </Card>
        ) : (
          expenses.map((expense, index) => (
            <Card key={expense?.ID || expense?.id || index} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDescription}>{expense.DESCRICAO || expense.description}</Text>
                  <Text style={styles.expenseDate}>
                    {formatDate(expense.DATA || expense.date)}
                  </Text>
                </View>
                <Text style={styles.expenseValue}>
                  {formatCurrency(expense.VALOR || expense.value)}
                </Text>
              </View>

              {canEditExpense(new Date(expense.ANO, expense.MES - 1, expense.DIA || 1)) && (
                <View style={styles.expenseActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('NewExpense', { 
                      expenseId: expense.ID || expense.id,
                      expense: expense 
                    })}
                  >
                    <Icon name="edit" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteExpense(expense.ID || expense.id)}
                  >
                    <Icon name="delete" size={20} color={COLORS.DANGER} />
                    <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>

      {canModifyMonth() && (
        <View style={styles.fabContainer}>
          <Button
            title="Nova Despesa"
            onPress={() => navigation.navigate('NewExpense', {
              referenceMonth: `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`
            })}
            style={styles.fabButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: SIZES.SPACING_LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SIZES.SPACING_MD,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SPACING_SM,
  },
  monthText: {
    fontSize: SIZES.FONT_LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  viewModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WARNING_LIGHT,
    padding: SIZES.SPACING_SM,
    borderRadius: SIZES.BORDER_RADIUS_SM,
  },
  viewModeText: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
    marginLeft: SIZES.SPACING_XS,
  },
  content: {
    flex: 1,
    padding: SIZES.SPACING_LG,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.SPACING_XL,
  },
  emptyText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginTop: SIZES.SPACING_MD,
  },
  expenseCard: {
    marginBottom: SIZES.SPACING_MD,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: SIZES.FONT_MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_XS,
  },
  expenseDate: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
  },
  expenseValue: {
    fontSize: SIZES.FONT_LG,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.SPACING_MD,
    paddingTop: SIZES.SPACING_MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.SPACING_LG,
  },
  actionText: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.PRIMARY,
    marginLeft: SIZES.SPACING_XS,
  },
  deleteButton: {
    marginLeft: SIZES.SPACING_LG,
  },
  deleteText: {
    color: COLORS.DANGER,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SIZES.SPACING_LG,
    right: SIZES.SPACING_LG,
    left: SIZES.SPACING_LG,
  },
  fabButton: {
    borderRadius: SIZES.BORDER_RADIUS_LG,
  },
});

export default ExpenseListScreen; 