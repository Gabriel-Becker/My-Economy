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
import { getLimit, deleteLimit } from '../../services/limitService';

const LimitItem = ({ item, onDelete, onEdit }) => (
  <View style={limitItemStyles.itemContainer}>
    <View style={limitItemStyles.itemDetails}>
      <Text style={limitItemStyles.itemDescription}>Limite Mensal</Text>
      <Text style={limitItemStyles.itemValue}>R$ {parseFloat(item.value).toFixed(2)}</Text>
    </View>
    <View style={limitItemStyles.itemActions}>
      <TouchableOpacity onPress={() => onEdit(item)} style={limitItemStyles.actionButton}>
        <Text style={limitItemStyles.actionButtonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={[limitItemStyles.actionButton, limitItemStyles.deleteButton]}>
        <Text style={limitItemStyles.actionButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

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
  const [limits, setLimits] = useState([]);
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const loadLimitsForMonth = useCallback(async () => {
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      const response = await getLimit(formattedMonth);
      // A API de limites retorna um único objeto ou null/undefined se não houver limite para o mês
      setLimits(response ? [response] : []);
    } catch (error) {
      setLimits([]);
      Alert.alert('Erro', error.message || 'Erro ao carregar limites');
    }
  }, [displayMonth]);

  useEffect(() => {
    loadLimitsForMonth();
  }, [loadLimitsForMonth]);

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
    // Navegar para a tela de edição de limite, passando os dados do item
    navigation.navigate('MonthlyLimit', { limit: item });
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
      
      <Text style={styles.title}>Histórico de Limites</Text>

      {limits.length > 0 ? (
        <FlatList
          data={limits}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <LimitItem item={item} onDelete={handleDelete} onEdit={handleEdit} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum limite registrado para este mês.</Text>
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