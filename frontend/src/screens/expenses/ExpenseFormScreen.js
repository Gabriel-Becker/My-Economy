import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { format } from 'date-fns';
import { createExpense, updateExpense } from '../../services/expenseService';
import { COLORS, SIZES } from '../../constants';
import Input from '../../components/common/Input';
import CurrencyInput from '../../components/forms/CurrencyInput';
import CategoryInput from '../../components/forms/CategoryInput';
import Button from '../../components/common/Button';
import { 
  validateRequired, 
  validateReferenceMonth, 
  validateNotPastMonth,
  validateValue 
} from '../../utils/validation';

const ExpenseFormScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    id: null,
    description: '',
    value: '',
    referenceMonth: route.params?.referenceMonth || format(new Date(), 'yyyy-MM'),
    category: 'Geral',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.expense) {
      const { expense } = route.params;
      setFormData({
        id: expense.ID,
        description: expense.DESCRICAO,
        value: String(expense.VALOR * 100).replace(/\D/g, ''),
        referenceMonth: `${expense.ANO}-${String(expense.MES).padStart(2, '0')}`,
        category: expense.CATEGORIA || 'Geral',
      });
      navigation.setOptions({ title: 'Editar Despesa' });
    } else {
      navigation.setOptions({ title: 'Nova Despesa' });
    }
  }, [route.params?.expense, navigation]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const descriptionValidation = validateRequired(formData.description, 'Descrição');
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.message;
    }

    if (!formData.value || formData.value === '') {
      newErrors.value = 'Valor é obrigatório';
    } else {
      const valueValidation = validateValue(parseInt(formData.value, 10) / 100);
      if (!valueValidation.isValid) {
        newErrors.value = valueValidation.message;
      }
    }

    const monthValidation = validateReferenceMonth(formData.referenceMonth);
    if (!monthValidation.isValid) {
      newErrors.referenceMonth = monthValidation.message;
    } else if (formData.id) {
      const pastMonthValidation = validateNotPastMonth(formData.referenceMonth);
      if (!pastMonthValidation.isValid) {
        newErrors.referenceMonth = pastMonthValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const numericValue = parseInt(formData.value, 10) / 100;
      const expenseData = {
        description: formData.description,
        value: numericValue,
        referenceMonth: formData.referenceMonth,
        category: formData.category || 'Geral',
      };

      if (formData.id) {
        await updateExpense(formData.id, expenseData);
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
      } else {
        await createExpense(expenseData);
        Alert.alert('Sucesso', 'Despesa cadastrada com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao salvar despesa';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {formData.id ? 'Editar Despesa' : 'Nova Despesa'}
      </Text>

      <View style={styles.form}>
        <Input
          label="Descrição"
          value={formData.description}
          onChangeText={(value) => updateField('description', value)}
          placeholder="Descrição da despesa"
          error={errors.description}
        />

        <CurrencyInput
          label="Valor"
          value={formData.value}
          onChangeText={(value) => updateField('value', value)}
          placeholder="R$ 0,00"
          error={errors.value}
        />

        <CategoryInput
          label="Categoria"
          value={formData.category}
          onChangeText={(value) => updateField('category', value)}
          error={errors.category}
          style={{ marginBottom: 0 }}
        />

        <Input
          label="Mês de Referência"
          value={formData.referenceMonth}
          onChangeText={(value) => updateField('referenceMonth', value)}
          placeholder="YYYY-MM"
          error={errors.referenceMonth}
          editable={!!formData.id}
          style={!formData.id ? { backgroundColor: COLORS.INPUT_BACKGROUND, opacity: 0.7 } : undefined}
        />

        <Button
          title={isLoading ? "Salvando..." : "Salvar"}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.button}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.SPACING_LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.FONT_XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_XL,
  },
  form: {
    width: '100%',
    maxWidth: SIZES.CONTAINER_MAX_WIDTH,
    gap: SIZES.SPACING_MD,
  },
  button: {
    marginTop: SIZES.SPACING_MD,
  },
});

export default ExpenseFormScreen; 