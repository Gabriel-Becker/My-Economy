import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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

function LogoutTabButton(props) {
  const { signOut } = useAuth();
  return (
    <TouchableOpacity
      {...props}
      onPress={() => {
        Alert.alert(
          'Sair',
          'Tem certeza que deseja sair?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', onPress: signOut },
          ],
          { cancelable: false }
        );
      }}
    >
      {props.children}
    </TouchableOpacity>
  );
}

function AppRoutes() {
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
        component={() => null} // Componente vazio, a ação está no tabBarButton
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="exit-to-app" size={24} color={color} />
          ),
          tabBarButton: (props) => <LogoutTabButton {...props} />,
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
}); 