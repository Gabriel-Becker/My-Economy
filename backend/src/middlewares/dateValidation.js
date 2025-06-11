const validateDate = (req, res, next) => {
  const { referenceMonth } = req.body;
  
  if (!referenceMonth) {
    return res.status(400).json({ error: 'Mês de referência é obrigatório' });
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [year, month] = referenceMonth.split('-').map(Number);

  // Verifica se a data é anterior ao mês atual
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return res.status(400).json({ 
      error: 'Não é possível criar registros para meses anteriores ao mês corrente' 
    });
  }

  next();
};

module.exports = validateDate; 