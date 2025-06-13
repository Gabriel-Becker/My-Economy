import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para requisições
api.interceptors.request.use(async (config) => {
  console.log('Requisição sendo enviada:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    data: config.data
  });
  
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
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api; 