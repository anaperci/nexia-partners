# PRD — NexIA Partners

## Product Requirements Document
**Versão:** 1.0
**Data:** 19/03/2026
**Responsável:** Ana Paula Perci
**Status:** Em desenvolvimento

---

## 1. Visão Geral do Produto

### 1.1 O que é
**NexIA Partners** é um sistema web de gestão de oportunidades de negócios trazidas por parceiros comerciais. Permite registrar, acompanhar e analisar oportunidades com controle de validade, status automático e relatórios visuais.

### 1.2 Problema
Parceiros comerciais trazem oportunidades de negócio (licitações, projetos, contratos) que precisam ser registradas, acompanhadas e gerenciadas de forma centralizada. Sem um sistema dedicado:
- Oportunidades se perdem em planilhas ou e-mails
- Prazos de validade vencem sem aviso
- Não há visibilidade sobre quais parceiros trazem mais oportunidades
- Relatórios dependem de consolidação manual

### 1.3 Solução
Uma plataforma web centralizada com:
- Registro estruturado de oportunidades vinculadas a parceiros
- Status automático baseado na data de validade (ativo → vencendo → expirado)
- Dashboard com métricas em tempo real
- Relatórios com gráficos e exportação CSV
- Acesso autenticado para a equipe

### 1.4 Público-alvo
- Equipe comercial / gestores de parcerias
- Gerentes de negócios
- Diretoria (visualização de relatórios)

---

## 2. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS 3 |
| Componentes UI | Componentes custom + Radix UI primitives |
| Gráficos | Recharts |
| Backend | Next.js API Routes + Server Actions |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Deploy | Vercel |
| Repositório | GitHub |

---

## 3. Funcionalidades

### 3.1 Autenticação
| ID | Requisito | Prioridade |
|---|---|---|
| AUTH-01 | Login com email + senha via Supabase Auth | P0 |
| AUTH-02 | Middleware protegendo rotas do dashboard | P0 |
| AUTH-03 | Logout com redirecionamento para /login | P0 |
| AUTH-04 | Nome do usuário exibido na sidebar | P0 |
| AUTH-05 | Sessão persistente via cookies | P0 |

### 3.2 Layout
| ID | Requisito | Prioridade |
|---|---|---|
| LAY-01 | Sidebar fixa (240px) com cor #46347F | P0 |
| LAY-02 | Navegação: Dashboard, Oportunidades, Parceiros, Relatórios | P0 |
| LAY-03 | Ícones Lucide React em cada item do menu | P1 |
| LAY-04 | Indicador visual de rota ativa | P1 |
| LAY-05 | Rodapé da sidebar com avatar, nome e logout | P0 |
| LAY-06 | Layout responsivo (funcional em tablet) | P1 |

### 3.3 Dashboard (`/`)
| ID | Requisito | Prioridade |
|---|---|---|
| DASH-01 | Card: Total de oportunidades | P0 |
| DASH-02 | Card: Oportunidades ativas (verde) | P0 |
| DASH-03 | Card: Vencendo em 15 dias (amarelo) | P0 |
| DASH-04 | Card: Expiradas (vermelho) | P0 |
| DASH-05 | Card: Número de parceiros | P0 |
| DASH-06 | Tabela "Oportunidades Recentes" (últimas 5) | P0 |
| DASH-07 | Link "Ver todas" para /oportunidades | P1 |

### 3.4 Oportunidades — CRUD
| ID | Requisito | Prioridade |
|---|---|---|
| OPT-01 | Listagem com todas as colunas | P0 |
| OPT-02 | Filtro por texto (busca em título, parceiro, órgão, solução, registrado por) | P0 |
| OPT-03 | Filtro por status (Ativo / Vencendo / Expirado) | P0 |
| OPT-04 | Filtro por parceiro (select) | P1 |
| OPT-05 | Ordenação por coluna clicável | P1 |
| OPT-06 | Criar nova oportunidade com formulário validado | P0 |
| OPT-07 | Editar oportunidade existente | P0 |
| OPT-08 | Excluir com confirmação (AlertDialog) | P0 |
| OPT-09 | Página de detalhe com todos os campos | P0 |
| OPT-10 | Status como badge colorido (verde/amarelo/vermelho) | P0 |
| OPT-11 | Autocomplete de parceiros no formulário | P1 |
| OPT-12 | Pré-preenchimento de "registrado por" com usuário logado | P1 |
| OPT-13 | Validação: data_validade >= data_registro | P0 |

### 3.5 Formulário de Oportunidade — Campos
| Campo | Tipo | Obrigatório |
|---|---|---|
| parceiro_nome | Text + autocomplete | Sim |
| titulo | Text | Sim |
| orgao_empresa | Text | Sim |
| registrado_por | Text (pré-preenchido) | Sim |
| data_registro | Date (default: hoje) | Sim |
| data_validade | Date | Sim |
| solucao_especifica | Text | Não |
| descricao | Textarea | Não |
| observacoes | Textarea | Não |

### 3.6 Parceiros — CRUD (`/parceiros`)
| ID | Requisito | Prioridade |
|---|---|---|
| PAR-01 | Tabela de parceiros cadastrados | P0 |
| PAR-02 | Formulário de cadastro (nome, email, telefone, empresa) | P0 |
| PAR-03 | Coluna com contagem de oportunidades por parceiro | P1 |
| PAR-04 | Excluir parceiro com confirmação | P0 |

### 3.7 Relatórios (`/relatorios`)
| ID | Requisito | Prioridade |
|---|---|---|
| REL-01 | Oportunidades por Parceiro — gráfico de barras horizontal + tabela | P0 |
| REL-02 | Oportunidades por Status — cards + donut chart | P0 |
| REL-03 | Top 10 Órgãos/Empresas — gráfico de barras | P1 |
| REL-04 | Linha do Tempo — lista ordenada por data_validade com destaque visual | P1 |
| REL-05 | Exportar CSV com todos os dados | P0 |
| REL-06 | Imprimir / PDF via window.print() com CSS @media print | P1 |

---

## 4. Modelo de Dados

### 4.1 Tabela `parceiros`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | Identificador único |
| nome | TEXT NOT NULL | Nome do parceiro |
| email | TEXT | Email de contato |
| telefone | TEXT | Telefone |
| empresa | TEXT | Empresa do parceiro |
| criado_em | TIMESTAMPTZ | Data de criação |

### 4.2 Tabela `oportunidades`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | Identificador único |
| parceiro_id | UUID (FK → parceiros) | Referência ao parceiro |
| parceiro_nome | TEXT NOT NULL | Cache do nome (exibição rápida) |
| titulo | TEXT NOT NULL | Título da oportunidade |
| descricao | TEXT | Descrição detalhada |
| orgao_empresa | TEXT NOT NULL | Órgão público ou empresa cliente |
| solucao_especifica | TEXT | Campo opcional |
| registrado_por | TEXT NOT NULL | Nome de quem registrou |
| registrado_por_id | UUID | Referência ao user do Supabase Auth |
| data_registro | DATE | Data de registro (default: hoje) |
| data_validade | DATE NOT NULL | Data de validade |
| status | TEXT (GENERATED) | Calculado: ativo / vencendo / expirado |
| observacoes | TEXT | Observações gerais |
| criado_em | TIMESTAMPTZ | Timestamp de criação |
| atualizado_em | TIMESTAMPTZ | Timestamp de atualização |

### 4.3 Lógica de Status (coluna GENERATED)
```sql
CASE
  WHEN data_validade < CURRENT_DATE THEN 'expirado'
  WHEN data_validade <= CURRENT_DATE + INTERVAL '15 days' THEN 'vencendo'
  ELSE 'ativo'
END
```

### 4.4 Segurança (RLS)
- Ambas as tabelas têm Row Level Security habilitado
- Policy: apenas usuários autenticados podem ler/escrever

---

## 5. Design System

### 5.1 Cores
| Token | Valor | Uso |
|---|---|---|
| Background | `#0c0e14` | Fundo principal |
| Surface | `#13151e` | Cards, sidebar content |
| Sidebar | `#46347F` | Sidebar lateral |
| Border | `#252836` | Bordas |
| Accent | `#4f8ef7` | Botões primários, links |
| Verde | `#22c55e` | Status ativo |
| Amarelo | `#f59e0b` | Status vencendo |
| Vermelho | `#ef4444` | Status expirado, destructive |
| Texto primário | `#e8eaf0` | Texto principal |
| Texto secundário | `#6b7280` | Texto auxiliar |

### 5.2 Tipografia
| Fonte | Uso | Pesos |
|---|---|---|
| Syne | Títulos (h1-h6) | 700, 800 |
| DM Sans | Corpo, UI | 400, 500, 600, 700 |

### 5.3 Componentes
- Cards: `border-radius: 12px`, `border: 1px solid #252836`
- Badges de status: fundo colorido translúcido (15% opacidade) + texto sólido
- Inputs: fundo `#1a1d2a`, borda `#252836`
- Sidebar: 240px fixa, cor `#46347F`

---

## 6. Arquitetura

### 6.1 Estrutura de Rotas
```
/login                    → Página de login (pública)
/                         → Dashboard (protegida)
/oportunidades            → Listagem de oportunidades
/oportunidades/nova       → Formulário de criação
/oportunidades/[id]       → Detalhe + edição
/parceiros                → Listagem e cadastro de parceiros
/relatorios               → Relatórios e exportação
```

### 6.2 Padrões Técnicos
- **Server Components**: fetch de dados (dashboard, listagens, detalhes)
- **Client Components**: formulários, filtros, modais, gráficos
- **Server Actions**: todas as mutations (criar, atualizar, excluir)
- **Middleware**: verificação de autenticação em todas as rotas

### 6.3 Estrutura de Arquivos
```
src/
├── app/
│   ├── login/              → Login page + layout
│   ├── (dashboard)/        → Grupo protegido
│   │   ├── page.tsx        → Dashboard
│   │   ├── actions.ts      → Server Actions (CRUD)
│   │   ├── layout.tsx      → Layout com Sidebar
│   │   ├── oportunidades/  → CRUD oportunidades
│   │   ├── parceiros/      → CRUD parceiros
│   │   └── relatorios/     → Relatórios
│   ├── globals.css
│   └── layout.tsx          → Root layout
├── components/
│   ├── layout/             → Sidebar, Header
│   ├── oportunidades/      → Form, List, Detail, StatusBadge
│   ├── parceiros/          → ParceirosClient
│   ├── relatorios/         → RelatoriosClient
│   └── ui/                 → Button, Input, Dialog, etc.
├── lib/
│   ├── supabase.ts         → Client-side Supabase
│   ├── supabase-server.ts  → Server-side Supabase
│   ├── types.ts            → TypeScript interfaces
│   └── utils.ts            → Formatação, status colors
└── middleware.ts            → Auth middleware
```

---

## 7. Infraestrutura

| Serviço | Uso | URL |
|---|---|---|
| GitHub | Repositório de código | github.com/anaperci/nexia-partners |
| Vercel | Hosting + CI/CD | nexia-partners.vercel.app |
| Supabase | BD + Auth | Projeto ydnwqptkrftonunyjzoc |

### 7.1 Variáveis de Ambiente
| Variável | Ambiente |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + Local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + Local |

---

## 8. Roadmap Futuro

### Fase 2 — Melhorias (backlog)
| ID | Feature | Descrição |
|---|---|---|
| F2-01 | Notificações | Alertas por email quando oportunidades estão vencendo |
| F2-02 | Roles/Permissões | Diferentes níveis de acesso (admin, editor, viewer) |
| F2-03 | Histórico | Log de alterações em cada oportunidade |
| F2-04 | Anexos | Upload de documentos vinculados às oportunidades |
| F2-05 | Kanban | Visualização kanban por status |
| F2-06 | API pública | Endpoints para integração com sistemas externos |
| F2-07 | Dashboard avançado | Filtros por período, comparativo mensal |
| F2-08 | Multi-tenant | Suporte a múltiplas organizações |
| F2-09 | PWA | App instalável com suporte offline básico |
| F2-10 | Integração WhatsApp | Notificações via Evolution API |

---

## 9. Critérios de Aceite (MVP)

- [ ] Usuário consegue fazer login com email/senha
- [ ] Usuário não autenticado é redirecionado para /login
- [ ] Dashboard exibe métricas corretas em tempo real
- [ ] CRUD completo de oportunidades funciona sem erros
- [ ] Status muda automaticamente conforme data de validade
- [ ] Filtros e ordenação funcionam na listagem
- [ ] Parceiros podem ser cadastrados e vinculados a oportunidades
- [ ] Relatórios exibem gráficos corretos
- [ ] CSV é exportado com todos os dados
- [ ] Sistema funciona em desktop e tablet
