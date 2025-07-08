import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getLimits, deleteLimit } from '../../services/limitService';
import { COLORS, SIZES } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency } from '../../utils/formatters';
import { useFocusEffect } from '@react-navigation/native';

const LimitListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [limits, setLimits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      loadLimits();
    }, [selectedMonth])
  );

  const loadLimits = async () => {
    try {
      setIsLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      console.log('Carregando limites para:', { year, month });
      const response = await getLimits(year, month);
      console.log('Resposta do backend:', response);
      const limitsArray = Array.isArray(response) ? response : [response];
      const filteredLimits = limitsArray.filter(limit => limit !== null && limit !== undefined);
      setLimits(filteredLimits);
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao carregar limites';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLimit = async (limitId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este limite?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLimit(limitId);
              Alert.alert('Sucesso', 'Limite excluído com sucesso!');
              loadLimits();
            } catch (error) {
              const errorMessage = error.response?.data?.error || 
                                  error.response?.data?.message || 
                                  'Erro ao excluir limite';
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  };

  const canEditLimit = (limitDate) => {
    const limitMonth = new Date(limitDate);
    const currentMonth = new Date();
    
    // Permite edição para mês atual e meses futuros
    const limitYear = limitMonth.getFullYear();
    const limitMonthNum = limitMonth.getMonth();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();
    
    return limitYear > currentYear || (limitYear === currentYear && limitMonthNum >= currentMonthNum);
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
        <Text style={styles.title}>Meus Limites</Text>
        
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
        {!limits || limits.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="attach-money" size={48} color={COLORS.GRAY} />
              <Text style={styles.emptyText}>
                Nenhum limite encontrado para {getMonthDisplay()}
              </Text>
              <Text style={styles.emptySubtext}>
                Defina um limite mensal para controlar seus gastos
              </Text>
            </View>
          </Card>
        ) : (
          limits.map((limit, index) => (
            <Card key={limit?.ID || limit?.id || index} style={styles.limitCard}>
              <View style={styles.limitHeader}>
                <View style={styles.limitInfo}>
                  <Text style={styles.limitLabel}>Limite Mensal</Text>
                  <Text style={styles.limitMonth}>
                    {getMonthDisplay()}
                  </Text>
                </View>
                <Text style={styles.limitValue}>
                  {formatCurrency(limit.VALOR || limit.value)}
                </Text>
              </View>

              {canEditLimit(new Date(limit.ANO, limit.MES - 1, 1)) && (
                <View style={styles.limitActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('MonthlyLimit', { 
                      limitId: limit.ID || limit.id,
                      limit: limit 
                    })}
                  >
                    <Icon name="edit" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteLimit(limit.ID || limit.id)}
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

      {canModifyMonth() && limits.length === 0 && (
        <View style={styles.fabContainer}>
          <Button
            title="Definir Limite"
            onPress={() => navigation.navigate('MonthlyLimit', {
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
  emptySubtext: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginTop: SIZES.SPACING_SM,
  },
  limitCard: {
    marginBottom: SIZES.SPACING_MD,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  limitInfo: {
    flex: 1,
  },
  limitLabel: {
    fontSize: SIZES.FONT_MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_XS,
  },
  limitMonth: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
  },
  limitValue: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
  },
  limitActions: {
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

export default LimitListScreen; 