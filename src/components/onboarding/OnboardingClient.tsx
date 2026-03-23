"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { salvarOnboarding } from "@/app/(dashboard)/actions"
import type { UserProfile } from "@/lib/types"

const SEGMENTOS = ["Governo", "Saúde", "Educação", "Indústria", "Financeiro", "Varejo", "Outro"]
const COMO_CONHECEU = ["Indicação", "Evento", "Redes sociais", "Mentoria NexIA", "Outro"]

export function OnboardingClient({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [step, setStep] = useState<"welcome" | "form">("welcome")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: profile.nome || "",
    empresa: "",
    cargo: "",
    telefone: "",
    segmentos_atuacao: [] as string[],
    como_conheceu: "",
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
      await salvarOnboarding(profile.id, form)
      toast.success("Perfil salvo com sucesso!")
      router.push("/")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  if (step === "welcome") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg w-full text-center rounded-2xl border p-10" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <Image src="/logo-nexia.png" alt="NexIA Lab" width={160} height={40} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
            Bem-vindo ao NexIA Partners, {profile.nome}!
          </h1>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Aqui você pode:
          </p>
          <div className="text-left space-y-3 mb-8 max-w-xs mx-auto">
            {[
              "Registrar oportunidades de negócios",
              "Acompanhar o status das suas indicações",
              "Acessar materiais de divulgação das soluções NexIA",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#46347F" }} />
                <span className="text-sm" style={{ color: "#374151" }}>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Vamos completar seu perfil antes de começar?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { router.push("/"); router.refresh() }} className="border-gray-300" style={{ color: "#6b7280" }}>
              Fazer depois
            </Button>
            <Button onClick={() => setStep("form")} style={{ background: "#46347F", color: "#fff" }}>
              Completar perfil <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
        Complete seu perfil
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Essas informações nos ajudam a oferecer um melhor suporte.
      </p>

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
              placeholder="Sua empresa" className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
          </div>
          <div className="space-y-2">
            <Label style={{ color: "#374151" }}>Cargo</Label>
            <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              placeholder="Seu cargo" className="border-gray-300" style={{ background: "#f9fafb", color: "#1a1523" }} />
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
              <button
                key={s}
                type="button"
                onClick={() => toggleSegmento(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  background: form.segmentos_atuacao.includes(s) ? "#46347F" : "transparent",
                  color: form.segmentos_atuacao.includes(s) ? "#fff" : "#374151",
                  borderColor: form.segmentos_atuacao.includes(s) ? "#46347F" : "#d1d5db",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label style={{ color: "#374151" }}>Como conheceu a NexIA?</Label>
          <select
            value={form.como_conheceu}
            onChange={(e) => setForm({ ...form, como_conheceu: e.target.value })}
            className="w-full h-9 rounded-md border px-3 text-sm"
            style={{ background: "#f9fafb", color: "#1a1523", borderColor: "#d1d5db" }}
          >
            <option value="">Selecionar...</option>
            {COMO_CONHECEU.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep("welcome")} className="border-gray-300" style={{ color: "#6b7280" }}>
            Voltar
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1" style={{ background: "#46347F", color: "#fff" }}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar e continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
