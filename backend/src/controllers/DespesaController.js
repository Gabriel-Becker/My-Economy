import { Despesa } from '../models/Despesa.js';

export class DespesaController {
  static async create(req, res) {
    try {
      const { descricao, valor, mes, ano, icone } = req.body;
      const novoDespesa = await Despesa.create(
        descricao,
        valor,
        mes,
        ano,
        req.userId,
        icone
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
      const { descricao, valor, mes, ano, icone } = req.body;
      
      const despesa = await Despesa.update(
        id,
        descricao,
        valor,
        mes,
        ano,
        req.userId,
        icone
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