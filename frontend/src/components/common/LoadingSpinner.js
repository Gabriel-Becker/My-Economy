import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COLORS.PRIMARY,
  text = 'Carregando...',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.SPACING_XL,
  },
  text: {
    marginTop: SIZES.SPACING_MD,
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default LoadingSpinner; 