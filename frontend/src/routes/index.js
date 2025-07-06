import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

// Importando as telas refatoradas
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ExpenseFormScreen from '../screens/expenses/ExpenseFormScreen';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import LimitFormScreen from '../screens/limits/LimitFormScreen';
import LimitListScreen from '../screens/limits/LimitListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
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
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Despesas"
        component={ExpenseListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="receipt" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Limites"
        component={LimitListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="attach-money" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
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
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
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
            <Stack.Screen name="SignIn" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="App" component={AppRoutes} />
            <Stack.Screen name="NewExpense" component={ExpenseFormScreen} />
            <Stack.Screen name="MonthlyLimit" component={LimitFormScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
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
    backgroundColor: COLORS.BACKGROUND,
  },
}); 