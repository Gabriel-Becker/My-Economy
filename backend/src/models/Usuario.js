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
      const result = await insert(
        'INSERT INTO USUARIOS (EMAIL, SENHA, NOME, DT_NASCIMENTO) VALUES (?, ?, ?, ?)',
        [email, senha, nome, dt_nascimento]
      );
      return this.findById(result.lastID);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Erro ao criar usuário no banco de dados');
    }
  }
} 