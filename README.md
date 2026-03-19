<div align="center">

  <img src=".github/assets/logo-nexia.png" alt="NexIA Lab" width="180" />

  <h1>NexIA Partners</h1>

  <p>Sistema de gestão de oportunidades de negócios trazidas por parceiros comerciais</p>

  <p>
    <img src="https://img.shields.io/badge/status-em%20desenvolvimento-46347F?style=flat-square" />
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/Supabase-integrado-3ECF8E?style=flat-square&logo=supabase" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Tests-55%20passed-22c55e?style=flat-square" />
    <img src="https://img.shields.io/badge/feito%20por-NexIA%20Lab-46347F?style=flat-square" />
  </p>

</div>

---

## Sobre o Projeto

O **NexIA Partners** é uma plataforma web desenvolvida pela NexIA Lab para centralizar o registro e acompanhamento de oportunidades de negócio originadas por parceiros comerciais — como licitações, projetos e contratos.

O sistema resolve o problema de oportunidades que se perdem em planilhas e e-mails, prazos que vencem sem aviso e a falta de visibilidade sobre a performance dos parceiros. Com ele, a equipe comercial tem uma visão clara e em tempo real de todas as oportunidades, seus status e prazos.

O status de cada oportunidade é calculado automaticamente pelo banco de dados com base na data de validade: **ativo** → **vencendo** (15 dias antes) → **expirado**. Isso elimina atualizações manuais e garante que nenhum prazo passe despercebido.

Destinado à equipe comercial, gestores de parcerias e diretoria, o sistema oferece dashboard com métricas, relatórios visuais com gráficos e exportação de dados em CSV.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS 3 |
| Componentes UI | Radix UI + componentes custom |
| Gráficos | Recharts |
| Backend | Next.js Server Actions + API Routes |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Testes | Jest + React Testing Library |
| Deploy | Vercel |

---

## Funcionalidades

- Autenticar usuários com email e senha via Supabase Auth
- Proteger todas as rotas com middleware de autenticação
- Visualizar métricas no dashboard (total, ativas, vencendo, expiradas, parceiros)
- Registrar novas oportunidades com formulário validado
- Buscar parceiros com autocomplete no formulário
- Editar e excluir oportunidades com confirmação
- Filtrar oportunidades por texto, status e parceiro
- Ordenar listagem por qualquer coluna
- Calcular status automaticamente (ativo/vencendo/expirado) via SQL
- Cadastrar e gerenciar parceiros comerciais
- Visualizar relatórios com gráficos (barras, donut, linha do tempo)
- Exportar dados para CSV
- Imprimir relatórios via window.print() com CSS otimizado

---

## Pré-requisitos

- Node.js 18+
- npm
- Conta no [Supabase](https://supabase.com)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/anaperci/nexia-partners.git
cd nexia-partners
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase.

### 4. Configure o banco de dados

Execute o arquivo `supabase-schema.sql` no **SQL Editor** do Supabase.

### 5. Crie um usuário

No painel do Supabase, vá em **Authentication → Users → Add user** e crie um usuário com email + senha.

### 6. Inicie o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública do Supabase | ✅ |

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── login/                      # Página de login (pública)
│   └── (dashboard)/                # Grupo de rotas protegidas
│       ├── page.tsx                 # Dashboard com métricas
│       ├── actions.ts               # Server Actions (CRUD completo)
│       ├── layout.tsx               # Layout com Sidebar
│       ├── oportunidades/
│       │   ├── page.tsx             # Listagem com filtros
│       │   ├── nova/page.tsx        # Formulário de criação
│       │   └── [id]/page.tsx        # Detalhe e edição
│       ├── parceiros/
│       │   └── page.tsx             # Cadastro e listagem
│       └── relatorios/
│           └── page.tsx             # Gráficos e exportação
├── components/
│   ├── layout/                      # Sidebar, Header
│   ├── oportunidades/               # Form, List, Detail, StatusBadge
│   ├── parceiros/                   # ParceirosClient
│   ├── relatorios/                  # RelatoriosClient (gráficos Recharts)
│   └── ui/                          # Button, Input, Dialog, AlertDialog, Card
├── lib/
│   ├── supabase.ts                  # Client-side Supabase
│   ├── supabase-server.ts           # Server-side Supabase
│   ├── types.ts                     # Interfaces TypeScript
│   └── utils.ts                     # Formatação de datas, cores de status
└── middleware.ts                    # Proteção de rotas via Supabase Auth

tests/
├── lib/                             # Testes de utils e types
├── components/                      # Testes de componentes
│   ├── layout/                      # Header
│   ├── oportunidades/               # Form, List, Detail, StatusBadge
│   └── parceiros/                   # ParceirosClient
└── __mocks__/                       # Mocks do Supabase + dados de teste

docs/
├── PRD.md                           # Product Requirements Document
└── README-SISTEMA.md                # Documentação para usuários finais
```

---

## Scripts

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build de produção
npm run start          # Iniciar em produção
npm run lint           # Lint (ESLint)
npm test               # Rodar todos os testes
npm run test:watch     # Testes em modo watch
npm run test:coverage  # Testes com cobertura
```

---

## Deploy

O projeto está configurado para deploy na **Vercel** com integração GitHub:

- **Produção**: [nexia-partners.vercel.app](https://nexia-partners.vercel.app)
- Push na `main` → deploy automático

```bash
# Deploy manual
vercel --prod
```

Configure as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no painel da Vercel.

---

## Documentação

- [PRD — Product Requirements Document](docs/PRD.md)
- [Documentação do Sistema (usuários)](docs/README-SISTEMA.md)
- [Schema SQL](supabase-schema.sql)

---

## Autora

<table>
  <tr>
    <td align="center">
      <b>Ana Paula Perci</b><br/>
      <sub>Fundadora & CEO — NexIA Lab</sub><br/>
      <a href="https://nexialab.com.br">nexialab.com.br</a>
    </td>
  </tr>
</table>

---

## Licença

© 2026 NexIA Lab — Todos os direitos reservados.
Uso interno. Redistribuição não autorizada.

---

<div align="center">
  <sub>Desenvolvido com ♦ por <a href="https://nexialab.com.br">NexIA Lab</a></sub>
</div>
