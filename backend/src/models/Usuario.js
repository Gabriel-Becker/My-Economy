import { query, queryOne, insert } from '../config/database.js';

export class Usuario {
  static async findById(id) {
    return queryOne('SELECT * FROM USUARIOS WHERE ID = ?', [id]);
  }

  static async findByEmail(email) {
    return queryOne('SELECT * FROM USUARIOS WHERE EMAIL = ?', [email]);
  }

  static async existsByEmail(email) {
    const user = await queryOne('SELECT * FROM USUARIOS WHERE EMAIL = ?', [email]);
    return user != null;
  }

  static async create(email, senha, nome, dt_nascimento) {
    try {
      console.log('=== MODELO USUARIO - CREATE ===');
      console.log('Parâmetros recebidos:', { email, senha: '***', nome, dt_nascimento });
      
      const sql = 'INSERT INTO USUARIOS (EMAIL, SENHA, NOME, DT_NASCIMENTO) VALUES (?, ?, ?, ?)';
      const params = [email, senha, nome, dt_nascimento];
      
      console.log('SQL:', sql);
      console.log('Parâmetros (sem senha):', [email, '***', nome, dt_nascimento]);
      
      const result = await insert(sql, params);
      console.log('Resultado do insert:', result);
      
      const novoUsuario = await this.findById(result.lastID);
      console.log('Usuário criado e retornado:', novoUsuario);
      
      return novoUsuario;
    } catch (error) {
      console.error('=== ERRO NO MODELO USUARIO - CREATE ===');
      console.error('Erro ao criar usuário:', error);
      throw new Error('Erro ao criar usuário no banco de dados');
    }
  }
} 