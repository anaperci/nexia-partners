import type { Oportunidade, OportunidadeInsert, Parceiro } from '@/lib/types'

describe('types', () => {
  describe('Oportunidade', () => {
    it('aceita objeto com todos os campos obrigatórios', () => {
      const op: Oportunidade = {
        id: '123',
        parceiro_nome: 'Teste',
        titulo: 'Oportunidade Teste',
        orgao_empresa: 'Órgão Teste',
        registrado_por: 'User',
        data_registro: '2026-03-19',
        data_validade: '2026-12-31',
        status: 'ativo',
        criado_em: '2026-03-19T10:00:00Z',
        atualizado_em: '2026-03-19T10:00:00Z',
      }
      expect(op.status).toBe('ativo')
      expect(op.id).toBe('123')
    })

    it('aceita campos opcionais como undefined', () => {
      const op: Oportunidade = {
        id: '456',
        parceiro_nome: 'Teste',
        titulo: 'Oportunidade 2',
        orgao_empresa: 'Empresa',
        registrado_por: 'User',
        data_registro: '2026-03-19',
        data_validade: '2026-06-30',
        status: 'vencendo',
        criado_em: '2026-03-19T10:00:00Z',
        atualizado_em: '2026-03-19T10:00:00Z',
        descricao: undefined,
        solucao_especifica: undefined,
        observacoes: undefined,
        parceiro_id: undefined,
        registrado_por_id: undefined,
      }
      expect(op.descricao).toBeUndefined()
    })

    it('status deve ser um dos valores válidos', () => {
      const validStatuses: Oportunidade['status'][] = ['ativo', 'vencendo', 'expirado']
      validStatuses.forEach(s => {
        expect(['ativo', 'vencendo', 'expirado']).toContain(s)
      })
    })
  })

  describe('OportunidadeInsert', () => {
    it('não inclui id, status, criado_em, atualizado_em', () => {
      const insert: OportunidadeInsert = {
        parceiro_nome: 'Teste',
        titulo: 'Nova Op',
        orgao_empresa: 'Órgão',
        registrado_por: 'User',
        data_registro: '2026-03-19',
        data_validade: '2026-12-31',
      }
      expect(insert).not.toHaveProperty('id')
      expect(insert).not.toHaveProperty('status')
      expect(insert).not.toHaveProperty('criado_em')
      expect(insert).not.toHaveProperty('atualizado_em')
    })
  })

  describe('Parceiro', () => {
    it('aceita objeto com campos obrigatórios', () => {
      const p: Parceiro = {
        id: 'p1',
        nome: 'Parceiro Teste',
        criado_em: '2026-01-01T00:00:00Z',
      }
      expect(p.nome).toBe('Parceiro Teste')
    })

    it('aceita _count opcional para contagem', () => {
      const p: Parceiro = {
        id: 'p2',
        nome: 'Outro Parceiro',
        criado_em: '2026-01-01T00:00:00Z',
        _count: 5,
      }
      expect(p._count).toBe(5)
    })
  })
})
