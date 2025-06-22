import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { format } from 'date-fns';
import { createLimit, updateLimit } from '../../services/limitService';

// Função para formatar o valor como moeda
const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  const number = parseInt(value.replace(/[^0-9]/g, ''), 10) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

export default function MonthlyLimit({ navigation, route }) {
  const [id, setId] = useState(null);
  // O estado 'value' agora armazena apenas os dígitos, como "12345" para R$ 123,45
  const [value, setValue] = useState('');
  const [referenceMonth, setReferenceMonth] = useState(
    format(new Date(), 'yyyy-MM')
  );

  useEffect(() => {
    if (route.params?.limit) {
      const { limit } = route.params;
      setId(limit.ID || limit.id);
      // Converte o valor numérico para uma string de dígitos para o estado
      setValue(String(parseFloat(limit.VALOR || limit.value) * 100));
      setReferenceMonth(format(new Date(limit.ANO, limit.MES - 1), 'yyyy-MM'));
      navigation.setOptions({ title: 'Editar Limite' });
    } else {
      navigation.setOptions({ title: 'Definir Limite Mensal' });
    }
  }, [route.params?.limit, navigation]);

  const handleValueChange = (text) => {
    // Remove tudo que não for dígito
    const cleaned = text.replace(/[^0-9]/g, '');
    setValue(cleaned);
  };

  async function handleSubmit() {
    try {
      if (!value || !referenceMonth) {
        Alert.alert('Erro', 'O campo de valor é obrigatório.');
        return;
      }

      // Converte a string de dígitos para um número de ponto flutuante
      const numericValue = parseInt(value, 10) / 100;

      if (numericValue <= 0) {
        Alert.alert('Erro', 'O valor do limite deve ser maior que zero.');
        return;
      }
      
      const [year, month] = referenceMonth.split('-').map(Number);
      
      const limitData = {
        valor: numericValue,
        mes: month,
        ano: year,
      };

      if (id) {
        await updateLimit(id, limitData);
        Alert.alert('Sucesso', 'Limite atualizado com sucesso!');
      } else {
        await createLimit(limitData);
        Alert.alert('Sucesso', 'Limite mensal cadastrado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao salvar o limite.';
      Alert.alert('Erro', errorMessage);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Limite' : 'Definir Limite Mensal'}</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={formatCurrency(value)} // Mostra o valor formatado
          onChangeText={handleValueChange} // Usa a função de limpeza e atualização
        />

        <Text style={styles.label}>Mês de Referência</Text>
        <TextInput
          style={styles.input}
          value={referenceMonth}
          onChangeText={setReferenceMonth}
          // Idealmente, usar um DatePicker aqui, mas por simplicidade mantemos o TextInput
          editable={!id} // Não permite editar o mês de um limite existente
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
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
    backgroundColor: '#fff',
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
  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 