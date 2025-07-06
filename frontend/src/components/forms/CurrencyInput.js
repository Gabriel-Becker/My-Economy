import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency, formatValueForInput } from '../../utils/formatters';

const CurrencyInput = ({
  label,
  value,
  onChangeText,
  placeholder = 'R$ 0,00',
  error,
  style,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const handleValueChange = (text) => {
    const cleaned = formatValueForInput(text);
    onChangeText(cleaned);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        value={formatCurrency(value)}
        onChangeText={handleValueChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_LIGHT}
        keyboardType="numeric"
        numberOfLines={1}
        ellipsizeMode="tail"
        {...props}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.SPACING_MD,
  },
  label: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_XS,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_SM,
    padding: SIZES.SPACING_MD,
    fontSize: SIZES.FONT_MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minHeight: SIZES.INPUT_HEIGHT,
  },
  inputError: {
    borderColor: COLORS.DANGER,
  },
  errorText: {
    color: COLORS.DANGER,
    fontSize: SIZES.FONT_SM,
    marginTop: SIZES.SPACING_XS,
  },
});

export default CurrencyInput; 