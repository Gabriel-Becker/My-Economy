import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp } from '../services/userService';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('@MyEconomy:token');
      const userData = await AsyncStorage.getItem('@MyEconomy:user');

      if (token && userData) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
        delete api.defaults.headers.Authorization;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
      setUser(null);
      delete api.defaults.headers.Authorization;
    } finally {
      setLoading(false);
    }
  };

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
      const userData = {
        name,
        email,
        password,
        confirmPassword,
        birthDate,
      };
      
      const response = await signUp(userData);
      const { token, user: userDataFromResponse } = response;

      await AsyncStorage.setItem('@MyEconomy:token', token);
      await AsyncStorage.setItem('@MyEconomy:user', JSON.stringify(userDataFromResponse));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userDataFromResponse);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('@MyEconomy:token');
      await AsyncStorage.removeItem('@MyEconomy:user');
      
      setUser(null);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  };

  const clearStorageData = async () => {
    try {
      await AsyncStorage.removeItem('@MyEconomy:token');
      await AsyncStorage.removeItem('@MyEconomy:user');
      setUser(null);
      delete api.defaults.headers.Authorization;
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