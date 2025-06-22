import { Limite } from '../models/Limite.js';

export class LimiteController {
  static async create(req, res) {
    try {
      console.log('=== BACKEND - CREATE LIMIT ===');
      console.log('ID do Usuário:', req.userId);
      console.log('Dados recebidos (req.body):', req.body);

      const { valor, mes, ano } = req.body;

      if (valor === undefined || valor === null || isNaN(valor)) {
        console.error('Erro: Valor do limite é inválido ou ausente.');
        return res.status(400).json({ error: 'O valor do limite é inválido ou ausente.' });
      }

      const novoLimite = await Limite.create(valor, mes, ano, req.userId);
      console.log('Limite criado com sucesso:', novoLimite);
      res.status(201).send(novoLimite);
    } catch (error) {
      console.error('=== ERRO AO CRIAR LIMITE ===');
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async list(req, res) {
    try {
      console.log('=== BACKEND - LIST LIMIT ===');
      console.log('Query recebida:', req.query);

      const { referenceMonth } = req.query;
      if (!referenceMonth) {
        return res.status(400).json({ error: 'O parâmetro referenceMonth é obrigatório.' });
      }

      const [ano, mes] = referenceMonth.split('-').map(Number);
      console.log(`Buscando limite para: Usuario ID=${req.userId}, Mês=${mes}, Ano=${ano}`);

      const limite = await Limite.findByUsuarioMesAno(req.userId, mes, ano);
      
      if (limite) {
        console.log('Limite encontrado:', limite);
        limite.valor = parseFloat(limite.VALOR); // Ajustado para VALOR maiúsculo
      } else {
        console.log('Nenhum limite encontrado para o período.');
      }
      
      res.send([limite]); // Envia um array, mesmo que o item seja null
    } catch (error) {
      console.error('=== ERRO AO LISTAR LIMITE ===');
      console.error(error);
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