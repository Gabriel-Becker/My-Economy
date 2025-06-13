import api from './api';

export const getExpenses = async (referenceMonth) => {
  try {
    const response = await api.get(`/despesas${referenceMonth ? `?referenceMonth=${referenceMonth}` : ''}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar despesas');
  }
};

export const createExpense = async (expense) => {
  try {
    const response = await api.post('/despesas', expense);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar despesa');
  }
};

export const updateExpense = async (id, expense) => {
  try {
    const response = await api.put(`/despesas/${id}`, expense);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar despesa');
  }
};

export const deleteExpense = async (id) => {
  try {
    await api.delete(`/despesas/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao excluir despesa');
  }
}; 