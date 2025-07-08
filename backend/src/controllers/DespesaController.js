import { Despesa } from '../models/Despesa.js';

export class DespesaController {
  static async create(req, res) {
    try {
      const { description, value, referenceMonth, category } = req.body;
      
      // Extrair mês e ano do referenceMonth (formato: YYYY-MM)
      const [ano, mes] = referenceMonth.split('-').map(Number);
      
      const novoDespesa = await Despesa.create(
        description, // descricao
        value, // valor
        mes,
        ano,
        req.userId,
        null, // icone (opcional)
        category || '' // categoria (opcional)
      );
      res.status(201).send(novoDespesa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async list(req, res) {
    try {
      const { mes, ano } = req.query;
      let despesas;

      if (!mes && !ano) {
        despesas = await Despesa.findByUsuario(req.userId);
      } else {
        despesas = await Despesa.findByUsuarioMesAno(req.userId, mes, ano);
      }

      despesas.forEach(despesa => {
        despesa.valor = parseFloat(despesa.valor);
      });

      res.send(despesas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      // Aceita tanto os nomes de campos antigos quanto os novos para maior robustez
      const description = req.body.description || req.body.descricao;
      const value = req.body.value !== undefined ? req.body.value : req.body.valor;
      const { referenceMonth, icone, category } = req.body;

      if (description === undefined || value === undefined || referenceMonth === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes (description, value, referenceMonth).' });
      }
      
      const [ano, mes] = referenceMonth.split('-').map(Number);
      
      const despesa = await Despesa.update(
        id,
        description,
        value,
        mes,
        ano,
        req.userId,
        icone,
        category || '' // categoria (opcional)
      );
      res.send(despesa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const despesa = await Despesa.delete(id);
      res.send(despesa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTotal(req, res) {
    try {
      const { mes, ano } = req.query;
      let total = await Despesa.getValorTotal(mes, ano, req.userId);
      
      if (!total) {
        total = { TOTAL: 0 };
      }
      
      total.TOTAL = parseFloat(total.TOTAL);
      res.send(total);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 