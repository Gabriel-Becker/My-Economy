import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

export class UsuarioController {
  static async register(req, res) {
    try {
      const { email, password, name, birthDate } = req.body;
      
      const exists = await Usuario.existsByEmail(email);
      if (exists) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

      const novoUsuario = await Usuario.create(email, hashedPassword, name, birthDate);
      
      const token = jwt.sign({ id: novoUsuario.id }, process.env.SECRET, {
        expiresIn: 1000 * 60 * 60 * 24, // 24 horas
      });

      novoUsuario.senha = undefined;
      return res.status(201).json({ auth: true, token, user: novoUsuario });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.findByEmail(email); // Buscar por email apenas
      
      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      // Comparar a senha fornecida com a senha hash armazenada
      const passwordIsValid = await bcrypt.compare(senha, usuario.SENHA);
      if (!passwordIsValid) {
        return res.status(401).json({ error: 'Senha inválida.' });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.SECRET, {
        expiresIn: 1000 * 60 * 60 * 24, // 24 horas
      });

      usuario.senha = undefined;
      return res.json({ auth: true, token, user: usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    res.json({ auth: false, token: null });
  }

  static async getProfile(req, res) {
    console.log('Requisição GET /users recebida.');
    console.log('ID do usuário do token (req.userId):', req.userId);
    try {
      if (!req.userId) {
        console.warn('req.userId não está definido. Token JWT pode estar ausente ou inválido.');
        return res.status(401).json({ error: 'Não autorizado: Token inválido ou ausente.' });
      }
      const usuario = await Usuario.findById(req.userId);
      if (!usuario) {
        console.warn(`Usuário com ID ${req.userId} não encontrado no banco de dados.`);
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      usuario.senha = undefined;
      console.log('Dados do usuário encontrados e retornados para o perfil.');
      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: error.message });
    }
  }
} 