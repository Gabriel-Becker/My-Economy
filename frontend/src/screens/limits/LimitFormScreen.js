import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { format } from 'date-fns';
import { createLimit, updateLimit } from '../../services/limitService';
import { COLORS, SIZES } from '../../constants';
import CurrencyInput from '../../components/forms/CurrencyInput';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { 
  validateRequired, 
  validateReferenceMonth, 
  validateNotPastMonth,
  validateValue 
} from '../../utils/validation';

const LimitFormScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    id: null,
    value: '',
    referenceMonth: route.params?.referenceMonth || format(new Date(), 'yyyy-MM'),
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.limit) {
      const { limit } = route.params;
      setFormData({
        id: limit.ID,
        value: String(limit.VALOR * 100),
        referenceMonth: `${limit.ANO}-${String(limit.MES).padStart(2, '0')}`,
      });
      navigation.setOptions({ title: 'Editar Limite' });
    } else {
      navigation.setOptions({ title: 'Definir Limite Mensal' });
    }
  }, [route.params?.limit, navigation]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
      // Só valida mês passado se for edição (permite criar para mês atual/futuro)
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
      const [year, month] = formData.referenceMonth.split('-').map(Number);
      
      const limitData = {
        valor: numericValue,
        mes: month,
        ano: year,
      };

      if (formData.id) {
        await updateLimit(formData.id, limitData);
        Alert.alert('Sucesso', 'Limite atualizado com sucesso!');
      } else {
        await createLimit(limitData);
        Alert.alert('Sucesso', 'Limite mensal cadastrado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao salvar o limite.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {formData.id ? 'Editar Limite' : 'Definir Limite Mensal'}
      </Text>
      
      <View style={styles.form}>
        <CurrencyInput
          label="Valor"
          value={formData.value}
          onChangeText={(value) => updateField('value', value)}
          placeholder="R$ 0,00"
          error={errors.value}
        />

        <Input
          label="Mês de Referência"
          value={formData.referenceMonth}
          onChangeText={(value) => updateField('referenceMonth', value)}
          placeholder="YYYY-MM"
          editable={false}
          error={errors.referenceMonth}
          style={{ backgroundColor: COLORS.INPUT_BACKGROUND, opacity: 0.7 }}
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
  },
  button: {
    marginTop: SIZES.SPACING_LG,
  },
});

export default LimitFormScreen; 