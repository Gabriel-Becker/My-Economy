const MonthlyLimit = require('../models/MonthlyLimit');

const validateMonthlyLimit = async (req, res, next) => {
  try {
    const { referenceMonth } = req.body;
    const userId = req.userId;

    // Verifica se já existe um limite para o mês
    const existingLimit = await MonthlyLimit.findOne({
      where: {
        userId,
        referenceMonth
      }
    });

    if (existingLimit) {
      return res.status(400).json({ 
        error: 'Já existe um limite cadastrado para este mês' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao validar limite mensal' });
  }
};

module.exports = validateMonthlyLimit; 