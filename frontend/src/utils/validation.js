// Validações básicas
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Validação de data
export const validateDate = (day, month, year) => {
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  
  return true;
};

export const validateBirthDate = (birthDate) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    return { isValid: false, message: 'Data deve estar no formato DD/MM/AAAA' };
  }

  const [day, month, year] = birthDate.split('/').map(Number);
  
  if (!validateDate(day, month, year)) {
    return { isValid: false, message: 'Data inválida' };
  }

  const birthDateObj = new Date(year, month - 1, day);
  const today = new Date();
  
  if (birthDateObj > today) {
    return { isValid: false, message: 'Data de nascimento não pode ser no futuro' };
  }

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  if (age < 13) {
    return { isValid: false, message: 'Você deve ter pelo menos 13 anos' };
  }

  return { isValid: true };
};

// Validações de mês
export const validateReferenceMonth = (referenceMonth) => {
  if (!/^\d{4}-\d{2}$/.test(referenceMonth)) {
    return { isValid: false, message: 'Formato de mês inválido. Use YYYY-MM.' };
  }

  const [year, month] = referenceMonth.split('-').map(Number);
  
  if (month < 1 || month > 12) {
    return { isValid: false, message: 'Mês inválido. Deve ser entre 01 e 12.' };
  }

  const currentYear = new Date().getFullYear();
  if (year < currentYear || year > currentYear + 10) {
    return { isValid: false, message: 'Ano inválido.' };
  }

  return { isValid: true };
};

export const validateNotPastMonth = (referenceMonth) => {
  const [year, month] = referenceMonth.split('-').map(Number);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, message: 'Não é possível criar registros para meses anteriores ao mês corrente.' };
  }

  return { isValid: true };
};

// Validações de valor
export const validateValue = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue) || numericValue <= 0) {
    return { isValid: false, message: 'O valor deve ser maior que zero.' };
  }
  return { isValid: true };
};

export const validateExpenseDescription = (description) => {
  return description && description.trim().length >= 3 && description.trim().length <= 100;
};

export const validateExpenseValue = (value) => {
  return value && value > 0;
};

export const validateLimitValue = (value) => {
  return value && value > 0;
};

// Validação de campos obrigatórios
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} é obrigatório.` };
  }
  return { isValid: true };
}; 