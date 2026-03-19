export interface Parceiro {
  id: string
  nome: string
  email?: string
  telefone?: string
  empresa?: string
  criado_em: string
  _count?: number // contagem de oportunidades
}

export interface Oportunidade {
  id: string
  parceiro_id?: string
  parceiro_nome: string
  titulo: string
  descricao?: string
  orgao_empresa: string
  solucao_especifica?: string
  registrado_por: string
  registrado_por_id?: string
  data_registro: string
  data_validade: string
  status: 'ativo' | 'vencendo' | 'expirado'
  observacoes?: string
  criado_em: string
  atualizado_em: string
}

export type OportunidadeInsert = Omit<Oportunidade, 'id' | 'status' | 'criado_em' | 'atualizado_em'>
export type OportunidadeUpdate = Partial<OportunidadeInsert>
