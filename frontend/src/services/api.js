import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para requisições
api.interceptors.request.use(async (config) => {
  console.log('=== REQUISIÇÃO ENVIADA ===');
  console.log('URL completa:', `${config.baseURL}${config.url}`);
  console.log('Método:', config.method);
  console.log('Dados:', config.data);
  
  const token = await AsyncStorage.getItem('@MyEconomy:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Erro na requisição:', error);
  return Promise.reject(error);
});

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPOSTA RECEBIDA ===');
    console.log('Status:', response.status);
    console.log('Dados:', response.data);
    return response;
  },
  (error) => {
    console.error('=== ERRO NA RESPOSTA ===');
    console.error('Mensagem:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Dados do erro:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api; 