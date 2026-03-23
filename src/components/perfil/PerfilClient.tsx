"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { atualizarPerfil } from "@/app/(dashboard)/actions"
import type { UserProfile } from "@/lib/types"

const SEGMENTOS = ["Governo", "Saúde", "Educação", "Indústria", "Financeiro", "Varejo", "Outro"]

export function PerfilClient({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: profile.nome || "",
    empresa: profile.empresa || "",
    cargo: profile.cargo || "",
    telefone: profile.telefone || "",
    segmentos_atuacao: profile.segmentos_atuacao || [],
  })

  function toggleSegmento(s: string) {
    setForm((prev) => ({
      ...prev,
      segmentos_atuacao: prev.segmentos_atuacao.includes(s)
        ? prev.segmentos_atuacao.filter((x) => x !== s)
        : [...prev.segmentos_atuacao, s],
    }))
  }

  async function handleSave() {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return }
    setLoading(true)
    try {
      await atualizarPerfil(profile.id, form)
      toast.success("Perfil atualizado!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border p-6 space-y-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="space-y-2">
          <Label style={{ color: "#374151" }}>Nome completo *</Label>
          <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label style={{ color: "#374151" }}>Empresa</Label>
            <Input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
          </div>
          <div className="space-y-2">
            <Label style={{ color: "#374151" }}>Cargo</Label>
            <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label style={{ color: "#374151" }}>Telefone / WhatsApp</Label>
          <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            placeholder="(00) 00000-0000" className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
        </div>
        <div className="space-y-2">
          <Label style={{ color: "#374151" }}>Segmentos de atuação</Label>
          <div className="flex flex-wrap gap-2">
            {SEGMENTOS.map((s) => (
              <button key={s} type="button" onClick={() => toggleSegmento(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  background: form.segmentos_atuacao.includes(s) ? "#46347F" : "transparent",
                  color: form.segmentos_atuacao.includes(s) ? "#fff" : "#374151",
                  borderColor: form.segmentos_atuacao.includes(s) ? "#46347F" : "#d1d5db",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label style={{ color: "#374151" }}>E-mail</Label>
          <p className="text-sm py-2 px-3 rounded-md" style={{ background: "#f3f4f6", color: "#6b7280" }}>
            {profile.id ? "Gerenciado pelo sistema" : "—"}
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading} style={{ background: "#46347F", color: "#fff" }}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}
