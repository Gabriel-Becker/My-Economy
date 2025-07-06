# My-Economy Frontend

Aplicativo React Native para controle de despesas pessoais com limite mensal.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes básicos (Button, Input, Card, etc.)
│   └── forms/          # Componentes de formulário específicos
├── constants/          # Constantes (cores, tamanhos)
├── contexts/           # Contextos React (AuthContext)
├── screens/            # Telas do aplicativo
│   ├── auth/           # Telas de autenticação
│   ├── dashboard/      # Tela principal
│   ├── expenses/       # Telas de despesas
│   ├── limits/         # Telas de limites
│   └── profile/        # Tela de perfil
├── services/           # Serviços de API
├── utils/              # Utilitários (validações, formatações)
└── routes/             # Configuração de navegação
```

## 🎨 Design System

### Cores
- **Primária**: Verde (#28a745) - Ações principais
- **Secundária**: Azul (#007AFF) - Ações secundárias
- **Sucesso**: Verde (#28a745) - Feedback positivo
- **Aviso**: Amarelo (#ffc107) - Alertas
- **Perigo**: Vermelho (#dc3545) - Erros e ações destrutivas

### Tipografia
- **XS**: 12px - Textos pequenos
- **SM**: 14px - Labels e textos secundários
- **MD**: 16px - Texto padrão
- **LG**: 18px - Títulos pequenos
- **XL**: 20px - Títulos médios
- **XXL**: 24px - Títulos grandes

### Espaçamentos
- **XS**: 5px - Espaçamentos mínimos
- **SM**: 10px - Espaçamentos pequenos
- **MD**: 15px - Espaçamentos médios
- **LG**: 20px - Espaçamentos grandes
- **XL**: 30px - Espaçamentos extra grandes

## 🔧 Componentes Principais

### Button
Componente de botão com múltiplas variantes e tamanhos.

```jsx
<Button 
  title="Salvar" 
  variant="primary" 
  size="medium" 
  onPress={handleSave} 
/>
```

**Variantes**: `primary`, `secondary`, `danger`, `outline`
**Tamanhos**: `small`, `medium`, `large`

### Input
Campo de entrada de texto com validação.

```jsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Digite seu email"
  error={errors.email}
/>
```

### Card
Container para agrupar conteúdo relacionado.

```jsx
<Card variant="success">
  <Text>Conteúdo do card</Text>
</Card>
```

**Variantes**: `default`, `success`, `warning`, `danger`, `info`

## 📱 Telas

### Autenticação
- **LoginScreen**: Tela de login com email e senha
- **RegisterScreen**: Tela de cadastro com validações
- **LogoutScreen**: Confirmação de logout

### Dashboard
- **DashboardScreen**: Tela principal com resumo financeiro
  - Progresso do mês
  - Status do limite
  - Navegação entre meses
  - Ações rápidas

### Despesas
- **ExpenseFormScreen**: Formulário para criar/editar despesas
  - Validação de campos obrigatórios
  - Formatação de valores monetários
  - Validação de mês de referência

### Limites
- **LimitFormScreen**: Formulário para definir limites mensais
  - Validação de valores
  - Restrição de meses passados

### Perfil
- **ProfileScreen**: Exibição dos dados do usuário
  - Informações pessoais
  - Botão de logout

## 🔐 Autenticação

O sistema usa JWT para autenticação com armazenamento local:

```jsx
const { signIn, signUp, signOut, user } = useAuth();
```

### Fluxo de Autenticação
1. Usuário faz login/cadastro
2. Token JWT é armazenado no AsyncStorage
3. Token é incluído automaticamente nas requisições
4. Estado do usuário é mantido globalmente

## 📊 Validações

Sistema de validação centralizado em `utils/validation.js`:

- **Email**: Formato válido
- **Senha**: Mínimo 6 caracteres
- **Data de nascimento**: Formato DD/MM/AAAA, idade mínima 13 anos
- **Valores monetários**: Maior que zero
- **Meses de referência**: Formato YYYY-MM, não pode ser passado

## 💰 Formatação

Utilitários de formatação em `utils/formatters.js`:

- **Moeda**: Formatação brasileira (R$ 0,00)
- **Data**: Formatação brasileira (DD/MM/AAAA)
- **Mês/Ano**: Formatação longa (Janeiro 2024)

## 🌐 API

Configuração centralizada em `services/api.js`:

- Interceptors automáticos para token JWT
- Tratamento de erros consistente
- Configuração de base URL dinâmica

## 🚀 Execução

### Instalação
```bash
cd frontend
npm install
```

### Desenvolvimento
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## ⚠️ Configuração de IP

**Importante:** Quando trocar de computador, altere o IP no arquivo `src/config/api.js`:

```javascript
const LOCAL_IP = 'SEU_IP_AQUI'; // Altere para o IP do seu computador
```

O Expo mostrará o IP correto quando você executar `npm start`.

## 📋 Funcionalidades

### ✅ Implementadas
- [x] Autenticação com JWT
- [x] Dashboard com progresso financeiro
- [x] Cadastro e edição de despesas
- [x] Definição de limites mensais
- [x] Navegação entre meses
- [x] Validações de formulário
- [x] Formatação de valores monetários
- [x] Tratamento de erros
- [x] Design responsivo
- [x] Feedback visual para usuário

## 🛠️ Tecnologias

- **React Native**: Framework principal
- **React Navigation**: Navegação entre telas
- **Axios**: Cliente HTTP
- **AsyncStorage**: Armazenamento local
- **date-fns**: Manipulação de datas
- **React Native Vector Icons**: Ícones

## 📝 Convenções

### Nomenclatura
- **Componentes**: PascalCase (ex: `Button`, `ExpenseForm`)
- **Funções**: camelCase (ex: `handleSubmit`, `validateForm`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `COLORS`, `SIZES`)
- **Arquivos**: PascalCase para componentes, camelCase para utilitários

### Estrutura de Arquivos
- Um componente por arquivo
- Estilos no final do arquivo
- Imports organizados por tipo
- Exports nomeados preferidos

### Estado
- Use `useState` para estado local
- Use `useContext` para estado global
- Evite prop drilling desnecessário
- Mantenha estado mínimo e derivado



## 📋 Fluxo de Uso

- **Login/Cadastro:** Usuário pode criar conta e fazer login
- **Home:** Visualiza resumo do mês, limite, despesas e progresso
- **Despesas:** Visualiza, cadastra, edita e exclui despesas por mês
- **Limites:** Define e gerencia limite mensal (um por mês)
- **Perfil:** Visualiza dados do usuário e faz logout

## ⚠️ Observações

- O frontend consome a API do backend (ver README do backend para detalhes)
- O token JWT é salvo no AsyncStorage e enviado em todas as requisições privadas
- Validações de campos obrigatórios e feedbacks visuais estão implementados
- Configuração automática de IP para emuladores e dispositivos físicos 