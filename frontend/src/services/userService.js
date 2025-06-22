import api from './api';

export const signUp = async (userData) => {
  try {
    console.log('=== DEBUG SIGNUP ===');
    console.log('Dados recebidos para signup:', userData);
    console.log('URL da requisição:', `${api.defaults.baseURL}/users`);
    console.log('Método:', 'POST');
    
    const response = await api.post('/users', userData);
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERRO NO SIGNUP ===');
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
    console.log('=== DEBUG SIGNIN ===');
    console.log('Credenciais recebidas:', credentials);
    console.log('URL da requisição:', `${api.defaults.baseURL}/login`);
    console.log('Método:', 'POST');
    
    // Converter password para senha para compatibilidade com o backend
    const loginData = {
      email: credentials.email,
      senha: credentials.password
    };
    
    console.log('Dados convertidos para login:', loginData);
    
    const response = await api.post('/login', loginData);
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERRO NO SIGNIN ===');
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
    throw new Error(error.response?.data?.error || 'Erro ao fazer login');
  }
};

export const getUser = async () => {
  try {
    console.log('=== DEBUG GET USER ===');
    console.log('URL da requisição:', `${api.defaults.baseURL}/users`);
    console.log('Método:', 'GET');
    
    const response = await api.get('/users');
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERRO NO GET USER ===');
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
    throw new Error(error.response?.data?.error || 'Erro ao buscar usuário');
  }
}; 