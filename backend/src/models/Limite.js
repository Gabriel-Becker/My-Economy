import { query, queryOne, insert } from '../config/database.js';

export class Limite {
  static async findById(id) {
    return queryOne('SELECT * FROM LIMITES WHERE ID = ?', [id]);
  }

  static async findByUsuarioMesAno(usuario, mes, ano) {
    try {
      console.log('Buscando limite para:', { usuario, mes, ano });
      const result = await queryOne(
        'SELECT * FROM LIMITES WHERE USUARIO_ID = ? AND MES = ? AND ANO = ?',
        [usuario, mes, ano]
      );
      console.log('Resultado da busca:', result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar limite por usuário/mês/ano:', error);
      throw error;
    }
  }

  static async existsByUsuarioMesAno(usuario, mes, ano) {
    try {
      const limite = await this.findByUsuarioMesAno(usuario, mes, ano);
      return limite != null;
    } catch (error) {
      console.error('Erro ao verificar existência do limite:', error);
      return false;
    }
  }

  static async create(valor, mes, ano, usuario_id) {
    try {
      if (await this.existsByUsuarioMesAno(usuario_id, mes, ano)) {
        throw new Error('Limite já cadastrado');
      }
      const result = await insert(
        'INSERT INTO LIMITES (VALOR, MES, ANO, USUARIO_ID) VALUES (?, ?, ?, ?)',
        [valor, mes, ano, usuario_id]
      );
      return this.findById(result.lastID);
    } catch (error) {
      console.error('Erro ao criar limite:', error);
      throw error;
    }
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