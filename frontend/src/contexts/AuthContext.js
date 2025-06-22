import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp } from '../services/userService';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        console.log('=== CARREGANDO DADOS DO STORAGE ===');
        const token = await AsyncStorage.getItem('@MyEconomy:token');
        const userData = await AsyncStorage.getItem('@MyEconomy:user');

        console.log('Token encontrado:', token ? 'Sim' : 'Não');
        console.log('Dados do usuário encontrados:', userData ? 'Sim' : 'Não');

        if (token && userData) {
          console.log('Usuário já logado, configurando API...');
          api.defaults.headers.Authorization = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        } else {
          console.log('Nenhum usuário logado, limpando estado...');
          // Se não houver token ou dados do usuário, limpa o estado
          setUser(null);
          delete api.defaults.headers.Authorization;
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
        // Em caso de erro, limpa o estado
        setUser(null);
        delete api.defaults.headers.Authorization;
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      const response = await signIn({ email, password });
      const { token, user: userData } = response;

      await AsyncStorage.setItem('@MyEconomy:token', token);
      await AsyncStorage.setItem('@MyEconomy:user', JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSignUp = async (name, email, password, confirmPassword, birthDate) => {
    try {
      console.log('=== AUTH CONTEXT - SIGNUP ===');
      console.log('Parâmetros recebidos:', { name, email, password, confirmPassword, birthDate });
      
      const userData = {
        name,
        email,
        password,
        confirmPassword,
        birthDate,
      };
      
      console.log('Dados que serão enviados para o serviço:', userData);
      
      const response = await signUp(userData);
      console.log('Resposta do signUp service:', response);

      const { token, user: userDataFromResponse } = response;
      console.log('Token extraído:', token ? 'Token presente' : 'Token ausente');
      console.log('Dados do usuário extraídos:', userDataFromResponse);

      await AsyncStorage.setItem('@MyEconomy:token', token);
      await AsyncStorage.setItem('@MyEconomy:user', JSON.stringify(userDataFromResponse));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userDataFromResponse);
      
      console.log('=== SIGNUP CONCLUÍDO COM SUCESSO ===');
    } catch (error) {
      console.error('=== ERRO NO AUTH CONTEXT - SIGNUP ===');
      console.error('Erro capturado:', error);
      throw new Error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('=== INICIANDO LOGOUT ===');
      await AsyncStorage.removeItem('@MyEconomy:token');
      console.log('Token removido do storage.');
      await AsyncStorage.removeItem('@MyEconomy:user');
      console.log('Dados do usuário removidos do storage.');
      
      setUser(null);
      console.log('Estado do usuário definido como null.');
      
      delete api.defaults.headers.Authorization;
      console.log('Header de autorização removido da API.');
      console.log('=== LOGOUT CONCLUÍDO COM SUCESSO ===');
    } catch (error) {
      console.error('=== ERRO NO LOGOUT ===');
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  };

  const clearStorageData = async () => {
    try {
      console.log('=== LIMPANDO DADOS DO STORAGE ===');
      await AsyncStorage.removeItem('@MyEconomy:token');
      await AsyncStorage.removeItem('@MyEconomy:user');
      setUser(null);
      delete api.defaults.headers.Authorization;
      console.log('Dados do storage limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados do storage:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        clearStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 