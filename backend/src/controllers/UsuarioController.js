import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

// Função para padronizar o formato do usuário retornado
const formatUser = (user) => {
  if (!user) return null;
  return {
    id: user.ID,
    name: user.NOME,
    email: user.EMAIL,
    birthDate: user.DT_NASCIMENTO,
  };
};

export class UsuarioController {
  static async register(req, res) {
    try {
      console.log('=== BACKEND - REGISTER ===');
      console.log('Body completo recebido:', req.body);
      console.log('Headers:', req.headers);
      
      const { email, password, name, birthDate, confirmPassword } = req.body;
      
      console.log('Dados extraídos:', { email, password, name, birthDate, confirmPassword });
      
      // Validações
      if (!email || !password || !name || !birthDate) {
        console.error('Dados obrigatórios faltando');
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      if (password !== confirmPassword) {
        console.error('Senhas não conferem');
        return res.status(400).json({ error: 'As senhas não conferem' });
      }
      
      const exists = await Usuario.existsByEmail(email);
      if (exists) {
        console.error('Email já cadastrado:', email);
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      console.log('Criando hash da senha...');
      const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

      console.log('Chamando Usuario.create com:', { email, hashedPassword, name, birthDate });
      const novoUsuario = await Usuario.create(email, hashedPassword, name, birthDate);
      console.log('Usuário criado:', novoUsuario);
      
      const token = jwt.sign({ id: novoUsuario.ID }, process.env.SECRET, {
        expiresIn: 1000 * 60 * 60 * 24, // 24 horas
      });

      const userResponse = formatUser(novoUsuario);

      console.log('=== REGISTER CONCLUÍDO COM SUCESSO ===');
      return res.status(201).json({ auth: true, token, user: userResponse });
    } catch (error) {
      console.error('=== ERRO NO REGISTER ===');
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

      const token = jwt.sign({ id: usuario.ID }, process.env.SECRET, {
        expiresIn: 1000 * 60 * 60 * 24, // 24 horas
      });

      const userResponse = formatUser(usuario);

      return res.json({ auth: true, token, user: userResponse });
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

      const userResponse = formatUser(usuario);

      console.log('Dados do usuário encontrados e retornados para o perfil.');
      return res.json(userResponse);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: error.message });
    }
  }
} 