# My Economy Backend

Backend do aplicativo My Economy, um sistema de controle de despesas pessoais.

## Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8 ou superior)
- NPM ou Yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais:
```env
PORT=8080
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=admin
DB_NAME=my-economy
SECRET=sua_chave_secreta_aqui
```

4. Execute o script SQL para criar o banco de dados:
```bash
mysql -u root -p < src/database/DDL.sql
```

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:8080`

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/         # Configurações do projeto
│   ├── controllers/    # Controladores da aplicação
│   ├── database/       # Scripts do banco de dados
│   ├── middlewares/    # Middlewares
│   ├── models/         # Modelos do banco de dados
│   ├── routes/         # Rotas da aplicação
│   └── app.js          # Arquivo principal
├── .env               # Variáveis de ambiente
├── package.json       # Dependências e scripts
└── README.md         # Documentação
```

## API Endpoints

### Usuários
- POST /usuario - Criar novo usuário
- POST /login - Autenticar usuário
- POST /logout - Deslogar usuário

### Despesas
- POST /despesas - Criar nova despesa
- GET /despesas - Listar despesas
- PUT /despesas/:id - Atualizar despesa
- DELETE /despesas/:id - Remover despesa
- GET /total - Obter total de despesas

### Limites
- POST /limites - Criar novo limite
- GET /limites - Listar limites
- PUT /limites/:id - Atualizar limite
- DELETE /limites/:id - Remover limite 