import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { format } from 'date-fns';
import { createExpense, updateExpense } from '../../services/expenseService';

// Função para formatar o valor como moeda
const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  const amount = parseInt(value, 10) / 100;
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export default function NewExpense({ navigation, route }) {
  const [id, setId] = useState(null);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(''); // Armazenará apenas os dígitos
  const [referenceMonth, setReferenceMonth] = useState(
    route.params?.referenceMonth || format(new Date(), 'yyyy-MM')
  );
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  useEffect(() => {
    if (route.params?.expense) {
      const { expense } = route.params;
      setId(expense.ID);
      setDescription(expense.DESCRICAO);
      const valueInCents = String(expense.VALOR * 100);
      setValue(valueInCents.replace(/\D/g, ''));
      // Constrói o mês de referência a partir de ANO e MES
      const reference = `${expense.ANO}-${String(expense.MES).padStart(2, '0')}`;
      setReferenceMonth(reference);
      navigation.setOptions({ title: 'Editar Despesa' });
    } else {
      navigation.setOptions({ title: 'Nova Despesa' });
    }
  }, [route.params?.expense, navigation]);
  
  const handleValueChange = (text) => {
    const onlyDigits = text.replace(/\D/g, '');
    setValue(onlyDigits);
  };

  function showToast(message, type = 'error') {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type }), 3000);
  }

  async function handleSubmit() {
    try {
      if (!description || value === '' || !referenceMonth) {
        showToast('Preencha todos os campos obrigatórios.');
        return;
      }

      const currentDate = new Date();
      const [year, month] = referenceMonth.split('-').map(Number);

      // Basic validation for month/year (Backend will also validate)
      if (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month < (currentDate.getMonth() + 1))) {
        showToast('Não é possível cadastrar despesas para meses anteriores.');
        return;
      }

      const numericValue = parseInt(value, 10) / 100;
      if (isNaN(numericValue) || numericValue <= 0) {
        showToast('O valor deve ser maior que zero.');
        return;
      }

      const expenseData = {
        description,
        value: numericValue,
        referenceMonth,
      };

      if (id) {
        await updateExpense(id, expenseData);
        showToast('Despesa atualizada com sucesso!', 'success');
      } else {
        await createExpense(expenseData);
        showToast('Despesa cadastrada com sucesso!', 'success');
      }
      setTimeout(() => navigation.goBack(), 1200);
    } catch (error) {
      console.log('Erro ao salvar despesa:', error);
      showToast(error.message || 'Erro ao salvar despesa');
    }
  }

  return (
    <View style={styles.container}>
      {/* Toast */}
      {toast.visible && (
        <View style={[styles.toast, toast.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

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
          value={formatCurrency(value)}
          onChangeText={handleValueChange}
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
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 999,
  },
  toastError: {
    backgroundColor: '#dc3545',
  },
  toastSuccess: {
    backgroundColor: '#28a745',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 