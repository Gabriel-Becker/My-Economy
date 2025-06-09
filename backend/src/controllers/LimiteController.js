import { Limite } from '../models/Limite.js';

export class LimiteController {
  static async create(req, res) {
    try {
      const { valor, mes, ano } = req.body;
      const novoLimite = await Limite.create(valor, mes, ano, req.userId);
      res.status(201).send(novoLimite);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async list(req, res) {
    try {
      const { mes, ano } = req.query;
      const limites = await Limite.findByUsuarioMesAno(req.userId, mes, ano);
      
      if (limites) {
        limites.valor = parseFloat(limites.valor);
      }
      
      res.send([limites]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { valor, mes, ano } = req.body;
      
      const limite = await Limite.update(id, valor, mes, ano, req.userId);
      res.send(limite);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const limite = await Limite.delete(id);
      res.send(limite);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 