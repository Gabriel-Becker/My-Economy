# My Economy - Backend

Este é o backend do projeto **My Economy**, responsável pela API de controle de despesas, limites mensais e autenticação de usuários.

## Tecnologias Utilizadas
- Node.js
- Express
- SQLite (pode ser adaptado para MySQL/Postgres)
- JWT (JSON Web Token)
- Sequelize (se aplicável)

## Instalação

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```

## Execução

Para rodar o backend em modo desenvolvimento:
```bash
npm start
```

A API estará disponível em `http://localhost:8080` (ou porta definida no código).

## Estrutura de Pastas
- `src/controllers/` — Lógica das rotas e regras de negócio
- `src/models/` — Modelos de dados e integração com o banco
- `src/middlewares/` — Middlewares de autenticação, validação, etc
- `src/routes/` — Definição das rotas da API
- `src/config/` — Configurações de banco e ambiente
- `src/database/` — Scripts SQL e inicialização do banco

## Principais Endpoints
- `/users` — Cadastro de usuário
- `/sessions` — Login/autenticação
- `/despesas` — CRUD de despesas
- `/limites` — CRUD de limites mensais

## Variáveis de Ambiente
- `JWT_SECRET` — Chave secreta para geração/validação do token JWT
- `DATABASE_URL` — (Se usar MySQL/Postgres) String de conexão do banco

## Requisitos Técnicos
- Rotas privadas exigem token JWT válido
- Validações de negócio (ex: não cadastrar despesas/limites em meses passados)
- Banco pode ser adaptado para MySQL/Postgres facilmente

## Observações
- O backend deve ser executado antes do frontend para garantir o funcionamento da API.
- Consulte o README do frontend para detalhes de integração.

---

Para dúvidas ou sugestões, consulte o README principal do projeto ou entre em contato com o desenvolvedor. 