"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { criarOportunidade, atualizarOportunidade } from "@/app/(dashboard)/actions"
import type { Oportunidade, OportunidadeInsert, Parceiro } from "@/lib/types"

interface DuracaoConfig {
  global: number
  porParceiro: Record<string, number>
}

interface Prefill {
  orgao_empresa?: string
  titulo?: string
  solucao_especifica?: string
  observacoes?: string
  pdti_id?: string
}

interface OportunidadeFormProps {
  oportunidade?: Oportunidade
  parceiros: Parceiro[]
  userId?: string
  userName?: string
  duracaoConfig?: DuracaoConfig
  prefill?: Prefill
}

export function OportunidadeForm({ oportunidade, parceiros, userId, userName, duracaoConfig, prefill }: OportunidadeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    parceiro_nome: oportunidade?.parceiro_nome || "",
    parceiro_id: oportunidade?.parceiro_id || "",
    titulo: oportunidade?.titulo || prefill?.titulo || "",
    orgao_empresa: oportunidade?.orgao_empresa || prefill?.orgao_empresa || "",
    registrado_por: oportunidade?.registrado_por || userName || "",
    registrado_por_id: oportunidade?.registrado_por_id || userId || "",
    data_registro: oportunidade?.data_registro || new Date().toISOString().split("T")[0],
    data_validade: oportunidade?.data_validade || "",
    solucao_especifica: oportunidade?.solucao_especifica || prefill?.solucao_especifica || "",
    descricao: oportunidade?.descricao || "",
    observacoes: oportunidade?.observacoes || prefill?.observacoes || "",
  })

  const [filteredParceiros, setFilteredParceiros] = useState<Parceiro[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (form.parceiro_nome.length > 0) {
      const filtered = parceiros.filter((p) =>
        p.nome.toLowerCase().includes(form.parceiro_nome.toLowerCase())
      )
      setFilteredParceiros(filtered)
    } else {
      setFilteredParceiros([])
    }
  }, [form.parceiro_nome, parceiros])

  // Auto-calcular data_validade ao selecionar parceiro (só em criação)
  function calcularValidade(parceiroId: string, dataRegistro: string) {
    if (oportunidade) return // não alterar em edição
    if (!duracaoConfig || !dataRegistro) return
    const meses = duracaoConfig.porParceiro[parceiroId] || duracaoConfig.global
    const data = new Date(dataRegistro)
    data.setMonth(data.getMonth() + meses)
    const novaValidade = data.toISOString().split("T")[0]
    setForm((prev) => ({ ...prev, data_validade: novaValidade }))
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.parceiro_nome.trim()) newErrors.parceiro_nome = "Parceiro é obrigatório"
    if (!form.titulo.trim()) newErrors.titulo = "Título é obrigatório"
    if (!form.orgao_empresa.trim()) newErrors.orgao_empresa = "Órgão/Empresa é obrigatório"
    if (!form.registrado_por.trim()) newErrors.registrado_por = "Registrado por é obrigatório"
    if (!form.data_registro) newErrors.data_registro = "Data de registro é obrigatória"
    if (!form.data_validade) newErrors.data_validade = "Data de validade é obrigatória"
    if (form.data_validade && form.data_registro && form.data_validade < form.data_registro) {
      newErrors.data_validade = "Data de validade deve ser maior ou igual à data de registro"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      if (oportunidade) {
        await atualizarOportunidade(oportunidade.id, form)
        toast.success("Oportunidade atualizada com sucesso!")
        router.push(`/oportunidades/${oportunidade.id}`)
      } else {
        await criarOportunidade(form as OportunidadeInsert)
        toast.success("Oportunidade criada com sucesso!")
        router.push("/oportunidades")
      }
      router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const inputStyle = { background: '#f9fafb', color: '#111827' }
  const inputClass = "border-[#e5e7eb] focus:border-[#46347F]"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Parceiro com autocomplete */}
      <div className="space-y-2 relative">
        <Label style={{ color: '#111827' }}>Parceiro *</Label>
        <Input
          value={form.parceiro_nome}
          onChange={(e) => {
            updateField("parceiro_nome", e.target.value)
            updateField("parceiro_id", "")
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Digite o nome do parceiro"
          className={inputClass}
          style={inputStyle}
        />
        {showSuggestions && filteredParceiros.length > 0 && (
          <div className="absolute z-10 w-full mt-1 rounded-lg border max-h-40 overflow-y-auto" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            {filteredParceiros.map((p) => (
              <button
                key={p.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                style={{ color: '#111827' }}
                onClick={() => {
                  updateField("parceiro_nome", p.nome)
                  updateField("parceiro_id", p.id)
                  calcularValidade(p.id, form.data_registro)
                  setShowSuggestions(false)
                }}
              >
                {p.nome} {p.empresa && <span style={{ color: '#6b7280' }}>— {p.empresa}</span>}
              </button>
            ))}
          </div>
        )}
        {errors.parceiro_nome && <p className="text-xs text-red-400">{errors.parceiro_nome}</p>}
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Título da Oportunidade *</Label>
        <Input value={form.titulo} onChange={(e) => updateField("titulo", e.target.value)} placeholder="Ex: Licitação de TI" className={inputClass} style={inputStyle} />
        {errors.titulo && <p className="text-xs text-red-400">{errors.titulo}</p>}
      </div>

      {/* Órgão/Empresa */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Órgão/Empresa Cliente *</Label>
        <Input value={form.orgao_empresa} onChange={(e) => updateField("orgao_empresa", e.target.value)} placeholder="Ex: Prefeitura Municipal" className={inputClass} style={inputStyle} />
        {errors.orgao_empresa && <p className="text-xs text-red-400">{errors.orgao_empresa}</p>}
      </div>

      {/* Registrado por */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Registrado por *</Label>
        <Input value={form.registrado_por} onChange={(e) => updateField("registrado_por", e.target.value)} className={inputClass} style={inputStyle} />
        {errors.registrado_por && <p className="text-xs text-red-400">{errors.registrado_por}</p>}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label style={{ color: '#111827' }}>Data de Registro *</Label>
          <Input type="date" value={form.data_registro} onChange={(e) => updateField("data_registro", e.target.value)} className={inputClass} style={inputStyle} />
          {errors.data_registro && <p className="text-xs text-red-400">{errors.data_registro}</p>}
        </div>
        <div className="space-y-2">
          <Label style={{ color: '#111827' }}>Data de Validade *</Label>
          <Input type="date" value={form.data_validade} onChange={(e) => updateField("data_validade", e.target.value)} className={inputClass} style={inputStyle} />
          {errors.data_validade && <p className="text-xs text-red-400">{errors.data_validade}</p>}
        </div>
      </div>

      {/* Solução específica (opcional) */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Solução Específica <span style={{ color: '#6b7280' }}>(opcional)</span></Label>
        <Input value={form.solucao_especifica} onChange={(e) => updateField("solucao_especifica", e.target.value)} placeholder="Ex: Software de gestão" className={inputClass} style={inputStyle} />
      </div>

      {/* Descrição (opcional) */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Descrição <span style={{ color: '#6b7280' }}>(opcional)</span></Label>
        <Textarea value={form.descricao} onChange={(e) => updateField("descricao", e.target.value)} rows={3} className={inputClass} style={inputStyle} />
      </div>

      {/* Observações (opcional) */}
      <div className="space-y-2">
        <Label style={{ color: '#111827' }}>Observações <span style={{ color: '#6b7280' }}>(opcional)</span></Label>
        <Textarea value={form.observacoes} onChange={(e) => updateField("observacoes", e.target.value)} rows={3} className={inputClass} style={inputStyle} />
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#e5e7eb]" style={{ color: '#111827', background: 'transparent' }}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button type="submit" disabled={loading} style={{ background: '#46347F', color: '#fff' }}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {oportunidade ? "Salvar Alterações" : "Criar Oportunidade"}
        </Button>
      </div>
    </form>
  )
}
