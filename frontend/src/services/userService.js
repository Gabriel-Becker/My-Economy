import api from './api';

export const signUp = async (userData) => {
  try {
    console.log('Tentando criar usuário com dados:', userData);
    const response = await api.post('/users', userData);
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });
    throw new Error(error.response?.data?.error || 'Erro ao criar conta');
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao fazer login');
  }
};

export const getUser = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar usuário');
  }
}; 