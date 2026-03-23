"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { criarParceiroAction, editarParceiroAction } from "@/app/(dashboard)/parceiros/actions"
import type { Parceiro } from "@/lib/types"

const SEGMENTOS = ["Governo", "Saúde", "Educação", "Indústria", "Financeiro", "Varejo", "Outro"]
const UFS = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"]

interface Props {
  parceiro?: Parceiro
}

export function ParceiroForm({ parceiro }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: parceiro?.nome || "",
    razao_social: parceiro?.razao_social || "",
    cnpj: parceiro?.cnpj || "",
    email_comercial: parceiro?.email_comercial || "",
    telefone: parceiro?.telefone || "",
    site: parceiro?.site || "",
    cidade: parceiro?.cidade || "",
    estado: parceiro?.estado || "",
    segmentos: parceiro?.segmentos || [],
    status: parceiro?.status || "ativo",
    observacoes: parceiro?.observacoes || "",
  })

  function toggleSegmento(s: string) {
    setForm((prev) => ({
      ...prev,
      segmentos: prev.segmentos.includes(s)
        ? prev.segmentos.filter((x) => x !== s)
        : [...prev.segmentos, s],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return }
    setLoading(true)
    try {
      if (parceiro) {
        await editarParceiroAction(parceiro.id, form)
        toast.success("Parceiro atualizado!")
        router.push(`/parceiros/${parceiro.id}`)
      } else {
        await criarParceiroAction(form)
        toast.success("Parceiro criado!")
        router.push("/parceiros")
      }
      router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "border-black/[0.07] focus:border-[#46347F]"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {/* Informações básicas */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-[#1a1523]">Informações Básicas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#374151]">Nome *</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do parceiro" className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#374151]">Status</Label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-9 rounded-lg border border-black/[0.07] px-3 text-[13px] text-[#1a1523]">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#374151]">Razão Social</Label>
            <Input value={form.razao_social} onChange={(e) => setForm({ ...form, razao_social: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#374151]">CNPJ</Label>
            <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="XX.XXX.XXX/XXXX-XX" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-[#1a1523]">Contato</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#374151]">E-mail Comercial</Label>
            <Input type="email" value={form.email_comercial} onChange={(e) => setForm({ ...form, email_comercial: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#374151]">Telefone</Label>
            <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" className={inputClass} />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[#374151]">Site</Label>
          <Input value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} placeholder="https://" className={inputClass} />
        </div>
      </div>

      {/* Localização */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-[#1a1523]">Localização</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#374151]">Cidade</Label>
            <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#374151]">Estado</Label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full h-9 rounded-lg border border-black/[0.07] px-3 text-[13px] text-[#1a1523]">
              <option value="">Selecionar...</option>
              {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Segmentos */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-[#1a1523]">Segmentos de Atuação</h3>
        <div className="flex flex-wrap gap-2">
          {SEGMENTOS.map((s) => (
            <button key={s} type="button" onClick={() => toggleSegmento(s)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
              style={{
                background: form.segmentos.includes(s) ? "#46347F" : "transparent",
                color: form.segmentos.includes(s) ? "#fff" : "#374151",
                borderColor: form.segmentos.includes(s) ? "#46347F" : "rgba(0,0,0,0.07)",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-[#1a1523]">Observações</h3>
        <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} className={inputClass} />
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-black/[0.07]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button type="submit" disabled={loading} className="bg-[#46347F] hover:bg-[#3a2d6e] text-white">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {parceiro ? "Salvar Alterações" : "Criar Parceiro"}
        </Button>
      </div>
    </form>
  )
}
