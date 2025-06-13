import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getExpenses, deleteExpense } from '../../services/expenseService';

const ExpenseItem = ({ item, onDelete, onEdit }) => (
  <View style={expenseItemStyles.itemContainer}>
    <View style={expenseItemStyles.itemDetails}>
      <Text style={expenseItemStyles.itemDescription}>{item.description}</Text>
      <Text style={expenseItemStyles.itemValue}>R$ {parseFloat(item.value).toFixed(2)}</Text>
    </View>
    <View style={expenseItemStyles.itemActions}>
      <TouchableOpacity onPress={() => onEdit(item)} style={expenseItemStyles.actionButton}>
        <Text style={expenseItemStyles.actionButtonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={[expenseItemStyles.actionButton, expenseItemStyles.deleteButton]}>
        <Text style={expenseItemStyles.actionButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const expenseItemStyles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemValue: {
    fontSize: 15,
    color: '#e74c3c',
    marginTop: 5,
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default function ExpenseList({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const loadExpensesForMonth = useCallback(async () => {
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      const response = await getExpenses(formattedMonth);
      setExpenses(response);
    } catch (error) {
      setExpenses([]);
      Alert.alert('Erro', error.message || 'Erro ao carregar despesas');
    }
  }, [displayMonth]);

  useEffect(() => {
    loadExpensesForMonth();
  }, [loadExpensesForMonth]);

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setDisplayMonth(subMonths(displayMonth, 1));
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteExpense(id);
              Alert.alert('Sucesso', 'Despesa excluída com sucesso');
              loadExpensesForMonth(); // Recarregar a lista
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao excluir despesa');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (item) => {
    // Navegar para a tela de edição de despesa, passando os dados do item
    navigation.navigate('NewExpense', { expense: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange('prev')}>
          <Text style={styles.monthArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.currentMonth}>{format(displayMonth, 'MMMM yyyy', { locale: ptBR })}</Text>
        <TouchableOpacity onPress={() => handleMonthChange('next')}>
          <Text style={styles.monthArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Histórico de Despesas</Text>

      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ExpenseItem item={item} onDelete={handleDelete} onEdit={handleEdit} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noDataText}>Nenhuma despesa registrada para este mês.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  monthArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  currentMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50,
  },
}); 