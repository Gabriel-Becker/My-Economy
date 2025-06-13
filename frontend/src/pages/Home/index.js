import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getLimit } from '../../services/limitService';
import { getExpenses } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [monthlyLimit, setMonthlyLimit] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [displayMonth, setDisplayMonth] = useState(new Date());

  useEffect(() => {
    loadDataForMonth();
  }, [displayMonth]);

  async function loadDataForMonth() {
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');

      // Buscar limite
      const limitResponse = await getLimit(formattedMonth);
      setMonthlyLimit(limitResponse);

      // Buscar despesas e calcular total
      const expensesResponse = await getExpenses(formattedMonth);
      const calculatedTotalExpenses = expensesResponse.reduce((sum, expense) => sum + parseFloat(expense.value), 0);
      setTotalExpenses(calculatedTotalExpenses);

    } catch (error) {
      // Se o limite não for encontrado (404), não é um erro, apenas nenhum limite definido.
      // Para outros erros, exibir alerta.
      if (error.message && !error.message.includes('404')) {
        Alert.alert('Erro', error.message || 'Erro ao carregar dados do mês');
      }
      setMonthlyLimit(null);
      setTotalExpenses(0);
    }
  }

  function getStatusMessage() {
    if (!monthlyLimit) {
      return {
        emoji: '😔',
        title: 'Nenhum limite definido',
        message: 'Defina um limite mensal para começar a controlar suas despesas',
        type: 'info',
        buttonText: 'Definir Limite',
      };
    }

    const remaining = parseFloat(monthlyLimit.value) - totalExpenses;

    if (remaining >= 0) {
      return {
        emoji: '😊',
        title: 'Parabéns!',
        message: `Você economizou R$ ${remaining.toFixed(2)} este mês`,
        type: 'success',
      };
    }

    return {
      emoji: '😥',
      title: 'Atenção!',
      message: `Você ultrapassou o limite em R$ ${Math.abs(remaining).toFixed(2)}`,
      type: 'warning',
    };
  }

  const status = getStatusMessage();

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setDisplayMonth(subMonths(displayMonth, 1));
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.welcomeText}>Olá {user?.name || 'Usuário'} {status.emoji}</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => handleMonthChange('prev')}>
            <Text style={styles.monthArrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.currentMonth}>{format(displayMonth, 'MMMM yyyy', { locale: ptBR })}</Text>
          <TouchableOpacity onPress={() => handleMonthChange('next')}>
            <Text style={styles.monthArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Feedback */}
      <View style={[styles.card, styles[`card${status.type.charAt(0).toUpperCase() + status.type.slice(1)}`]]}>
        <Text style={styles.cardTitle}>{status.title}</Text>
        <Text style={styles.cardMessage}>{status.message}</Text>
        {status.buttonText && (
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('MonthlyLimit')}
          >
            <Text style={styles.cardButtonText}>{status.buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar (Visible only if monthlyLimit is available) */}
      {monthlyLimit && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progresso do Mês</Text>
            <Text style={styles.progressValue}>
              R$ {totalExpenses.toFixed(2)} / R$ {parseFloat(monthlyLimit.value).toFixed(2)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    (totalExpenses / parseFloat(monthlyLimit.value)) * 100,
                    100
                  )}%`,
                  backgroundColor: totalExpenses <= parseFloat(monthlyLimit.value) ? '#28a745' : '#dc3545',
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Action Buttons at the bottom - not a tab navigator yet */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('NewExpense')}>
          <Text style={styles.actionButtonText}>Nova Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('MonthlyLimit')}>
          <Text style={styles.actionButtonText}>Gerenciar Limite</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
  },
  monthArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 10,
  },
  currentMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  cardInfo: {
    backgroundColor: '#f0f0f0',
  },
  cardSuccess: {
    backgroundColor: '#d4edda',
  },
  cardWarning: {
    backgroundColor: '#f8d7da',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  cardButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressValue: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#ffffff',
  },
  actionButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 