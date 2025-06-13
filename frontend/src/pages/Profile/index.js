import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { getUser } from '../../services/userService';

export default function Profile({ navigation }) {
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const response = await getUser();
      setUserData(response);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao carregar dados do usuário');
    }
  }

  function handleSignOut() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => signOut(),
        },
      ],
      { cancelable: false }
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Dados</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <Text style={styles.value}>
            {format(new Date(userData.birthDate), 'dd/MM/yyyy')}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
}); 