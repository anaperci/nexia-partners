import { formatDate, formatDateTime } from '@/lib/utils'

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
})
