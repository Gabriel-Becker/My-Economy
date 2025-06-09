import { query, queryOne, insert } from '../config/database.js';

export class Despesa {
  static async findById(id) {
    return queryOne('SELECT * FROM DESPESAS WHERE ID = ?', [id]);
  }

  static async findByUsuarioMesAno(usuario, mes, ano) {
    return query(
      'SELECT * FROM DESPESAS WHERE USUARIO_ID = ? AND MES = ? AND ANO = ?',
      [usuario, mes, ano]
    );
  }

  static async findByUsuario(usuario) {
    return query('SELECT * FROM DESPESAS WHERE USUARIO_ID = ?', [usuario]);
  }

  static async create(descricao, valor, mes, ano, usuario_id, icone) {
    const result = await insert(
      'INSERT INTO DESPESAS (DESCRICAO, VALOR, MES, ANO, USUARIO_ID, ICONE) VALUES (?, ?, ?, ?, ?, ?)',
      [descricao, valor, mes, ano, usuario_id, icone]
    );
    return this.findById(result.lastID);
  }

  static async update(id, descricao, valor, mes, ano, usuario_id, icone) {
    await insert(
      'UPDATE DESPESAS SET DESCRICAO = ?, VALOR = ?, MES = ?, ANO = ?, USUARIO_ID = ?, ICONE = ? WHERE ID = ?',
      [descricao, valor, mes, ano, usuario_id, icone, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const despesa = await this.findById(id);
    await insert('DELETE FROM DESPESAS WHERE ID = ?', [id]);
    return despesa;
  }

  static async getValorTotal(mes, ano, usuario_id) {
    const result = await queryOne(
      'SELECT SUM(valor) AS TOTAL FROM DESPESAS WHERE MES = ? AND ANO = ? AND USUARIO_ID = ?',
      [mes, ano, usuario_id]
    );
    return result || { TOTAL: 0 };
  }
} 