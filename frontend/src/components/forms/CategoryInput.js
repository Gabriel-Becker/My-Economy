import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const categories = [
  { id: 'Geral', label: 'Geral', icon: 'category' },
  { id: 'Alimentação', label: 'Alimentação', icon: 'restaurant' },
  { id: 'Moradia', label: 'Moradia', icon: 'home' },
  { id: 'Transporte', label: 'Transporte', icon: 'directions-car' },
  { id: 'Saúde', label: 'Saúde', icon: 'local-hospital' },
  { id: 'Educação', label: 'Educação', icon: 'school' },
  { id: 'Serviços', label: 'Serviços', icon: 'build' },
  { id: 'Tecnologia', label: 'Tecnologia', icon: 'devices' },
  { id: 'Vestuário', label: 'Vestuário', icon: 'checkroom' },
  { id: 'Lazer', label: 'Lazer', icon: 'sports-esports' },
  { id: 'Pets', label: 'Pets', icon: 'pets' },
  { id: 'Viagem', label: 'Viagem', icon: 'flight' },
  { id: 'Impostos', label: 'Impostos', icon: 'account-balance' },
  { id: 'Doações', label: 'Doações', icon: 'volunteer-activism' },
  { id: 'Outros', label: 'Outros', icon: 'more-horiz' },
];

const CategoryInput = ({ label, value, onChangeText, placeholder, error, style }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedCategory = categories.find(cat => cat.id === value) || categories[0];

  const handleCategorySelect = (category) => {
    onChangeText(category.id);
    setIsModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.inputContent}>
          <Icon name={selectedCategory.icon} size={20} color={COLORS.PRIMARY} />
          <Text style={styles.inputText}>
            {selectedCategory.label}
          </Text>
        </View>
        <Icon name="arrow-drop-down" size={24} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Categoria</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    value === category.id && styles.selectedCategory
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Icon
                    name={category.icon}
                    size={20}
                    color={value === category.id ? COLORS.WHITE : COLORS.PRIMARY}
                  />
                  <Text style={[
                    styles.categoryText,
                    value === category.id && styles.selectedCategoryText
                  ]}>
                    {category.label}
                  </Text>
                  {value === category.id && (
                    <Icon name="check" size={20} color={COLORS.WHITE} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.SPACING_MD,
  },
  label: {
    fontSize: SIZES.FONT_MD,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.SPACING_SM,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SIZES.BORDER_RADIUS_MD,
    paddingHorizontal: SIZES.SPACING_MD,
    paddingVertical: SIZES.SPACING_SM,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.DANGER,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SIZES.SPACING_SM,
    flex: 1,
  },
  errorText: {
    fontSize: SIZES.FONT_SM,
    color: COLORS.DANGER,
    marginTop: SIZES.SPACING_XS,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: SIZES.BORDER_RADIUS_LG,
    borderTopRightRadius: SIZES.BORDER_RADIUS_LG,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.SPACING_LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: SIZES.FONT_LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  categoryList: {
    padding: SIZES.SPACING_MD,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.SPACING_MD,
    borderRadius: SIZES.BORDER_RADIUS_MD,
    marginBottom: SIZES.SPACING_SM,
  },
  selectedCategory: {
    backgroundColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: SIZES.FONT_MD,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SIZES.SPACING_SM,
    flex: 1,
  },
  selectedCategoryText: {
    color: COLORS.WHITE,
    fontWeight: '500',
  },
});

export default CategoryInput; 