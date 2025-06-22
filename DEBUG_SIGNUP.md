# Debug do Problema de Signup

## Problemas Identificados e Soluções

### 1. Redirecionamento Direto para Home
**Problema**: O app está indo direto para a tela de Home sem passar pela tela de Login.

**Causa**: Existem dados de usuário salvos no AsyncStorage de uma sessão anterior.

**Solução**: 
1. Clique no botão vermelho "Limpar Dados (Debug)" na tela de Login
2. Recarregue a página (F5)
3. Agora você deve ver a tela de Login

### 2. Campos Inconsistentes no Login
**Problema**: O frontend envia `password` mas o backend espera `senha`.

**Solução**: Adicionada conversão no userService:
```javascript
const loginData = {
  email: credentials.email,
  senha: credentials.password
};
```

### 3. Logs de Debug Adicionados

#### Frontend
- `frontend/src/services/userService.js`: Logs detalhados de requisições
- `frontend/src/services/api.js`: Interceptors com logs completos
- `frontend/src/contexts/AuthContext.js`: Logs do processo de signup e carregamento do storage
- `frontend/src/pages/SignIn/index.js`: Botão para limpar dados (debug)

#### Backend
- `backend/src/controllers/UsuarioController.js`: Logs do endpoint register
- `backend/src/models/Usuario.js`: Logs da criação no banco

## Como Testar

### 1. Limpar Dados Antigos
- Clique no botão "Limpar Dados (Debug)" na tela de Login
- Recarregue a página (F5)

### 2. Verificar se o Backend está Rodando
```bash
cd backend
npm start
```

### 3. Testar o Signup
- Abra o console do navegador (F12)
- Tente criar um usuário
- Verifique os logs no terminal do backend

## Checklist de Verificação

### Backend
- [ ] Banco de dados inicializado corretamente
- [ ] Servidor rodando na porta 8080
- [ ] CORS configurado
- [ ] Arquivo .env com SECRET definido
- [ ] Tabela USUARIOS criada

### Frontend
- [ ] Console do navegador aberto para ver logs
- [ ] Backend rodando em localhost:8080
- [ ] Dados antigos limpos do storage

## Possíveis Problemas

### 1. CORS
Se houver erro de CORS, verifique se o backend tem:
```javascript
app.use(cors());
```

### 2. Banco de Dados
- Verifique se o SQLite está sendo criado corretamente
- Verifique se a tabela USUARIOS existe

### 3. Variáveis de Ambiente
- Verifique se o arquivo `.env` existe no backend
- Verifique se `SECRET` está definido para o JWT

## Comandos para Debug

### 1. Verificar se o servidor está rodando
```bash
# No terminal da máquina
curl http://localhost:8080
```

### 2. Testar conectividade
```bash
# No navegador, acesse:
http://localhost:8080
```

## Próximos Passos

1. Clique em "Limpar Dados (Debug)" na tela de Login
2. Recarregue a página
3. Tente criar um usuário
4. Verifique os logs no console do navegador
5. Se ainda houver erro, compartilhe os logs para análise adicional

## Logs Esperados

### Carregamento Inicial
```
=== CARREGANDO DADOS DO STORAGE ===
Token encontrado: Não
Dados do usuário encontrados: Não
Nenhum usuário logado, limpando estado...
```

### Sucesso no Signup
```
=== AUTH CONTEXT - SIGNUP ===
=== DEBUG SIGNUP ===
=== REQUISIÇÃO ENVIADA ===
=== BACKEND - REGISTER ===
=== MODELO USUARIO - CREATE ===
=== REGISTER CONCLUÍDO COM SUCESSO ===
=== RESPOSTA RECEBIDA ===
=== SIGNUP CONCLUÍDO COM SUCESSO ===
```

### Erro Comum
```
=== ERRO NO SIGNUP ===
Network Error: connect ECONNREFUSED
```
**Solução**: Verificar se o backend está rodando em localhost:8080. 