import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

export class UsuarioController {
  static async register(req, res) {
    try {
      const { email, senha, nome, dt_nascimento } = req.body;
      
      const exists = await Usuario.existsByEmail(email);
      if (exists) {
        return res.status(409).send('Email já cadastrado');
      }

      const novoUsuario = await Usuario.create(email, senha, nome, dt_nascimento);
      res.status(201).send(novoUsuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.findByEmailAndSenha(email, senha);
      
      if (!usuario) {
        return res.status(401).send('Usuário não encontrado.');
      }

      const token = jwt.sign({ id: usuario.id }, process.env.SECRET, {
        expiresIn: 1000 * 60 * 60 * 24, // 24 horas
      });

      usuario.senha = undefined;
      return res.json({ auth: true, token, usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    res.json({ auth: false, token: null });
  }
} 