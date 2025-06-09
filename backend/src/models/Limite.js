import { query, queryOne, insert } from '../config/database.js';

export class Limite {
  static async findById(id) {
    return queryOne('SELECT * FROM LIMITES WHERE ID = ?', [id]);
  }

  static async findByUsuarioMesAno(usuario, mes, ano) {
    return queryOne(
      'SELECT * FROM LIMITES WHERE USUARIO_ID = ? AND MES = ? AND ANO = ?',
      [usuario, mes, ano]
    );
  }

  static async existsByUsuarioMesAno(usuario, mes, ano) {
    const limite = await this.findByUsuarioMesAno(usuario, mes, ano);
    return limite != null;
  }

  static async create(valor, mes, ano, usuario_id) {
    if (await this.existsByUsuarioMesAno(usuario_id, mes, ano)) {
      throw new Error('Limite já cadastrado');
    }
    const result = await insert(
      'INSERT INTO LIMITES (VALOR, MES, ANO, USUARIO_ID) VALUES (?, ?, ?, ?)',
      [valor, mes, ano, usuario_id]
    );
    return this.findById(result.lastID);
  }

  static async update(id, valor, mes, ano, usuario_id) {
    await insert(
      'UPDATE LIMITES SET VALOR = ?, MES = ?, ANO = ?, USUARIO_ID = ? WHERE ID = ?',
      [valor, mes, ano, usuario_id, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const limite = await this.findById(id);
    await insert('DELETE FROM LIMITES WHERE ID = ?', [id]);
    return limite;
  }
} 