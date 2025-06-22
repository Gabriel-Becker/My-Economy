import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { format, addMonths, subMonths, isSameMonth, isFuture, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { getLimit } from '../../services/limitService';
import { getExpenses } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [monthlyLimit, setMonthlyLimit] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para verificar se o mês pode ser modificado
  const today = startOfMonth(new Date());
  const selectedMonth = startOfMonth(displayMonth);
  const canModify = isSameMonth(selectedMonth, today) || isFuture(selectedMonth);

  // useFocusEffect garante que os dados são recarregados sempre que a tela Home recebe foco
  useFocusEffect(
    useCallback(() => {
      loadDataForMonth();
    }, [displayMonth])
  );

  async function loadDataForMonth() {
    setIsLoading(true);
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      
      const limitData = await getLimit(formattedMonth);
      // A API pode retornar [null], então verificamos o primeiro elemento
      const currentLimit = Array.isArray(limitData) && limitData[0] ? limitData[0] : null;
      setMonthlyLimit(currentLimit);

      const expensesResponse = await getExpenses(formattedMonth);
      const calculatedTotalExpenses = expensesResponse.reduce(
        (sum, expense) => sum + parseFloat(expense.VALOR || expense.value), 0
      );
      setTotalExpenses(calculatedTotalExpenses);

    } catch (error) {
      if (error.response && error.response.status !== 404) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do mês.');
      }
      setMonthlyLimit(null);
      setTotalExpenses(0);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setDisplayMonth(subMonths(displayMonth, 1));
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  const renderWelcomeCard = () => {
    return (
      <View style={[styles.card, styles.cardInfo]}>
        <Text style={styles.cardTitle}>Bem-vindo(a)! 👋</Text>
        <Text style={styles.cardMessage}>
          {canModify
            ? 'Você ainda não tem um limite definido para este mês. Que tal criar um para começar?'
            : 'Nenhum limite foi definido para este mês.'
          }
        </Text>
        {canModify && ( // Mostra o botão apenas se o mês puder ser modificado
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('MonthlyLimit')}
          >
            <Text style={styles.cardButtonText}>Definir Limite Mensal</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderStatusCard = () => {
    const remaining = parseFloat(monthlyLimit.VALOR) - totalExpenses;
    const isOverLimit = remaining < 0;

    return (
      <View style={[styles.card, isOverLimit ? styles.cardWarning : styles.cardSuccess]}>
        <Text style={styles.cardTitle}>{isOverLimit ? 'Atenção! 😥' : 'Parabéns! 😊'}</Text>
        <Text style={styles.cardMessage}>
          {isOverLimit 
            ? `Você ultrapassou o limite em R$ ${Math.abs(remaining).toFixed(2)}`
            : `Você ainda tem R$ ${remaining.toFixed(2)} restantes este mês.`
          }
        </Text>
      </View>
    );
  };

  const renderProgressBar = () => {
    const limitValue = parseFloat(monthlyLimit.VALOR);
    const progress = limitValue > 0 ? (totalExpenses / limitValue) * 100 : 0;
  
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso do Mês</Text>
          <Text style={styles.progressValue}>
            R$ {totalExpenses.toFixed(2)} / R$ {limitValue.toFixed(2)}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: totalExpenses <= limitValue ? '#28a745' : '#dc3545',
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.welcomeText}>Olá {user?.name || 'Usuário'}</Text>
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

      {isLoading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 50 }} />
      ) : monthlyLimit ? (
        <>
          {renderStatusCard()}
          {renderProgressBar()}
        </>
      ) : (
        renderWelcomeCard()
      )}

      {canModify && ( // Mostra os botões apenas para o mês atual ou futuro
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('NewExpense', { referenceMonth: format(displayMonth, 'yyyy-MM') })}>
            <Text style={styles.actionButtonText}>Nova Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('MonthlyLimit', { limit: monthlyLimit })}
          >
            <Text style={styles.actionButtonText}>Gerenciar Limite</Text>
          </TouchableOpacity>
        </View>
      )}
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