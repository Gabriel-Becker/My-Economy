import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: COLORS.WHITE, borderless: false }}
      {...props}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.BORDER_RADIUS_SM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: COLORS.SECONDARY,
  },
  danger: {
    backgroundColor: COLORS.DANGER,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  
  small: {
    paddingVertical: SIZES.SPACING_SM,
    paddingHorizontal: SIZES.SPACING_MD,
    minHeight: 40,
  },
  medium: {
    paddingVertical: SIZES.SPACING_MD,
    paddingHorizontal: SIZES.SPACING_LG,
    minHeight: SIZES.BUTTON_HEIGHT,
  },
  large: {
    paddingVertical: SIZES.SPACING_LG,
    paddingHorizontal: SIZES.SPACING_XL,
    minHeight: 60,
  },
  
  disabled: {
    backgroundColor: COLORS.GRAY,
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  text: {
    fontWeight: 'bold',
  },
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.WHITE,
  },
  dangerText: {
    color: COLORS.WHITE,
  },
  outlineText: {
    color: COLORS.PRIMARY,
  },
  
  smallText: {
    fontSize: SIZES.FONT_SM,
  },
  mediumText: {
    fontSize: SIZES.FONT_MD,
  },
  largeText: {
    fontSize: SIZES.FONT_LG,
  },
  
  disabledText: {
    color: COLORS.TEXT_LIGHT,
  },
});

export default Button; 