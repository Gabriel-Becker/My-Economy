import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria uma conexão com o banco de dados SQLite
const dbPromise = open({
  filename: path.join(__dirname, '../../database.sqlite'),
  driver: sqlite3.Database
});

// Função para executar queries
export async function query(sql, params = []) {
  try {
    const db = await dbPromise;
    return await db.all(sql, params);
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
}

// Função para executar uma única query
export async function queryOne(sql, params = []) {
  try {
    const db = await dbPromise;
    return await db.get(sql, params);
  } catch (error) {
    console.error('Erro ao executar queryOne:', error);
    throw error;
  }
}

// Função para executar uma query de inserção
export async function insert(sql, params = []) {
  try {
    const db = await dbPromise;
    return await db.run(sql, params);
  } catch (error) {
    console.error('Erro ao executar insert:', error);
    throw error;
  }
}

// Função para inicializar o banco de dados
export async function initDatabase() {
  try {
    const db = await dbPromise;
    
    // Criar tabela de usuários
    await db.exec(`
      CREATE TABLE IF NOT EXISTS USUARIOS (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        EMAIL TEXT NOT NULL UNIQUE,
        SENHA TEXT NOT NULL,
        NOME TEXT NOT NULL,
        DT_NASCIMENTO TEXT NOT NULL
      )
    `);

    // Criar tabela de despesas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS DESPESAS (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        DESCRICAO TEXT NOT NULL,
        VALOR REAL NOT NULL,
        MES INTEGER NOT NULL,
        ANO INTEGER NOT NULL,
        USUARIO_ID INTEGER NOT NULL,
        ICONE TEXT,
        FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS (ID)
      )
    `);

    // Criar tabela de limites
    await db.exec(`
      CREATE TABLE IF NOT EXISTS LIMITES (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        VALOR REAL NOT NULL,
        MES INTEGER NOT NULL,
        ANO INTEGER NOT NULL,
        USUARIO_ID INTEGER NOT NULL,
        FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS (ID)
      )
    `);

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export default dbPromise;