"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "./StatusBadge"
import { formatDate } from "@/lib/utils"
import { excluirOportunidade } from "@/app/(dashboard)/actions"
import { toast } from "sonner"
import { Eye, Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import type { Oportunidade } from "@/lib/types"

interface Props {
  oportunidades: Oportunidade[]
  parceiros: { id: string; nome: string }[]
}

type SortKey = "titulo" | "parceiro_nome" | "orgao_empresa" | "data_validade" | "status"

export function OportunidadesListClient({ oportunidades, parceiros }: Props) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [parceiroFilter, setParceiroFilter] = useState<string>("todos")
  const [sortKey, setSortKey] = useState<SortKey>("data_validade")
  const [sortAsc, setSortAsc] = useState(true)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  async function handleDelete(id: string) {
    try {
      await excluirOportunidade(id)
      toast.success("Oportunidade excluída com sucesso!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao excluir", { description: (err as Error).message })
    }
  }

  const filtered = oportunidades
    .filter((o) => {
      const s = busca.toLowerCase()
      const matchBusca = !busca ||
        o.titulo.toLowerCase().includes(s) ||
        o.parceiro_nome.toLowerCase().includes(s) ||
        o.orgao_empresa.toLowerCase().includes(s) ||
        (o.solucao_especifica || "").toLowerCase().includes(s) ||
        o.registrado_por.toLowerCase().includes(s)
      return matchBusca &&
        (statusFilter === "todos" || o.status === statusFilter) &&
        (parceiroFilter === "todos" || o.parceiro_nome === parceiroFilter)
    })
    .sort((a, b) => {
      const cmp = (a[sortKey] || "") < (b[sortKey] || "") ? -1 : (a[sortKey] || "") > (b[sortKey] || "") ? 1 : 0
      return sortAsc ? cmp : -cmp
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null
    return sortAsc ? <ChevronUp className="inline h-3 w-3 ml-1" /> : <ChevronDown className="inline h-3 w-3 ml-1" />
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#6b7280' }} />
          <Input
            placeholder="Buscar por título, parceiro, órgão..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 border-[#252836]"
            style={{ background: '#1a1d2a', color: '#e8eaf0' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ background: '#1a1d2a', color: '#e8eaf0', borderColor: '#252836' }}
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="vencendo">Vencendo</option>
          <option value="expirado">Expirado</option>
        </select>
        <select
          value={parceiroFilter}
          onChange={(e) => setParceiroFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ background: '#1a1d2a', color: '#e8eaf0', borderColor: '#252836' }}
        >
          <option value="todos">Todos os parceiros</option>
          {parceiros.map((p) => (
            <option key={p.id} value={p.nome}>{p.nome}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#13151e', borderColor: '#252836' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#252836' }}>
                {([
                  { key: "titulo" as SortKey, label: "Título" },
                  { key: "parceiro_nome" as SortKey, label: "Parceiro" },
                  { key: "orgao_empresa" as SortKey, label: "Órgão/Empresa" },
                  { key: "data_validade" as SortKey, label: "Validade" },
                  { key: "status" as SortKey, label: "Status" },
                ]).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    style={{ color: '#6b7280' }}
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: '#6b7280' }}>
                    Nenhuma oportunidade encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: '#252836' }}>
                    <td className="p-4" style={{ color: '#e8eaf0' }}>{op.titulo}</td>
                    <td className="p-4" style={{ color: '#e8eaf0' }}>{op.parceiro_nome}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{op.orgao_empresa}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{formatDate(op.data_validade)}</td>
                    <td className="p-4"><StatusBadge status={op.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/oportunidades/${op.id}`} title="Ver detalhe">
                          <Eye className="h-4 w-4 hover:text-blue-400 transition-colors" style={{ color: '#6b7280' }} />
                        </Link>
                        <Link href={`/oportunidades/${op.id}?edit=true`} title="Editar">
                          <Pencil className="h-4 w-4 hover:text-yellow-400 transition-colors" style={{ color: '#6b7280' }} />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button title="Excluir">
                              <Trash2 className="h-4 w-4 hover:text-red-400 transition-colors" style={{ color: '#6b7280' }} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent style={{ background: '#13151e', borderColor: '#252836' }}>
                            <AlertDialogHeader>
                              <AlertDialogTitle style={{ color: '#e8eaf0' }}>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription style={{ color: '#6b7280' }}>
                                Tem certeza que deseja excluir &quot;{op.titulo}&quot;? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-[#252836]" style={{ color: '#e8eaf0', background: 'transparent' }}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(op.id)} style={{ background: '#ef4444', color: '#fff' }}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: '#6b7280' }}>
        {filtered.length} de {oportunidades.length} oportunidades
      </p>
    </div>
  )
}
