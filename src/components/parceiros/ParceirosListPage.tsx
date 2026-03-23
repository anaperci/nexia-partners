"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { excluirParceiroAction } from "@/app/(dashboard)/parceiros/actions"
import { toast } from "sonner"
import { Search, Eye, Pencil, Trash2, Users, Briefcase, MapPin } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import type { Parceiro } from "@/lib/types"

const statusConfig: Record<string, { label: string; className: string }> = {
  ativo:    { label: "Ativo",    className: "bg-[#eaf3de] text-[#3b6d11]" },
  inativo:  { label: "Inativo",  className: "bg-gray-100 text-gray-600" },
  suspenso: { label: "Suspenso", className: "bg-[#faeeda] text-[#854f0b]" },
}

export function ParceirosListPage({ parceiros }: { parceiros: Parceiro[] }) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filtered = parceiros.filter((p) => {
    const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.cidade || "").toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusFilter === "todos" || p.status === statusFilter
    return matchBusca && matchStatus
  })

  async function handleDelete(id: string) {
    try {
      await excluirParceiroAction(id)
      toast.success("Parceiro excluído!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao excluir", { description: (err as Error).message })
    }
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 border-black/[0.07]"
            style={{ background: "#fff", color: "#1a1523" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-black/[0.07] px-3 py-2 text-[13px]"
          style={{ background: "#fff", color: "#1a1523" }}
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="suspenso">Suspenso</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.06]" style={{ background: "#f9f8fc" }}>
              <th className="text-left p-4 font-medium text-[#9ca3af] text-[11px] uppercase tracking-[0.06em]">Parceiro</th>
              <th className="text-center p-4 font-medium text-[#9ca3af] text-[11px] uppercase tracking-[0.06em]">Usuários</th>
              <th className="text-center p-4 font-medium text-[#9ca3af] text-[11px] uppercase tracking-[0.06em]">Oportunidades</th>
              <th className="text-center p-4 font-medium text-[#9ca3af] text-[11px] uppercase tracking-[0.06em]">Status</th>
              <th className="text-right p-4 font-medium text-[#9ca3af] text-[11px] uppercase tracking-[0.06em]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-[#9ca3af]">
                  Nenhum parceiro encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const st = statusConfig[p.status || "ativo"] || statusConfig.ativo
                return (
                  <tr key={p.id} className="border-b border-black/[0.04] hover:bg-[#f9f8fc] transition-colors">
                    <td className="p-4">
                      <Link href={`/parceiros/${p.id}`} className="hover:underline">
                        <p className="font-medium text-[#1a1523]">{p.nome}</p>
                      </Link>
                      {(p.cidade || p.estado) && (
                        <p className="text-[11px] text-[#9ca3af] flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {[p.cidade, p.estado].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#1a1523]">
                        <Users className="h-3.5 w-3.5 text-[#9ca3af]" />
                        {p._usuarios || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#1a1523]">
                        <Briefcase className="h-3.5 w-3.5 text-[#9ca3af]" />
                        {p._count || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/parceiros/${p.id}`} title="Ver detalhe">
                          <Eye className="h-4 w-4 text-[#9ca3af] hover:text-[#46347F] transition-colors" />
                        </Link>
                        <Link href={`/parceiros/${p.id}/editar`} title="Editar">
                          <Pencil className="h-4 w-4 text-[#9ca3af] hover:text-[#854f0b] transition-colors" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button title="Excluir">
                              <Trash2 className="h-4 w-4 text-[#9ca3af] hover:text-[#a32d2d] transition-colors" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir parceiro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Isso excluirá &quot;{p.nome}&quot; e todos os seus usuários. As oportunidades serão mantidas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-[#a32d2d] text-white hover:bg-red-800">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-[#9ca3af] mt-3">{filtered.length} parceiro{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  )
}
