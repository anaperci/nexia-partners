"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { formatDate } from "@/lib/utils"
import { criarUsuarioParceiroAction, excluirUsuarioParceiroAction } from "@/app/(dashboard)/parceiros/actions"
import { toast } from "sonner"
import { Plus, Trash2, Mail, Phone, Loader2, Globe, MapPin } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import type { Parceiro, ParceiroUsuario } from "@/lib/types"

interface Props {
  parceiro: Parceiro
  usuarios: ParceiroUsuario[]
  oportunidades: Array<{ id: string; titulo: string; status: string; data_validade: string; orgao_empresa: string }>
}

export function ParceiroDetalhe({ parceiro, usuarios, oportunidades }: Props) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userForm, setUserForm] = useState({ nome: "", email: "", cargo: "", telefone: "" })

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    if (!userForm.nome || !userForm.email) { toast.error("Nome e email são obrigatórios"); return }
    setLoading(true)
    try {
      await criarUsuarioParceiroAction({ ...userForm, parceiro_id: parceiro.id })
      toast.success("Usuário adicionado!")
      setUserForm({ nome: "", email: "", cargo: "", telefone: "" })
      setAddOpen(false)
      router.refresh()
    } catch (err) {
      toast.error("Erro", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      await excluirUsuarioParceiroAction(userId, parceiro.id)
      toast.success("Usuário removido!")
      router.refresh()
    } catch (err) {
      toast.error("Erro", { description: (err as Error).message })
    }
  }

  const statusBadge: Record<string, string> = {
    ativo: "bg-[#eaf3de] text-[#3b6d11]",
    inativo: "bg-gray-100 text-gray-600",
    suspenso: "bg-[#faeeda] text-[#854f0b]",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

      {/* Coluna esquerda — Info + Oportunidades */}
      <div className="space-y-6">
        {/* Informações */}
        <div className="bg-white rounded-xl border border-black/[0.07] p-6">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-[14px] font-semibold text-[#1a1523]">Informações</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${statusBadge[parceiro.status || "ativo"]}`}>
              {parceiro.status || "ativo"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
            {parceiro.razao_social && <Field label="Razão Social" value={parceiro.razao_social} />}
            {parceiro.cnpj && <Field label="CNPJ" value={parceiro.cnpj} />}
            {parceiro.email_comercial && <Field label="E-mail" value={parceiro.email_comercial} icon={<Mail className="h-3 w-3" />} />}
            {parceiro.telefone && <Field label="Telefone" value={parceiro.telefone} icon={<Phone className="h-3 w-3" />} />}
            {parceiro.site && <Field label="Site" value={parceiro.site} icon={<Globe className="h-3 w-3" />} />}
            {(parceiro.cidade || parceiro.estado) && (
              <Field label="Localização" value={[parceiro.cidade, parceiro.estado].filter(Boolean).join(", ")} icon={<MapPin className="h-3 w-3" />} />
            )}
          </div>
          {parceiro.segmentos && parceiro.segmentos.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-[0.06em] font-medium mb-2">Segmentos</p>
              <div className="flex flex-wrap gap-1.5">
                {parceiro.segmentos.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-lg bg-[#f0edf8] text-[#46347F] font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
          {parceiro.observacoes && (
            <div className="mt-5">
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-[0.06em] font-medium mb-1">Observações</p>
              <p className="text-[13px] text-[#374151]">{parceiro.observacoes}</p>
            </div>
          )}
        </div>

        {/* Oportunidades */}
        <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#1a1523]">Oportunidades ({oportunidades.length})</span>
            <Link href={`/oportunidades?parceiro=${parceiro.nome}`} className="text-[11px] text-[#46347F] font-medium">Ver todas →</Link>
          </div>
          {oportunidades.length === 0 ? (
            <p className="p-8 text-center text-[12px] text-[#9ca3af]">Nenhuma oportunidade registrada.</p>
          ) : (
            oportunidades.map((op) => (
              <div key={op.id} className="px-4 py-3 border-b border-black/[0.04] last:border-0 flex items-center justify-between">
                <div>
                  <Link href={`/oportunidades/${op.id}`} className="text-[12px] font-medium text-[#1a1523] hover:underline">{op.titulo}</Link>
                  <p className="text-[11px] text-[#9ca3af]">{op.orgao_empresa}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#9ca3af]">{formatDate(op.data_validade)}</span>
                  <StatusBadge status={op.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Coluna direita — Usuários */}
      <div>
        <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#1a1523]">Usuários ({usuarios.length})</span>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#46347F] hover:bg-[#3a2d6e] text-white h-7 px-2.5 text-[11px]">
                  <Plus size={12} className="mr-1" /> Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} placeholder="Nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail *</Label>
                    <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@exemplo.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input value={userForm.cargo} onChange={(e) => setUserForm({ ...userForm, cargo: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input value={userForm.telefone} onChange={(e) => setUserForm({ ...userForm, telefone: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-[#46347F] hover:bg-[#3a2d6e] text-white">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Adicionar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {usuarios.length === 0 ? (
            <p className="p-8 text-center text-[12px] text-[#9ca3af]">Nenhum usuário cadastrado.</p>
          ) : (
            usuarios.map((u) => (
              <div key={u.id} className="px-4 py-3 border-b border-black/[0.04] last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#f0edf8] flex items-center justify-center text-[10px] font-bold text-[#46347F] shrink-0 mt-0.5">
                    {u.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-[#1a1523]">{u.nome}</p>
                      {u.cargo && <span className="text-[10px] text-[#9ca3af]">· {u.cargo}</span>}
                    </div>
                    <p className="text-[11px] text-[#9ca3af]">{u.email}</p>
                    {u.telefone && <p className="text-[11px] text-[#9ca3af]">{u.telefone}</p>}
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.status === "ativo" ? "bg-[#eaf3de] text-[#3b6d11]" : "bg-gray-100 text-gray-600"}`}>
                        {u.status}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.convite_aceito ? "bg-[#eaf3de] text-[#3b6d11]" : "bg-[#faeeda] text-[#854f0b]"}`}>
                        {u.convite_aceito ? "Acesso ativo" : "Convite pendente"}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-[#9ca3af] hover:text-[#a32d2d] transition-colors p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
                        <AlertDialogDescription>O usuário &quot;{u.nome}&quot; perderá acesso ao sistema.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(u.id)} className="bg-[#a32d2d] text-white">Remover</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-[#9ca3af] uppercase tracking-[0.06em] font-medium mb-0.5">{label}</p>
      <p className="text-[#1a1523] flex items-center gap-1.5">
        {icon && <span className="text-[#9ca3af]">{icon}</span>}
        {value}
      </p>
    </div>
  )
}
