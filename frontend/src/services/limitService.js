import api from './api';

export const getLimit = async (referenceMonth) => {
  try {
    const response = await api.get(`/limites${referenceMonth ? `?referenceMonth=${referenceMonth}` : ''}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar limite');
  }
};

export const createLimit = async (limit) => {
  try {
    const response = await api.post('/limites', limit);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar limite');
  }
};

export const updateLimit = async (id, limit) => {
  try {
    const response = await api.put(`/limites/${id}`, limit);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar limite');
  }
};

export const deleteLimit = async (id) => {
  try {
    await api.delete(`/limites/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao excluir limite');
  }
}; 