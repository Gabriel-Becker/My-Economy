import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { format, addMonths, subMonths, isSameMonth, isFuture, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getExpenses, deleteExpense } from '../../services/expenseService';

const ExpenseItem = ({ item, onDelete, onEdit, canModify }) => {
  // Adiciona uma verificação para garantir que o valor é um número antes de formatar
  const value = (item && typeof item.VALOR === 'number') ? item.VALOR : parseFloat(item.VALOR || 0);
  const displayValue = !isNaN(value) ? value.toFixed(2).replace('.', ',') : '0,00';

  return (
    <View style={expenseItemStyles.itemContainer}>
      <View style={expenseItemStyles.itemDetails}>
        <Text style={expenseItemStyles.itemDescription}>{item.DESCRICAO}</Text>
        <Text style={expenseItemStyles.itemValue}>R$ {displayValue}</Text>
      </View>
      {canModify && (
        <View style={expenseItemStyles.itemActions}>
          <TouchableOpacity onPress={() => onEdit(item)} style={expenseItemStyles.actionButton}>
            <Text style={expenseItemStyles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.ID)} style={[expenseItemStyles.actionButton, expenseItemStyles.deleteButton]}>
            <Text style={expenseItemStyles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const today = startOfMonth(new Date());
  const selectedMonth = startOfMonth(displayMonth);
  const canModify = isSameMonth(selectedMonth, today) || isFuture(selectedMonth);

  const loadExpensesForMonth = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      const response = await getExpenses(formattedMonth);
      setExpenses(response || []);
    } catch (error) {
      setExpenses([]);
      if (error.response && error.response.status !== 404) {
        Alert.alert('Erro', 'Não foi possível carregar as despesas.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [displayMonth]);

  useFocusEffect(
    useCallback(() => {
      loadExpensesForMonth();
    }, [loadExpensesForMonth])
  );

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setDisplayMonth(subMonths(displayMonth, 1));
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  const handleDelete = (id) => {
    setExpenseToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete);
      Alert.alert('Sucesso', 'Despesa excluída com sucesso');
      setShowConfirmModal(false);
      setExpenseToDelete(null);
      loadExpensesForMonth();
    } catch (error) {
      console.log('Erro ao excluir despesa:', error);
      Alert.alert('Erro', error.message || 'Erro ao excluir despesa');
      setShowConfirmModal(false);
      setExpenseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setExpenseToDelete(null);
  };

  const handleEdit = (item) => {
    navigation.navigate('NewExpense', { expense: item });
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#28a745" style={styles.centered} />;
    }

    if (expenses.length === 0) {
      return (
        <View style={styles.centered}>
          <Icon name="inbox" size={60} color="#ccc" />
          <Text style={styles.noDataText}>Nenhuma despesa registrada para este mês.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.ID)}
        renderItem={({ item }) => (
          <ExpenseItem item={item} onDelete={handleDelete} onEdit={handleEdit} canModify={canModify} />
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };
  
  useEffect(() => {
    return () => {
      setShowConfirmModal(false);
      setExpenseToDelete(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Despesas</Text>
        {canModify && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('NewExpense')}
          >
            <Icon name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Nova Despesa</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange('prev')}>
          <Text style={styles.monthArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.currentMonth}>{format(displayMonth, 'MMMM yyyy', { locale: ptBR })}</Text>
        <TouchableOpacity onPress={() => handleMonthChange('next')}>
          <Text style={styles.monthArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      {renderContent()}

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>Tem certeza que deseja excluir esta despesa?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelDelete}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
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
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 