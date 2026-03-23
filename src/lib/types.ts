export type ParceiroStatus = 'ativo' | 'inativo' | 'suspenso'
export type UsuarioStatus = 'ativo' | 'inativo'

export interface Parceiro {
  id: string
  nome: string
  email?: string
  telefone?: string
  empresa?: string
  razao_social?: string
  cnpj?: string
  email_comercial?: string
  site?: string
  cidade?: string
  estado?: string
  segmentos?: string[]
  status?: ParceiroStatus
  observacoes?: string
  criado_em: string
  atualizado_em?: string
  _count?: number
  _usuarios?: number
}

export interface ParceiroUsuario {
  id: string
  parceiro_id: string
  user_id?: string
  nome: string
  email: string
  cargo?: string
  telefone?: string
  status: UsuarioStatus
  convite_enviado: boolean
  convite_aceito: boolean
  criado_em: string
  atualizado_em: string
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
  contato_nome?: string
  contato_cargo?: string
  contato_contato?: string
  criado_em: string
  atualizado_em: string
}

export type OportunidadeInsert = Omit<Oportunidade, 'id' | 'status' | 'criado_em' | 'atualizado_em'>
export type OportunidadeUpdate = Partial<OportunidadeInsert>

export interface UserProfile {
  id: string
  nome: string
  perfil: 'nexia' | 'parceiro'
  parceiro_id?: string
  onboarding_completo?: boolean
  empresa?: string
  cargo?: string
  telefone?: string
  segmentos_atuacao?: string[]
  como_conheceu?: string
  criado_em: string
}

export interface OportunidadePDTI {
  id: string
  orgao_nome: string
  descricao: string
  area?: string
  potencial: 'alto' | 'medio' | 'baixo'
  timing_previsto?: string
  orcamento_estimado?: number
  evidencia_texto?: string
  pdti_documento?: string
  oportunidade_parceiro_id?: string
  criado_em: string
}

export interface ConfiguracaoDuracao {
  id: string
  parceiro_id?: string
  duracao_meses: number
  descricao?: string
  criado_em: string
  atualizado_em: string
  parceiro_nome?: string
}
