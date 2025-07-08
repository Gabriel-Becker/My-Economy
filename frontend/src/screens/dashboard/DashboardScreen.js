import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { format, addMonths, subMonths, isSameMonth, isFuture, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { getLimits } from '../../services/limitService';
import { getExpenses } from '../../services/expenseService';
import { COLORS, SIZES } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDisplayValue } from '../../utils/formatters';
import { categories as CATEGORY_LIST } from '../../components/forms/CategoryInput';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [monthlyLimit, setMonthlyLimit] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const today = startOfMonth(new Date());
  const selectedMonth = startOfMonth(displayMonth);
  const canModify = isSameMonth(selectedMonth, today) || isFuture(selectedMonth);

  useFocusEffect(
    useCallback(() => {
      loadDataForMonth();
    }, [displayMonth])
  );

  const loadDataForMonth = async () => {
    setIsLoading(true);
    try {
      const formattedMonth = format(displayMonth, 'yyyy-MM');
      
      const year = displayMonth.getFullYear();
      const month = displayMonth.getMonth() + 1;
      const limitData = await getLimits(year, month);
      const currentLimit = Array.isArray(limitData) && limitData[0] ? limitData[0] : null;
      setMonthlyLimit(currentLimit);

      const expensesResponse = await getExpenses(year, month);
      setExpenses(expensesResponse);
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
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      const previousMonth = subMonths(displayMonth, 1);
      setDisplayMonth(previousMonth);
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  const renderWelcomeCard = () => (
    <Card variant="info">
      <Text style={styles.cardTitle}>Bem-vindo(a)! 👋</Text>
      <Text style={styles.cardMessage}>
        {canModify
          ? 'Você ainda não tem um limite definido para este mês. Que tal criar um para começar?'
          : 'Nenhum limite foi definido para este mês.'
        }
      </Text>
      {canModify && (
        <Button
          title="Definir Limite Mensal"
          onPress={() => navigation.navigate('MonthlyLimit')}
          size="small"
          style={styles.cardButton}
        />
      )}
    </Card>
  );

  const renderStatusCard = () => {
    const remaining = parseFloat(monthlyLimit.VALOR) - totalExpenses;
    const isOverLimit = remaining < 0;
    const isMonthFinished = !canModify;

    return (
      <Card variant={isOverLimit ? 'warning' : 'success'}>
        <Text style={styles.cardTitle}>
          {isMonthFinished 
            ? (isOverLimit ? 'Mês Finalizado - Meta Não Atingida 😥' : 'Mês Finalizado - Meta Atingida! 🎉')
            : (isOverLimit ? 'Atenção! 😥' : 'Parabéns! 😊')
          }
        </Text>
        <Text style={styles.cardMessage}>
          {isMonthFinished 
            ? (isOverLimit 
                ? `Você ultrapassou o limite em ${formatDisplayValue(Math.abs(remaining))}. Não desanime! O próximo mês é uma nova oportunidade para economizar e atingir sua meta. 💪`
                : `Parabéns! Você economizou ${formatDisplayValue(remaining)} este mês! Continue assim no próximo mês! 🎯`
              )
            : (isOverLimit 
                ? `Você ultrapassou o limite em ${formatDisplayValue(Math.abs(remaining))}`
                : `Você ainda tem ${formatDisplayValue(remaining)} restantes este mês.`
              )
          }
        </Text>
      </Card>
    );
  };

  // Agrupar despesas por categoria
  const getCategoryProgress = () => {
    if (!CATEGORY_LIST) return [];
    const limitValue = monthlyLimit ? parseFloat(monthlyLimit.VALOR) : 0;
    const categoryTotals = {};
    expenses.forEach(exp => {
      const cat = exp.CATEGORIA || 'Geral';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(exp.VALOR || exp.value);
    });
    // Garante que todas as categorias aparecem, mesmo sem despesa
    return CATEGORY_LIST.map(cat => ({
      label: cat.label,
      value: categoryTotals[cat.label] || 0,
      limit: limitValue
    }));
  };

  const renderCategoryProgressModal = () => {
    const categoryProgress = getCategoryProgress().filter(cat => cat.value > 0);
    const limitValue = monthlyLimit ? parseFloat(monthlyLimit.VALOR) : 0;
    const geralValue = totalExpenses;
    const geralPercent = limitValue > 0 ? (geralValue / limitValue) * 100 : 0;
    const geralBarColor = geralValue <= limitValue ? COLORS.PROGRESS_SUCCESS : COLORS.PROGRESS_DANGER;
    return (
      <Modal
        visible={showCategoryModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: COLORS.WHITE, borderRadius: 16, padding: SIZES.SPACING_LG, width: '90%', maxWidth: 400, maxHeight: '80vh', display: 'flex' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.SPACING_MD }}>
              <Text style={{ fontWeight: 'bold', fontSize: SIZES.FONT_LG }}>Progresso por categoria</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={{ fontSize: 22, color: COLORS.TEXT_SECONDARY }}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: SIZES.SPACING_MD }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: SIZES.FONT_MD, fontWeight: 'bold' }}>Progresso Mensal</Text>
                <Text style={{ fontSize: SIZES.FONT_MD, fontWeight: 'bold' }}>{`${formatDisplayValue(geralValue)} / ${formatDisplayValue(limitValue)}`}</Text>
              </View>
              <View style={{ height: 10, backgroundColor: COLORS.BORDER, borderRadius: 5, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${Math.min(geralPercent, 100)}%`, backgroundColor: geralBarColor }} />
              </View>
            </View>
            <View style={{ flex: 1, minHeight: 0 }}>
              <ScrollView style={{ maxHeight: '50vh' }} contentContainerStyle={{ paddingBottom: 0 }}>
                {categoryProgress.map((cat, idx) => {
                  const percent = cat.limit > 0 ? (cat.value / cat.limit) * 100 : 0;
                  const barColor = cat.value <= cat.limit ? COLORS.PROGRESS_SUCCESS : COLORS.PROGRESS_DANGER;
                  return (
                    <View key={cat.label} style={{ marginBottom: idx === categoryProgress.length - 1 ? 0 : SIZES.SPACING_MD }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={{ fontSize: SIZES.FONT_MD }}>{cat.label}</Text>
                        <Text style={{ fontSize: SIZES.FONT_MD }}>{`${formatDisplayValue(cat.value)} / ${formatDisplayValue(cat.limit)}`}</Text>
                      </View>
                      <View style={{ height: 10, backgroundColor: COLORS.BORDER, borderRadius: 5, overflow: 'hidden' }}>
                        <View style={{ height: '100%', width: `${Math.min(percent, 100)}%`, backgroundColor: barColor }} />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProgressBar = () => {
    const limitValue = monthlyLimit ? parseFloat(monthlyLimit.VALOR) : 0;
    const progress = limitValue > 0 ? (totalExpenses / limitValue) * 100 : 0;
  
    return (
      <Card>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso do Mês</Text>
          <Text style={styles.progressValue}>
            {formatDisplayValue(totalExpenses)} {limitValue > 0 ? `/ ${formatDisplayValue(limitValue)}` : ''}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCategoryModal(true)}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: totalExpenses <= limitValue ? COLORS.PROGRESS_SUCCESS : COLORS.PROGRESS_DANGER,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {limitValue === 0 && totalExpenses > 0 && (
          <Text style={styles.noLimitText}>
            Você tem despesas cadastradas, mas nenhum limite definido para este mês.
          </Text>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá {user?.name || 'Usuário'}</Text>
        <View style={styles.monthSelector}>
          <Pressable 
            onPress={() => handleMonthChange('prev')}
            style={({ pressed }) => [
              styles.monthArrow,
              pressed && styles.monthArrowPressed,
            ]}
            android_ripple={{ color: COLORS.SECONDARY, borderless: true }}
          >
            <Text style={styles.monthArrowText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.currentMonth}>{format(displayMonth, 'MMMM yyyy', { locale: ptBR })}</Text>
          <Pressable 
            onPress={() => handleMonthChange('next')}
            style={({ pressed }) => [
              styles.monthArrow,
              pressed && styles.monthArrowPressed,
            ]}
            android_ripple={{ color: COLORS.SECONDARY, borderless: true }}
          >
            <Text style={styles.monthArrowText}>{'>'}</Text>
          </Pressable>
        </View>
      </View>

      {monthlyLimit ? renderStatusCard() : renderWelcomeCard()}
      {renderProgressBar()}
      {renderCategoryProgressModal()}

      {!canModify && (
        <Card variant="info">
          <Text style={styles.cardTitle}>Modo Visualização 📊</Text>
          <Text style={styles.cardMessage}>
            Este mês é apenas para visualização. Você pode ver os dados, mas não pode adicionar, editar ou excluir registros de meses anteriores.
          </Text>
        </Card>
      )}

      {canModify && (
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Nova Despesa"
            onPress={() => navigation.navigate('NewExpense', { referenceMonth: format(displayMonth, 'yyyy-MM') })}
            style={styles.actionButton}
          />
          <Button
            title="Gerenciar Limite"
            onPress={() => navigation.navigate('MonthlyLimit', { limit: monthlyLimit })}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      )}
    </ScrollView>
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
    borderBottomColor: COLORS.BORDER_LIGHT,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_MD,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
  },
  monthArrow: {
    paddingHorizontal: SIZES.SPACING_MD,
    borderRadius: SIZES.BORDER_RADIUS_SM,
  },
  monthArrowDisabled: {
    opacity: 0.5,
  },
  monthArrowPressed: {
    opacity: 0.7,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  monthArrowText: {
    fontSize: SIZES.FONT_XXL,
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
  },
  monthArrowTextDisabled: {
    color: COLORS.TEXT_LIGHT,
  },
  currentMonth: {
    fontSize: SIZES.FONT_LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
  },
  cardTitle: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_MD,
    textAlign: 'center',
  },
  cardMessage: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SIZES.SPACING_LG,
    lineHeight: 22,
  },
  cardButton: {
    alignSelf: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SPACING_MD,
  },
  progressTitle: {
    fontSize: SIZES.FONT_LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  progressValue: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.BORDER,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  noLimitText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: SIZES.SPACING_MD,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.SPACING_LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.SPACING_SM,
  },
});

export default DashboardScreen; 