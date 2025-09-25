# FinanceApp - Frontend

Aplicativo de finanças pessoais construído com Next.js, TypeScript e TailwindCSS, seguindo a arquitetura **Atomic Design + Store centralizado** com Zustand.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Zustand** - Gerenciamento de estado global
- **ESLint** - Linting de código
- **Atomic Design** - Arquitetura de componentes

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router (apenas rotas)
│   ├── api/auth/login/     # API de autenticação
│   ├── dashboard/          # Página do dashboard
│   ├── login/              # Página de login
│   ├── contas/             # Página de contas
│   ├── transacoes/         # Página de transações
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Página inicial
├── src/                    # Núcleo da aplicação
│   ├── components/         # Componentes Atomic Design
│   │   ├── atoms/          # Elementos básicos
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Label.tsx
│   │   │   └── index.ts
│   │   ├── molecules/      # Combinações simples
│   │   │   ├── FormField.tsx
│   │   │   └── index.ts
│   │   ├── organisms/      # Blocos complexos
│   │   │   ├── LoginForm.tsx
│   │   │   └── index.ts
│   │   ├── templates/      # Estruturas de página
│   │   │   ├── PageLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── store/              # Stores Zustand
│   │   ├── auth.store.ts
│   │   ├── contas.store.ts
│   │   ├── transacoes.store.ts
│   │   └── index.ts
│   ├── services/           # Serviços de API
│   │   ├── apiClient.ts
│   │   ├── auth.service.ts
│   │   ├── contas.service.ts
│   │   ├── transacoes.service.ts
│   │   └── index.ts
│   └── types/              # Tipos TypeScript
│       ├── auth.ts
│       ├── contas.ts
│       ├── transacoes.ts
│       ├── user.ts
│       └── index.ts
└── ...config files
```

## 🧩 Arquitetura

### **Organização Clara e Sem Duplicação**

- **`app/`**: Contém apenas rotas do Next.js (pages, layouts, API routes)
- **`src/`**: Núcleo da aplicação com toda a lógica e componentes
- **Alias `@/`**: Configurado para apontar para `src/` facilitando imports
- **Separação clara**: UI, lógica e dados organizados em camadas distintas

### **Atomic Design**

- **Atoms**: Elementos básicos (Input, Button, Label)
- **Molecules**: Combinações simples (FormField)
- **Organisms**: Blocos complexos (LoginForm)
- **Templates**: Estruturas de página (AuthLayout, DashboardLayout)

### **Store Centralizado (Zustand)**

- **auth.store.ts**: Autenticação e usuário
- **contas.store.ts**: Gerenciamento de contas
- **transacoes.store.ts**: Gerenciamento de transações

### **Services Layer**

- **apiClient.ts**: Cliente HTTP configurável
- **auth.service.ts**: Serviços de autenticação
- **contas.service.ts**: Serviços de contas
- **transacoes.service.ts**: Serviços de transações

## 🔐 Funcionalidades

### Autenticação

- Login com CPF e senha
- Gerenciamento de token JWT
- Redirecionamento automático
- Persistência de sessão

### Dashboard

- Visão geral das finanças
- Cards de resumo (saldo, receitas, despesas)
- Navegação entre páginas

### Contas

- Listagem de contas bancárias
- Criação, edição e exclusão
- Diferentes tipos (corrente, poupança, investimento, cartão)
- Status ativo/inativo

### Transações

- Histórico de movimentações
- Filtros por tipo, categoria e data
- Criação, edição e exclusão
- Categorização automática

## 🎨 Design

- Layout responsivo com TailwindCSS
- Cores primárias em azul (#2563eb)
- Componentes reutilizáveis
- Estados de loading e erro
- Navegação intuitiva

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp env.example .env.local
```

4. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

5. Acesse [http://localhost:3005](http://localhost:3005) no seu navegador

## 🔧 Configuração da API

O projeto está configurado para se conectar com um backend em `http://localhost:3001`. Para alterar:

1. Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://seu-backend-url
```

2. Ou configure diretamente no `src/services/apiClient.ts`

## 🚀 Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código

## 🔄 Fluxo de Dados

1. **Componente** → chama ação da **Store**
2. **Store** → chama **Service**
3. **Service** → faz requisição para **API**
4. **API** → retorna dados
5. **Service** → processa resposta
6. **Store** → atualiza estado
7. **Componente** → re-renderiza com novos dados

## 🎯 Vantagens da Arquitetura

- **Separação de responsabilidades**: UI, lógica e dados isolados
- **Reutilização**: Componentes atômicos reutilizáveis
- **Escalabilidade**: Fácil adicionar novas funcionalidades
- **Manutenibilidade**: Código organizado e previsível
- **Testabilidade**: Cada camada pode ser testada independentemente
- **Performance**: Zustand otimizado para re-renders

## 📝 Próximos Passos

Para expandir o projeto, considere:

- **Middleware de autenticação** para rotas protegidas
- **Validação de formulários** com Zod ou Yup
- **Testes automatizados** com Jest e Testing Library
- **Internacionalização** com next-i18next
- **PWA** com service workers
- **CI/CD** com GitHub Actions
- **Deploy** no Vercel ou AWS

## 🔗 Integração com Backend

O projeto está preparado para integrar com um backend que implemente:

- **Autenticação JWT**
- **CRUD de contas**
- **CRUD de transações**
- **Filtros e paginação**
- **Validação de dados**

Consulte os tipos em `src/types/` para entender a estrutura esperada das APIs.
