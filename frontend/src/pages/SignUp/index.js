import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const { signUp } = useAuth();

  const handleBirthDateChange = (text) => {
    let formattedText = text.replace(/\D/g, ''); // Remove todos os não-dígitos

    if (formattedText.length > 2) {
      formattedText = formattedText.substring(0, 2) + '/' + formattedText.substring(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.substring(0, 5) + '/' + formattedText.substring(5);
    }
    if (formattedText.length > 10) {
      formattedText = formattedText.substring(0, 10);
    }
    setBirthDate(formattedText);
  };

  async function handleSignUp() {
    try {
      // Validações
      if (!name || !email || !password || !confirmPassword || !birthDate) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não conferem');
        return;
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        Alert.alert('Erro', 'Insira um email válido');
        return;
      }

      // Validação do formato da data e conversão para YYYY-MM-DD para o backend
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
        Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA.');
        return;
      }
      const [day, month, year] = birthDate.split('/');
      const formattedBirthDateForBackend = `${year}-${month}-${day}`;

      await signUp(name, email, password, confirmPassword, formattedBirthDateForBackend);
    } catch (error) {
      // Modificação para extrair a mensagem de erro da resposta da API
      let errorMessage = 'Ocorreu um erro ao tentar criar a conta.';
      if (error.response && error.response.data && (error.response.data.error || error.response.data.message)) {
        errorMessage = error.response.data.error || error.response.data.message;
      }
      Alert.alert('Erro no Cadastro', errorMessage);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={birthDate}
          onChangeText={handleBirthDateChange}
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="*****"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="*****"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
}); 