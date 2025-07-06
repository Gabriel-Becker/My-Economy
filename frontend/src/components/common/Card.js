import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Card = ({ 
  children, 
  variant = 'default',
  style,
  ...props 
}) => {
  const cardStyle = [
    styles.card,
    styles[variant],
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_LG,
    padding: SIZES.CARD_PADDING,
    margin: SIZES.SPACING_LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Variantes
  default: {
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  success: {
    backgroundColor: '#d4edda',
  },
  warning: {
    backgroundColor: '#f8d7da',
  },
  info: {
    backgroundColor: '#f0f0f0',
  },
});

export default Card; 