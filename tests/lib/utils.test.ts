import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'

describe('utils', () => {
  describe('formatDate', () => {
    it('formata data ISO para dd/MM/yyyy', () => {
      expect(formatDate('2026-03-19')).toBe('19/03/2026')
    })

    it('formata data com timezone', () => {
      expect(formatDate('2026-01-01')).toBe('01/01/2026')
    })

    it('formata data no fim do ano', () => {
      expect(formatDate('2026-12-31')).toBe('31/12/2026')
    })
  })

  describe('formatDateTime', () => {
    it('formata data+hora ISO para dd/MM/yyyy HH:mm', () => {
      const result = formatDateTime('2026-03-19T14:30:00Z')
      expect(result).toMatch(/19\/03\/2026/)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('getStatusColor', () => {
    it('retorna verde para status ativo', () => {
      const result = getStatusColor('ativo')
      expect(result.label).toBe('Ativo')
      expect(result.bg).toContain('green')
      expect(result.text).toContain('green')
    })

    it('retorna amarelo para status vencendo', () => {
      const result = getStatusColor('vencendo')
      expect(result.label).toBe('Vencendo')
      expect(result.bg).toContain('amber')
      expect(result.text).toContain('amber')
    })

    it('retorna vermelho para status expirado', () => {
      const result = getStatusColor('expirado')
      expect(result.label).toBe('Expirado')
      expect(result.bg).toContain('red')
      expect(result.text).toContain('red')
    })

    it('retorna cinza para status desconhecido', () => {
      const result = getStatusColor('outro')
      expect(result.label).toBe('outro')
      expect(result.bg).toContain('gray')
    })
  })
})
