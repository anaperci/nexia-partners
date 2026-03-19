import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/oportunidades/StatusBadge'

describe('StatusBadge', () => {
  it('exibe label "Ativo" com classes verdes', () => {
    const { container } = render(<StatusBadge status="ativo" />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('green')
  })

  it('exibe label "Vencendo" com classes amarelas', () => {
    const { container } = render(<StatusBadge status="vencendo" />)
    expect(screen.getByText('Vencendo')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('amber')
  })

  it('exibe label "Expirado" com classes vermelhas', () => {
    const { container } = render(<StatusBadge status="expirado" />)
    expect(screen.getByText('Expirado')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('red')
  })

  it('exibe status desconhecido com classes cinza', () => {
    const { container } = render(<StatusBadge status="desconhecido" />)
    expect(screen.getByText('desconhecido')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('gray')
  })

  it('renderiza como span inline', () => {
    const { container } = render(<StatusBadge status="ativo" />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })
})
