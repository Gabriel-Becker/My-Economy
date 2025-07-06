import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getUser } from '../../services/userService';
import { COLORS, SIZES } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatBirthDate } from '../../utils/formatters';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setUserData(user);
      const response = await getUser();
      setUserData(response);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao carregar dados do usuário';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados do usuário</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Dados</Text>
      </View>

      <Card>
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
            {userData.birthDate ? formatBirthDate(userData.birthDate) : 'Não informado'}
          </Text>
        </View>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          title="Sair da Conta"
          onPress={() => navigation.navigate('Logout')}
          variant="danger"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.SPACING_LG,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: SIZES.SPACING_LG,
    borderRadius: SIZES.BORDER_RADIUS_LG,
    marginBottom: SIZES.SPACING_LG,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: SIZES.FONT_XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  field: {
    marginBottom: SIZES.SPACING_LG,
  },
  label: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SIZES.SPACING_XS,
  },
  value: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: SIZES.SPACING_XL,
  },
  logoutButton: {
    marginTop: SIZES.SPACING_LG,
  },
  errorText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginTop: SIZES.SPACING_XL,
  },
});

export default ProfileScreen; 