import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { OportunidadesListClient } from '@/components/oportunidades/OportunidadesListClient'
import { mockOportunidades, mockParceiros } from '../../__mocks__/supabase'

// Mocks necessários
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))
jest.mock('@/app/(dashboard)/actions', () => ({
  excluirOportunidade: jest.fn(),
}))

const parceirosSimples = mockParceiros.map(p => ({ id: p.id, nome: p.nome }))

describe('OportunidadesListClient', () => {
  it('renderiza tabela com oportunidades', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    expect(screen.getByText('Licitação TI')).toBeInTheDocument()
    expect(screen.getByText('Contrato Cloud')).toBeInTheDocument()
    expect(screen.getByText('Projeto ERP')).toBeInTheDocument()
  })

  it('exibe contagem correta', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    expect(screen.getByText('3 de 3 oportunidades')).toBeInTheDocument()
  })

  it('exibe mensagem quando não há oportunidades', () => {
    render(<OportunidadesListClient oportunidades={[]} parceiros={[]} />)
    expect(screen.getByText('Nenhuma oportunidade encontrada.')).toBeInTheDocument()
  })

  it('filtra por texto de busca', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    const input = screen.getByPlaceholderText(/Buscar por título/)
    fireEvent.change(input, { target: { value: 'Cloud' } })
    expect(screen.getByText('Contrato Cloud')).toBeInTheDocument()
    expect(screen.queryByText('Licitação TI')).not.toBeInTheDocument()
    expect(screen.getByText('1 de 3 oportunidades')).toBeInTheDocument()
  })

  it('filtra por status', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    const select = screen.getAllByRole('combobox')[0] // primeiro select = status
    fireEvent.change(select, { target: { value: 'ativo' } })
    expect(screen.getByText('Licitação TI')).toBeInTheDocument()
    expect(screen.queryByText('Projeto ERP')).not.toBeInTheDocument()
  })

  it('filtra por parceiro', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    const selects = screen.getAllByRole('combobox')
    const parceiroSelect = selects[1] // segundo select = parceiro
    fireEvent.change(parceiroSelect, { target: { value: 'Parceiro Beta' } })
    expect(screen.getByText('Contrato Cloud')).toBeInTheDocument()
    expect(screen.queryByText('Licitação TI')).not.toBeInTheDocument()
  })

  it('exibe badges de status corretos', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    // Badges existem (além das options do select de filtro)
    const ativos = screen.getAllByText('Ativo')
    expect(ativos.length).toBeGreaterThanOrEqual(1)
    const vencendo = screen.getAllByText('Vencendo')
    expect(vencendo.length).toBeGreaterThanOrEqual(1)
    const expirados = screen.getAllByText('Expirado')
    expect(expirados.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza cabeçalhos da tabela', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Parceiro')).toBeInTheDocument()
    expect(screen.getByText('Órgão/Empresa')).toBeInTheDocument()
    expect(screen.getByText('Validade')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('ordena ao clicar no cabeçalho', () => {
    render(<OportunidadesListClient oportunidades={mockOportunidades} parceiros={parceirosSimples} />)
    const tituloHeader = screen.getByText('Título')
    fireEvent.click(tituloHeader) // sort asc
    fireEvent.click(tituloHeader) // sort desc
    // Não quebra ao alternar ordenação
    expect(screen.getByText('Licitação TI')).toBeInTheDocument()
  })
})
