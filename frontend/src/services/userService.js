import api from './api';

export const signUp = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar conta');
  }
};

export const signIn = async (credentials) => {
  try {
    const loginData = {
      email: credentials.email,
      senha: credentials.password
    };
    
    const response = await api.post('/login', loginData);
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