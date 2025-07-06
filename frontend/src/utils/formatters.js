// Formatação de moeda
export const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  
  const number = typeof value === 'string' 
    ? parseInt(value.replace(/[^0-9]/g, ''), 10) / 100 
    : value;
    
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

// Formatação de data
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

export const formatBirthDate = (birthDate) => {
  if (!birthDate) return '';
  
  const dateObj = new Date(birthDate);
  return dateObj.toLocaleDateString('pt-BR');
};

export const formatMonthYear = (date, locale = 'pt-BR') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

// Formatação de valor para exibição
export const formatDisplayValue = (value) => {
  if (!value) return 'R$ 0,00';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
};

// Formatação para inputs
export const formatDateForInput = (text) => {
  let formattedText = text.replace(/\D/g, '');

  if (formattedText.length > 2) {
    formattedText = formattedText.substring(0, 2) + '/' + formattedText.substring(2);
  }
  if (formattedText.length > 5) {
    formattedText = formattedText.substring(0, 5) + '/' + formattedText.substring(5);
  }
  if (formattedText.length > 10) {
    formattedText = formattedText.substring(0, 10);
  }
  
  return formattedText;
};

export const formatValueForInput = (text) => {
  return text.replace(/[^0-9]/g, '');
};

export const formatDateForBackend = (birthDate) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return '';
  
  const [day, month, year] = birthDate.split('/');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}; 