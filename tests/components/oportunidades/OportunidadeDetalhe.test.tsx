import React from 'react'
import { render, screen } from '@testing-library/react'
import { OportunidadeDetalhe } from '@/components/oportunidades/OportunidadeDetalhe'
import { mockOportunidades } from '../../__mocks__/supabase'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))
jest.mock('@/app/(dashboard)/actions', () => ({
  excluirOportunidade: jest.fn(),
}))

describe('OportunidadeDetalhe', () => {
  const op = mockOportunidades[0]

  it('renderiza título da oportunidade', () => {
    render(<OportunidadeDetalhe oportunidade={op} />)
    // O título aparece no Header e no grid de detalhes
    const titles = screen.getAllByText('Licitação TI')
    expect(titles.length).toBeGreaterThanOrEqual(1)
  })

  it('exibe status badge', () => {
    render(<OportunidadeDetalhe oportunidade={op} />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('exibe todos os campos', () => {
    render(<OportunidadeDetalhe oportunidade={op} />)
    expect(screen.getByText('Parceiro Alpha')).toBeInTheDocument()
    expect(screen.getByText('Prefeitura Municipal')).toBeInTheDocument()
    expect(screen.getByText('Servidores Dell')).toBeInTheDocument()
    expect(screen.getByText('01/03/2026')).toBeInTheDocument()
    expect(screen.getByText('31/12/2026')).toBeInTheDocument()
  })

  it('exibe "—" para campos opcionais vazios', () => {
    const opSemDesc = { ...mockOportunidades[1], descricao: null, solucao_especifica: null, observacoes: null }
    render(<OportunidadeDetalhe oportunidade={opSemDesc} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(2)
  })

  it('renderiza botões Voltar, Editar e Excluir', () => {
    render(<OportunidadeDetalhe oportunidade={op} />)
    expect(screen.getByText('Voltar')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('renderiza labels dos campos', () => {
    render(<OportunidadeDetalhe oportunidade={op} />)
    expect(screen.getByText('Parceiro')).toBeInTheDocument()
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Órgão/Empresa')).toBeInTheDocument()
    expect(screen.getByText('Registrado por')).toBeInTheDocument()
    expect(screen.getByText('Data de Registro')).toBeInTheDocument()
    expect(screen.getByText('Data de Validade')).toBeInTheDocument()
  })
})
