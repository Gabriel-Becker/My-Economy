import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../constants';
import Input from '../../components/common/Input';
import DateInput from '../../components/forms/DateInput';
import Button from '../../components/common/Button';
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirmation, 
  validateBirthDate,
  validateRequired 
} from '../../utils/validation';
import { formatDateForBackend } from '../../utils/formatters';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateRequired(formData.name, 'Nome');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    const emailValidation = validateRequired(formData.email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Insira um email válido';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    }

    if (!validatePasswordConfirmation(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      newErrors.birthDate = birthDateValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formattedBirthDate = formatDateForBackend(formData.birthDate);
      await signUp(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.confirmPassword, 
        formattedBirthDate
      );
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Ocorreu um erro ao tentar criar a conta.';
      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR CONTA</Text>
      
      <View style={styles.form}>
        <Input
          label="Nome"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Seu nome completo"
          error={errors.name}
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <DateInput
          label="Data de Nascimento"
          value={formData.birthDate}
          onChangeText={(value) => updateField('birthDate', value)}
          placeholder="DD/MM/AAAA"
          error={errors.birthDate}
        />

        <Input
          label="Senha"
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
          placeholder="*****"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Confirmar Senha"
          value={formData.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          placeholder="*****"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button
          title={isLoading ? "Criando conta..." : "Criar Conta"}
          onPress={handleSignUp}
          disabled={isLoading}
          style={styles.button}
        />

        <Button
          title="Já tenho conta"
          onPress={() => navigation.navigate('SignIn')}
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
    backgroundColor: COLORS.WHITE,
    padding: SIZES.SPACING_LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.FONT_XXL,
    fontWeight: 'bold',
    marginBottom: SIZES.SPACING_XL,
    color: COLORS.TEXT_PRIMARY,
  },
  form: {
    width: '100%',
    maxWidth: SIZES.CONTAINER_MAX_WIDTH,
  },
  button: {
    marginTop: SIZES.SPACING_LG,
  },
});

export default RegisterScreen; 