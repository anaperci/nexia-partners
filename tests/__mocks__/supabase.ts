// Mock do Supabase client
export const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com', user_metadata: { name: 'Teste' } } },
    }),
    signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
}

export const createClient = jest.fn(() => mockSupabase)
export const createServerSupabaseClient = jest.fn(async () => mockSupabase)

// Dados de teste
export const mockParceiros = [
  { id: 'p1', nome: 'Parceiro Alpha', email: 'alpha@test.com', telefone: '11999990001', empresa: 'Alpha Corp', criado_em: '2026-01-15T10:00:00Z' },
  { id: 'p2', nome: 'Parceiro Beta', email: 'beta@test.com', telefone: '11999990002', empresa: 'Beta Ltda', criado_em: '2026-02-01T10:00:00Z' },
  { id: 'p3', nome: 'Parceiro Gamma', email: null, telefone: null, empresa: 'Gamma SA', criado_em: '2026-03-01T10:00:00Z' },
]

export const mockOportunidades = [
  {
    id: 'op1', parceiro_id: 'p1', parceiro_nome: 'Parceiro Alpha', titulo: 'Licitação TI',
    descricao: 'Fornecimento de equipamentos', orgao_empresa: 'Prefeitura Municipal',
    solucao_especifica: 'Servidores Dell', registrado_por: 'Teste', registrado_por_id: 'user-123',
    data_registro: '2026-03-01', data_validade: '2026-12-31', status: 'ativo' as const,
    observacoes: null, criado_em: '2026-03-01T10:00:00Z', atualizado_em: '2026-03-01T10:00:00Z',
  },
  {
    id: 'op2', parceiro_id: 'p2', parceiro_nome: 'Parceiro Beta', titulo: 'Contrato Cloud',
    descricao: null, orgao_empresa: 'Tribunal de Justiça',
    solucao_especifica: null, registrado_por: 'Teste', registrado_por_id: 'user-123',
    data_registro: '2026-03-10', data_validade: '2026-03-25', status: 'vencendo' as const,
    observacoes: 'Urgente', criado_em: '2026-03-10T10:00:00Z', atualizado_em: '2026-03-10T10:00:00Z',
  },
  {
    id: 'op3', parceiro_id: 'p1', parceiro_nome: 'Parceiro Alpha', titulo: 'Projeto ERP',
    descricao: 'Implantação ERP', orgao_empresa: 'Secretaria de Saúde',
    solucao_especifica: 'SAP', registrado_por: 'Maria', registrado_por_id: 'user-456',
    data_registro: '2026-01-01', data_validade: '2026-02-28', status: 'expirado' as const,
    observacoes: null, criado_em: '2026-01-01T10:00:00Z', atualizado_em: '2026-01-01T10:00:00Z',
  },
]
