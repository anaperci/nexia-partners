"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { StatusBadge } from "./StatusBadge"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { excluirOportunidade } from "@/app/(dashboard)/actions"
import { toast } from "sonner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import type { Oportunidade } from "@/lib/types"

export function OportunidadeDetalhe({ oportunidade }: { oportunidade: Oportunidade }) {
  const router = useRouter()

  async function handleDelete() {
    try {
      await excluirOportunidade(oportunidade.id)
      toast.success("Oportunidade excluída!")
      router.push("/oportunidades")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao excluir", { description: (err as Error).message })
    }
  }

  const fields = [
    { label: "Parceiro", value: oportunidade.parceiro_nome },
    { label: "Título", value: oportunidade.titulo },
    { label: "Órgão/Empresa", value: oportunidade.orgao_empresa },
    { label: "Registrado por", value: oportunidade.registrado_por },
    { label: "Data de Registro", value: formatDate(oportunidade.data_registro) },
    { label: "Data de Validade", value: formatDate(oportunidade.data_validade) },
    { label: "Solução Específica", value: oportunidade.solucao_especifica || "—" },
    { label: "Descrição", value: oportunidade.descricao || "—" },
    { label: "Observações", value: oportunidade.observacoes || "—" },
  ]

  return (
    <>
      <Header title={oportunidade.titulo} description="Detalhes da oportunidade">
        <Button variant="outline" onClick={() => router.push("/oportunidades")} className="border-[#e5e7eb]" style={{ color: '#1a1523', background: 'transparent' }}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button onClick={() => router.push(`/oportunidades/${oportunidade.id}?edit=true`)} style={{ background: '#46347F', color: '#fff' }}>
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" style={{ background: '#ef4444' }}>
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
            <AlertDialogHeader>
              <AlertDialogTitle style={{ color: '#1a1523' }}>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription style={{ color: '#6b7280' }}>
                Tem certeza que deseja excluir esta oportunidade? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#e5e7eb]" style={{ color: '#1a1523', background: 'transparent' }}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} style={{ background: '#ef4444', color: '#fff' }}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Header>

      <div className="rounded-xl border p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="mb-4">
          <StatusBadge status={oportunidade.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{field.label}</p>
              <p className="text-sm" style={{ color: '#1a1523' }}>{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
