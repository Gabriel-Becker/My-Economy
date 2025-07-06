export const validateDate = (req, res, next) => {
  const { mes, ano } = req.body;
  
  if (!mes || !ano) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const month = parseInt(mes, 10);
  const year = parseInt(ano, 10);

  // Verifica se a data é anterior ao mês atual
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return res.status(400).json({ 
      error: 'Não é possível criar registros para meses anteriores ao mês corrente' 
    });
  }

  next();
}; 