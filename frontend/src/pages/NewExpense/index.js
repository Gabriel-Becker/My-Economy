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
import { createExpense, updateExpense } from '../../services/expenseService';

export default function NewExpense({ navigation, route }) {
  const [id, setId] = useState(null);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [referenceMonth, setReferenceMonth] = useState(
    format(new Date(), 'yyyy-MM')
  );

  useEffect(() => {
    if (route.params?.expense) {
      const { expense } = route.params;
      setId(expense.id);
      setDescription(expense.description);
      setValue(String(expense.value)); // Convert to string for TextInput
      setReferenceMonth(expense.referenceMonth);
      navigation.setOptions({ title: 'Editar Despesa' });
    } else {
      navigation.setOptions({ title: 'Nova Despesa' });
    }
  }, [route.params?.expense, navigation]);

  async function handleSubmit() {
    try {
      if (!description || !value || !referenceMonth) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
      }

      const currentDate = new Date();
      const [year, month] = referenceMonth.split('-').map(Number);

      // Basic validation for month/year (Backend will also validate)
      if (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month < (currentDate.getMonth() + 1))) {
        Alert.alert('Erro', 'Não é possível cadastrar despesas para meses anteriores');
        return;
      }

      if (Number(value) <= 0) {
        Alert.alert('Erro', 'O valor deve ser maior que zero');
        return;
      }

      const expenseData = {
        description,
        value: Number(value),
        referenceMonth,
      };

      if (id) {
        await updateExpense(id, expenseData);
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso');
      } else {
        await createExpense(expenseData);
        Alert.alert('Sucesso', 'Despesa cadastrada com sucesso');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao salvar despesa');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Despesa' : 'Nova Despesa'}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição da despesa"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.label}>Mês de Referência</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM"
          value={referenceMonth}
          onChangeText={setReferenceMonth}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
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