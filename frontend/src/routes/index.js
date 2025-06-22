import React, { useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import NewExpense from '../pages/NewExpense';
import MonthlyLimit from '../pages/MonthlyLimit';
import ExpenseList from '../pages/ExpenseList';
import LimitList from '../pages/LimitList';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. A tela de Logout agora é uma tela de confirmação visível
function LogoutScreen({ navigation }) {
  const { signOut } = useAuth();

  return (
    <View style={styles.confirmationContainer}>
      <Text style={styles.confirmationTitle}>Sair da Conta</Text>
      <Text style={styles.confirmationText}>
        Você tem certeza que deseja encerrar a sessão?
      </Text>
      
      <TouchableOpacity 
        style={[styles.confirmationButton, styles.confirmButton]} 
        onPress={signOut}
      >
        <Text style={styles.confirmationButtonText}>Sim, Sair</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.confirmationButton, styles.cancelButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.confirmationButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppRoutes() {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Despesas"
        component={ExpenseList}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="receipt" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Limites"
        component={LimitList}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="attach-money" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sair"
        component={LogoutScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="exit-to-app" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={signed ? "App" : "SignIn"}
      >
        {!signed ? (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <>
            <Stack.Screen name="App" component={AppRoutes} />
            <Stack.Screen name="NewExpense" component={NewExpense} />
            <Stack.Screen name="MonthlyLimit" component={MonthlyLimit} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  // Estilos para a nova tela de confirmação
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  confirmationButton: {
    width: '100%',
    maxWidth: 300,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 