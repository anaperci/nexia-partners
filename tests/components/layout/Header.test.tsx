import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('renderiza título', () => {
    render(<Header title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renderiza descrição quando fornecida', () => {
    render(<Header title="Dashboard" description="Visão geral" />)
    expect(screen.getByText('Visão geral')).toBeInTheDocument()
  })

  it('não renderiza descrição quando não fornecida', () => {
    const { container } = render(<Header title="Dashboard" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('renderiza children (botões de ação)', () => {
    render(
      <Header title="Teste">
        <button>Ação</button>
      </Header>
    )
    expect(screen.getByText('Ação')).toBeInTheDocument()
  })

  it('usa font-family Syne no título', () => {
    render(<Header title="Teste" />)
    const h1 = screen.getByText('Teste')
    expect(h1.style.fontFamily).toContain('Syne')
  })
})
