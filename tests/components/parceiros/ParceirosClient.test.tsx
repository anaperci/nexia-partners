import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ParceirosClient } from '@/components/parceiros/ParceirosClient'
import { mockParceiros } from '../../__mocks__/supabase'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))
jest.mock('@/app/(dashboard)/actions', () => ({
  criarParceiro: jest.fn(),
  excluirParceiro: jest.fn(),
}))

const parceirosComContagem = mockParceiros.map((p, i) => ({ ...p, _count: i + 1 }))

describe('ParceirosClient', () => {
  it('renderiza tabela com parceiros', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    expect(screen.getByText('Parceiro Alpha')).toBeInTheDocument()
    expect(screen.getByText('Parceiro Beta')).toBeInTheDocument()
    expect(screen.getByText('Parceiro Gamma')).toBeInTheDocument()
  })

  it('exibe contagem de oportunidades', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('exibe "—" para campos nulos', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThan(0) // Gamma tem email e telefone null
  })

  it('exibe mensagem quando não há parceiros', () => {
    render(<ParceirosClient parceiros={[]} />)
    expect(screen.getByText('Nenhum parceiro cadastrado.')).toBeInTheDocument()
  })

  it('renderiza botão de novo parceiro', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    expect(screen.getByText('Novo Parceiro')).toBeInTheDocument()
  })

  it('abre dialog ao clicar em novo parceiro', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    fireEvent.click(screen.getByText('Novo Parceiro'))
    expect(screen.getByText('Cadastrar Parceiro')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nome do parceiro')).toBeInTheDocument()
  })

  it('renderiza cabeçalhos da tabela', () => {
    render(<ParceirosClient parceiros={parceirosComContagem} />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Telefone')).toBeInTheDocument()
    expect(screen.getByText('Empresa')).toBeInTheDocument()
    expect(screen.getByText('Oportunidades')).toBeInTheDocument()
  })
})
