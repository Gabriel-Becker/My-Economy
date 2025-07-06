import { Limite } from '../models/Limite.js';

export class LimiteController {
  static async create(req, res) {
    try {
      console.log('=== BACKEND - CREATE LIMIT ===');
      console.log('ID do Usuário:', req.userId);
      console.log('Dados recebidos (req.body):', req.body);

      const { valor, mes, ano } = req.body;

      if (valor === undefined || valor === null || isNaN(parseFloat(valor))) {
        console.error('Erro: Valor do limite é inválido ou ausente.');
        return res.status(400).json({ error: 'O valor do limite é inválido ou ausente.' });
      }

      if (mes === undefined || mes === null || isNaN(parseInt(mes, 10))) {
        console.error('Erro: Mês do limite é inválido ou ausente.');
        return res.status(400).json({ error: 'O mês do limite é inválido ou ausente.' });
      }

      if (ano === undefined || ano === null || isNaN(parseInt(ano, 10))) {
        console.error('Erro: Ano do limite é inválido ou ausente.');
        return res.status(400).json({ error: 'O ano do limite é inválido ou ausente.' });
      }

      const mesNum = parseInt(mes, 10);
      const anoNum = parseInt(ano, 10);

      if (mesNum < 1 || mesNum > 12) {
        console.error('Erro: Mês deve estar entre 1 e 12.');
        return res.status(400).json({ error: 'Mês deve estar entre 1 e 12.' });
      }

      const valorNumerico = parseFloat(valor);

      const novoLimite = await Limite.create(valorNumerico, mesNum, anoNum, req.userId);
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

      const { mes, ano } = req.query;
      if (!mes || !ano) {
        return res.status(400).json({ error: 'Os parâmetros mes e ano são obrigatórios.' });
      }

      const mesNum = parseInt(mes, 10);
      const anoNum = parseInt(ano, 10);
      
      console.log(`Buscando limite para: Usuario ID=${req.userId}, Mês=${mesNum}, Ano=${anoNum}`);

      const limite = await Limite.findByUsuarioMesAno(req.userId, mesNum, anoNum);
      
      if (limite) {
        console.log('Limite encontrado:', limite);
        limite.valor = parseFloat(limite.VALOR); // Ajustado para VALOR maiúsculo
        res.send([limite]);
      } else {
        console.log('Nenhum limite encontrado para o período.');
        res.send([]); // Envia array vazio quando não encontra
      }
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