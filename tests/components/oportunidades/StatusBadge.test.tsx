import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/oportunidades/StatusBadge'

describe('StatusBadge', () => {
  it('exibe label "Ativo" com classes corretas', () => {
    const { container } = render(<StatusBadge status="ativo" />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('eaf3de')
  })

  it('exibe label "Vencendo" com pulse indicator', () => {
    const { container } = render(<StatusBadge status="vencendo" />)
    expect(screen.getByText('Vencendo')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('faeeda')
    // Pulse dot exists
    expect(container.querySelector('.animate-ping')).toBeTruthy()
  })

  it('exibe label "Expirado" com classes corretas', () => {
    const { container } = render(<StatusBadge status="expirado" />)
    expect(screen.getByText('Expirado')).toBeInTheDocument()
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('fcebeb')
  })

  it('exibe status desconhecido com fallback', () => {
    render(<StatusBadge status="desconhecido" />)
    expect(screen.getByText('desconhecido')).toBeInTheDocument()
  })

  it('renderiza como span inline', () => {
    const { container } = render(<StatusBadge status="ativo" />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })
})
