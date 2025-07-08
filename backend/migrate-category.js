import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para o banco de dados
const dbPath = join(__dirname, 'database.sqlite');

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath);

console.log('Iniciando migração para adicionar coluna CATEGORIA...');

// Verificar se a coluna CATEGORIA já existe
db.all("PRAGMA table_info(DESPESAS)", (err, columns) => {
  if (err) {
    console.error('Erro ao obter informações da tabela:', err);
    db.close();
    return;
  }

  const hasCategoryColumn = columns.some(col => col.name === 'CATEGORIA');
  
  if (hasCategoryColumn) {
    console.log('Coluna CATEGORIA já existe na tabela DESPESAS.');
    db.close();
    return;
  }

  // Adicionar a coluna CATEGORIA
  db.run("ALTER TABLE DESPESAS ADD COLUMN CATEGORIA TEXT DEFAULT ''", (err) => {
    if (err) {
      console.error('Erro ao adicionar coluna CATEGORIA:', err);
      db.close();
      return;
    }
    
    console.log('Coluna CATEGORIA adicionada com sucesso!');
    
    // Atualizar registros existentes para ter a categoria vazia
    db.run("UPDATE DESPESAS SET CATEGORIA = '' WHERE CATEGORIA IS NULL", (err) => {
      if (err) {
        console.error('Erro ao atualizar registros existentes:', err);
      } else {
        console.log('Registros existentes atualizados com categoria vazia.');
      }
      db.close();
    });
  });
}); 