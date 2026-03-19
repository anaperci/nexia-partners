import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OportunidadeForm } from '@/components/oportunidades/OportunidadeForm'
import { mockParceiros } from '../../__mocks__/supabase'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh, back: jest.fn() }),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))
jest.mock('@/app/(dashboard)/actions', () => ({
  criarOportunidade: jest.fn().mockResolvedValue(undefined),
  atualizarOportunidade: jest.fn().mockResolvedValue(undefined),
}))

describe('OportunidadeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza todos os campos obrigatórios', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    expect(screen.getByText('Parceiro *')).toBeInTheDocument()
    expect(screen.getByText(/Título da Oportunidade/)).toBeInTheDocument()
    expect(screen.getByText(/Órgão\/Empresa Cliente/)).toBeInTheDocument()
    expect(screen.getByText(/Registrado por/)).toBeInTheDocument()
    expect(screen.getByText(/Data de Registro/)).toBeInTheDocument()
    expect(screen.getByText(/Data de Validade/)).toBeInTheDocument()
  })

  it('renderiza campos opcionais com label (opcional)', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    expect(screen.getByText(/Solução Específica/)).toBeInTheDocument()
    expect(screen.getByText(/Descrição/)).toBeInTheDocument()
    expect(screen.getByText(/Observações/)).toBeInTheDocument()
    // Verifica que "(opcional)" aparece
    const optionals = screen.getAllByText('(opcional)')
    expect(optionals.length).toBe(3)
  })

  it('pré-preenche registrado_por com userName', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Ana Paula" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    const registradoPor = inputs.find(i => i.value === 'Ana Paula')
    expect(registradoPor).toBeTruthy()
  })

  it('exibe botão "Criar Oportunidade" em modo criação', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    expect(screen.getByText('Criar Oportunidade')).toBeInTheDocument()
  })

  it('exibe botão "Salvar Alterações" em modo edição', () => {
    const op = {
      id: 'op1', parceiro_id: 'p1', parceiro_nome: 'Alpha', titulo: 'Teste',
      orgao_empresa: 'Órgão', registrado_por: 'User', data_registro: '2026-03-01',
      data_validade: '2026-12-31', status: 'ativo' as const,
      criado_em: '2026-03-01T10:00:00Z', atualizado_em: '2026-03-01T10:00:00Z',
    }
    render(<OportunidadeForm oportunidade={op} parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument()
  })

  it('mostra erro ao submeter sem campos obrigatórios', async () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="" />)
    // Limpar o campo parceiro
    const parceiroInput = screen.getByPlaceholderText('Digite o nome do parceiro')
    fireEvent.change(parceiroInput, { target: { value: '' } })

    fireEvent.click(screen.getByText('Criar Oportunidade'))

    await waitFor(() => {
      expect(screen.getByText('Parceiro é obrigatório')).toBeInTheDocument()
    })
  })

  it('valida que data_validade >= data_registro', async () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)

    // Preencher campos obrigatórios
    fireEvent.change(screen.getByPlaceholderText('Digite o nome do parceiro'), { target: { value: 'Alpha' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: Licitação de TI'), { target: { value: 'Teste' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: Prefeitura Municipal'), { target: { value: 'Órgão' } })

    // Data registro > validade
    const dateInputs = screen.getAllByDisplayValue('')
    // Encontrar inputs de data pelo tipo
    const allInputs = document.querySelectorAll('input[type="date"]')
    if (allInputs[0] && allInputs[1]) {
      fireEvent.change(allInputs[0], { target: { value: '2026-06-01' } })
      fireEvent.change(allInputs[1], { target: { value: '2026-01-01' } })
    }

    fireEvent.click(screen.getByText('Criar Oportunidade'))

    await waitFor(() => {
      expect(screen.getByText('Data de validade deve ser maior ou igual à data de registro')).toBeInTheDocument()
    })
  })

  it('mostra sugestões de parceiros ao digitar', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    const input = screen.getByPlaceholderText('Digite o nome do parceiro')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Alpha' } })
    expect(screen.getByText(/Alpha Corp/)).toBeInTheDocument()
  })

  it('renderiza botão Voltar', () => {
    render(<OportunidadeForm parceiros={mockParceiros} userId="user-123" userName="Teste" />)
    expect(screen.getByText('Voltar')).toBeInTheDocument()
  })
})
