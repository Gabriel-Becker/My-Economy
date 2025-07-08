import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getUser } from '../../services/userService';
import { COLORS, SIZES } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatBirthDate } from '../../utils/formatters';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

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

  const handleEditProfile = () => {
    setShowEditModal(true);
    setEditSuccess(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setTimeout(() => {
      setLogoutLoading(false);
      navigation.navigate('Logout');
    }, 1000);
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

  // Avatar com iniciais
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Dados</Text>
      </View>

      <Card style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(userData.name)}</Text>
          </View>
        </View>
        {/* Campos do perfil */}
        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={[styles.value, { color: COLORS.PRIMARY }]}>{userData.email}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.field}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <Text style={styles.value}>
            {userData.birthDate ? formatBirthDate(userData.birthDate) : 'Não informado'}
          </Text>
        </View>
        {/* Botão Sair da Conta */}
        <Button
          title={logoutLoading ? 'Saindo...' : 'Sair da Conta'}
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
          disabled={logoutLoading}
        >
          {logoutLoading && <ActivityIndicator color={COLORS.WHITE} style={{ marginLeft: 8 }} />}
        </Button>
      </Card>
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
  profileCard: {
    padding: SIZES.SPACING_XL,
    borderRadius: SIZES.BORDER_RADIUS_LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: COLORS.WHITE,
    marginBottom: SIZES.SPACING_XL,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SIZES.SPACING_LG,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: COLORS.WHITE,
    fontSize: 32,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: SIZES.SPACING_MD,
    width: '100%',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SIZES.SPACING_XS,
    fontWeight: '500',
  },
  value: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SIZES.SPACING_SM,
    opacity: 0.5,
  },
  logoutButton: {
    marginTop: 0,
    width: '100%',
  },
  actionsContainer: {
    marginTop: SIZES.SPACING_XL,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS_LG,
    padding: SIZES.SPACING_XL,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_MD,
  },
  modalText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SIZES.SPACING_MD,
  },
  successText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.SUCCESS,
    textAlign: 'center',
    marginBottom: SIZES.SPACING_MD,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginTop: SIZES.SPACING_XL,
  },
});

export default ProfileScreen; 