import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { format, addMonths, subMonths, isSameMonth, isFuture, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLimit, deleteLimit } from '../../services/limitService';

const LimitItem = ({ item, onDelete, onEdit, canModify }) => {
  // Adiciona uma verificação para garantir que o valor é um número antes de formatar
  const value = (item && typeof item.VALOR === 'number') ? item.VALOR : parseFloat(item.VALOR || 0);
  const displayValue = !isNaN(value) ? value.toFixed(2).replace('.', ',') : '0,00';

  return (
    <View style={limitItemStyles.itemContainer}>
      <View style={limitItemStyles.itemDetails}>
        <Text style={limitItemStyles.itemDescription}>Limite Mensal</Text>
        <Text style={limitItemStyles.itemValue}>R$ {displayValue}</Text>
      </View>
      {canModify && (
        <View style={limitItemStyles.itemActions}>
          <TouchableOpacity onPress={() => onEdit(item)} style={limitItemStyles.actionButton}>
            <Text style={limitItemStyles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.ID)} style={[limitItemStyles.actionButton, limitItemStyles.deleteButton]}>
            <Text style={limitItemStyles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const limitItemStyles = StyleSheet.create({
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
    color: '#28a745',
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

export default function LimitList({ navigation }) {
  const [limit, setLimit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const today = startOfMonth(new Date());
  const selectedMonth = startOfMonth(displayMonth);
  const canModify = isSameMonth(selectedMonth, today) || isFuture(selectedMonth);

  const loadLimitsForMonth = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      const response = await getLimit(formattedMonth);
      // A API pode retornar [null], então normalizamos para null
      const currentLimit = Array.isArray(response) && response[0] ? response[0] : null;
      setLimit(currentLimit);
    } catch (error) {
      setLimit(null);
      if (error.response && error.response.status !== 404) {
        Alert.alert('Erro', 'Não foi possível carregar os limites.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [displayMonth]);

  useFocusEffect(
    useCallback(() => {
      loadLimitsForMonth();
    }, [loadLimitsForMonth])
  );

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
      'Tem certeza que deseja excluir este limite?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteLimit(id);
              Alert.alert('Sucesso', 'Limite excluído com sucesso');
              loadLimitsForMonth(); // Recarregar a lista
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao excluir limite');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('MonthlyLimit', { limit: item });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#28a745" style={styles.centered} />;
    }

    if (!limit) {
      return (
        <View style={styles.centered}>
          <Icon name="highlight-off" size={60} color="#ccc" />
          <Text style={styles.noDataText}>Nenhum limite cadastrado para este mês.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={[limit]}
        keyExtractor={(item) => String(item.ID)}
        renderItem={({ item }) => (
          <LimitItem item={item} onDelete={handleDelete} onEdit={handleEdit} canModify={canModify} />
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Limites</Text>
        {canModify && !limit && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('MonthlyLimit', { limit: null })}
          >
            <Icon name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Novo Limite</Text>
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
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
}); 