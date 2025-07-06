import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail, validateRequired } from '../../utils/validation';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailValidation = validateRequired(formData.email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Insira um email válido';
    }

    const passwordValidation = validateRequired(formData.password, 'Senha');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Ocorreu um erro ao tentar fazer login.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      
      <View style={styles.form}>
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <Input
          label="Senha"
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
          placeholder="Digite sua senha"
          secureTextEntry
          error={errors.password}
        />

        <Button
          title={isLoading ? "Entrando..." : "Entrar"}
          onPress={handleSignIn}
          disabled={isLoading}
          style={styles.button}
        />

        <Button
          title="Cadastre-se"
          onPress={() => navigation.navigate('SignUp')}
          variant="secondary"
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

export default LoginScreen; 