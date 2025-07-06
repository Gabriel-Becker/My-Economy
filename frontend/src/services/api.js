import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAxiosConfig } from '../config/api';

const api = axios.create(getAxiosConfig());

// Interceptor para requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@MyEconomy:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 