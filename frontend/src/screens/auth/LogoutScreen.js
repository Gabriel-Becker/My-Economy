import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../constants';
import Button from '../../components/common/Button';

const LogoutScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sair da Conta</Text>
      <Text style={styles.message}>
        Você tem certeza que deseja encerrar a sessão?
      </Text>
      
      <Button
        title="Sim, Sair"
        onPress={signOut}
        variant="danger"
        style={styles.button}
      />
      
      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SIZES.SPACING_LG,
  },
  title: {
    fontSize: SIZES.FONT_XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_MD,
  },
  message: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SIZES.SPACING_XL,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    maxWidth: SIZES.CONTAINER_MAX_WIDTH,
    marginBottom: SIZES.SPACING_MD,
  },
});

export default LogoutScreen; 