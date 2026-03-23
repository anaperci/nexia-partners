"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { salvarDuracaoPadrao, salvarDuracaoParceiro, excluirDuracaoParceiro } from "@/app/(dashboard)/actions"
import { toast } from "sonner"
import { Save, Plus, Trash2, Clock, Settings } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"

interface Props {
  configGlobal: { duracao_meses: number }
  configsParceiros: Array<{
    id: string
    parceiro_id: string
    parceiro_nome: string
    duracao_meses: number
  }>
  parceiros: Array<{ id: string; nome: string }>
}

export function ConfiguracoesClient({ configGlobal, configsParceiros, parceiros }: Props) {
  const router = useRouter()
  const [globalMeses, setGlobalMeses] = useState(configGlobal.duracao_meses)
  const [savingGlobal, setSavingGlobal] = useState(false)

  // Novo parceiro com duração customizada
  const [novoParceiroId, setNovoParceiroId] = useState("")
  const [novoMeses, setNovoMeses] = useState(6)
  const [adding, setAdding] = useState(false)

  // Parceiros que já têm config (para não duplicar)
  const parceirosComConfig = configsParceiros.map((c) => c.parceiro_id)
  const parceirosDisponiveis = parceiros.filter((p) => !parceirosComConfig.includes(p.id))

  async function handleSaveGlobal() {
    setSavingGlobal(true)
    try {
      await salvarDuracaoPadrao(globalMeses)
      toast.success("Duração padrão atualizada!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar", { description: (err as Error).message })
    } finally {
      setSavingGlobal(false)
    }
  }

  async function handleAddParceiro() {
    if (!novoParceiroId) { toast.error("Selecione um parceiro"); return }
    setAdding(true)
    try {
      await salvarDuracaoParceiro(novoParceiroId, novoMeses)
      toast.success("Duração customizada adicionada!")
      setNovoParceiroId("")
      setNovoMeses(6)
      router.refresh()
    } catch (err) {
      toast.error("Erro ao adicionar", { description: (err as Error).message })
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await excluirDuracaoParceiro(id)
      toast.success("Configuração removida!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao remover", { description: (err as Error).message })
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Config global */}
      <div className="rounded-xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ background: "rgba(70,52,127,0.08)" }}>
            <Settings className="h-5 w-5" style={{ color: "#46347F" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
              Duração Padrão Global
            </h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Aplicada a todas as oportunidades que não têm duração específica por parceiro
            </p>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1 max-w-[200px]">
            <Label style={{ color: "#374151" }}>Duração em meses</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={globalMeses}
              onChange={(e) => setGlobalMeses(Number(e.target.value))}
              className="border-gray-300"
              style={{ background: "#f9fafb", color: "#1a1523" }}
            />
          </div>
          <div className="text-sm py-2 px-3 rounded-lg" style={{ background: "#f3f4f6", color: "#6b7280" }}>
            = {globalMeses} meses ({Math.round(globalMeses * 30.44)} dias)
          </div>
          <Button onClick={handleSaveGlobal} disabled={savingGlobal} style={{ background: "#46347F", color: "#fff" }}>
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      {/* Config por parceiro */}
      <div className="rounded-xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ background: "rgba(139,92,246,0.08)" }}>
            <Clock className="h-5 w-5" style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
              Duração por Parceiro
            </h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Sobrescreve a duração global para parceiros específicos
            </p>
          </div>
        </div>

        {/* Tabela de configs existentes */}
        {configsParceiros.length > 0 && (
          <div className="rounded-lg border overflow-hidden mb-6" style={{ borderColor: "#e5e7eb" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e5e7eb", background: "#f9fafb" }}>
                  <th className="text-left p-3 font-medium" style={{ color: "#6b7280" }}>Parceiro</th>
                  <th className="text-center p-3 font-medium" style={{ color: "#6b7280" }}>Duração</th>
                  <th className="text-center p-3 font-medium" style={{ color: "#6b7280" }}>Dias</th>
                  <th className="text-right p-3 font-medium" style={{ color: "#6b7280" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {configsParceiros.map((c) => (
                  <tr key={c.id} className="border-b" style={{ borderColor: "#e5e7eb" }}>
                    <td className="p-3 font-medium" style={{ color: "#1a1523" }}>{c.parceiro_nome}</td>
                    <td className="p-3 text-center" style={{ color: "#1a1523" }}>{c.duracao_meses} meses</td>
                    <td className="p-3 text-center" style={{ color: "#6b7280" }}>{Math.round(c.duracao_meses * 30.44)} dias</td>
                    <td className="p-3 text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button title="Remover" className="hover:text-red-500 transition-colors" style={{ color: "#6b7280" }}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ color: "#1a1523" }}>Remover configuração?</AlertDialogTitle>
                            <AlertDialogDescription style={{ color: "#6b7280" }}>
                              O parceiro &quot;{c.parceiro_nome}&quot; passará a usar a duração padrão global de {configGlobal.duracao_meses} meses.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300" style={{ color: "#1a1523", background: "transparent" }}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.id)} style={{ background: "#ef4444", color: "#fff" }}>Remover</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Adicionar nova config */}
        <div className="flex items-end gap-4 flex-wrap">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label style={{ color: "#374151" }}>Parceiro</Label>
            <select
              value={novoParceiroId}
              onChange={(e) => setNovoParceiroId(e.target.value)}
              className="w-full h-9 rounded-md border px-3 text-sm"
              style={{ background: "#f9fafb", color: "#1a1523", borderColor: "#d1d5db" }}
            >
              <option value="">Selecionar parceiro...</option>
              {parceirosDisponiveis.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 w-[140px]">
            <Label style={{ color: "#374151" }}>Duração (meses)</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={novoMeses}
              onChange={(e) => setNovoMeses(Number(e.target.value))}
              className="border-gray-300"
              style={{ background: "#f9fafb", color: "#1a1523" }}
            />
          </div>
          <Button onClick={handleAddParceiro} disabled={adding} style={{ background: "#46347F", color: "#fff" }}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>

        {parceirosDisponiveis.length === 0 && parceiros.length > 0 && (
          <p className="text-xs mt-3" style={{ color: "#6b7280" }}>
            Todos os parceiros já possuem duração customizada.
          </p>
        )}
      </div>
    </div>
  )
}
