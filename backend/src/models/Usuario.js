import { query, queryOne, insert } from '../config/database.js';

export class Usuario {
  static async findById(id) {
    return queryOne('SELECT * FROM USUARIOS WHERE ID = ?', [id]);
  }

  static async findByEmailAndSenha(email, senha) {
    return queryOne('SELECT * FROM USUARIOS WHERE EMAIL = ? AND SENHA = ?', [email, senha]);
  }

  static async existsByEmail(email) {
    const user = await queryOne('SELECT * FROM USUARIOS WHERE EMAIL = ?', [email]);
    return user != null;
  }

  static async create(email, senha, nome, dt_nascimento) {
    const result = await insert(
      'INSERT INTO USUARIOS (EMAIL, SENHA, NOME, DT_NASCIMENTO) VALUES (?, ?, ?, ?)',
      [email, senha, nome, dt_nascimento]
    );
    return this.findById(result.lastID);
  }
} 