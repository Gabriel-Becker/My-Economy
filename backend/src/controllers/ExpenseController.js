const { Op } = require('sequelize');
const Expense = require('../models/Expense');

class ExpenseController {
  async store(req, res) {
    try {
      const { description, value, referenceMonth } = req.body;
      const userId = req.userId;

      // Validação dos campos obrigatórios
      if (!description || !value || !referenceMonth) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      const expense = await Expense.create({
        description,
        value,
        referenceMonth,
        userId,
      });

      return res.json(expense);
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao criar despesa' });
    }
  }

  async index(req, res) {
    try {
      const { referenceMonth } = req.query;
      const userId = req.userId;

      const expenses = await Expense.findAll({
        where: {
          userId,
          referenceMonth: referenceMonth || new Date().toISOString().slice(0, 7),
        },
        order: [['createdAt', 'DESC']],
      });

      return res.json(expenses);
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao buscar despesas' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { description, value, referenceMonth } = req.body;
      const userId = req.userId;

      const expense = await Expense.findOne({
        where: { id, userId },
      });

      if (!expense) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }

      // Verifica se a despesa é do mês atual ou futuro
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const [year, month] = expense.referenceMonth.split('-').map(Number);

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return res.status(400).json({ 
          error: 'Não é possível editar despesas de meses anteriores' 
        });
      }

      await expense.update({
        description,
        value,
        referenceMonth,
      });

      return res.json(expense);
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao atualizar despesa' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const expense = await Expense.findOne({
        where: { id, userId },
      });

      if (!expense) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }

      // Verifica se a despesa é do mês atual ou futuro
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const [year, month] = expense.referenceMonth.split('-').map(Number);

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return res.status(400).json({ 
          error: 'Não é possível excluir despesas de meses anteriores' 
        });
      }

      await expense.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: 'Falha ao excluir despesa' });
    }
  }
}

module.exports = new ExpenseController(); 