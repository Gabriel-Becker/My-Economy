import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import routes from './routes/index.js';
import { initDatabase } from './config/database.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.stack);
  res.status(500).json({ error: err.message || 'Algo deu errado!' });
});

const PORT = process.env.PORT || 8080;

// Inicializa o banco de dados antes de iniciar o servidor
console.log('Iniciando inicialização do banco de dados...');
initDatabase()
  .then(() => {
    console.log('Banco de dados inicializado com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}!`);
    });
  })
  .catch(error => {
    console.error('Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  }); 