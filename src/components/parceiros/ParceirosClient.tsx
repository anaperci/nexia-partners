"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { criarParceiro, excluirParceiro } from "@/app/(dashboard)/actions"
import { toast } from "sonner"
import { Plus, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import type { Parceiro } from "@/lib/types"

export function ParceirosClient({ parceiros }: { parceiros: Parceiro[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", empresa: "" })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return }
    setLoading(true)
    try {
      await criarParceiro({
        nome: form.nome,
        email: form.email || undefined,
        telefone: form.telefone || undefined,
        empresa: form.empresa || undefined,
      })
      toast.success("Parceiro cadastrado com sucesso!")
      setForm({ nome: "", email: "", telefone: "", empresa: "" })
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error("Erro ao cadastrar", { description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await excluirParceiro(id)
      toast.success("Parceiro excluído!")
      router.refresh()
    } catch (err) {
      toast.error("Erro ao excluir", { description: (err as Error).message })
    }
  }

  const inputStyle = { background: '#1a1d2a', color: '#e8eaf0' }
  const inputClass = "border-[#252836] focus:border-[#4f8ef7]"

  return (
    <div>
      {/* Botão novo parceiro */}
      <div className="mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button style={{ background: '#4f8ef7', color: '#fff' }}>
              <Plus className="mr-2 h-4 w-4" /> Novo Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent style={{ background: '#13151e', borderColor: '#252836' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#e8eaf0', fontFamily: 'Syne, sans-serif' }}>Cadastrar Parceiro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label style={{ color: '#e8eaf0' }}>Nome *</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do parceiro" className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#e8eaf0' }}>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="email@exemplo.com" className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#e8eaf0' }}>Telefone</Label>
                <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#e8eaf0' }}>Empresa</Label>
                <Input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Nome da empresa" className={inputClass} style={inputStyle} />
              </div>
              <Button type="submit" disabled={loading} className="w-full" style={{ background: '#4f8ef7', color: '#fff' }}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Cadastrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#13151e', borderColor: '#252836' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#252836' }}>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Nome</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Email</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Telefone</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Empresa</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Oportunidades</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parceiros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: '#6b7280' }}>
                    Nenhum parceiro cadastrado.
                  </td>
                </tr>
              ) : (
                parceiros.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: '#252836' }}>
                    <td className="p-4 font-medium" style={{ color: '#e8eaf0' }}>{p.nome}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{p.email || "—"}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{p.telefone || "—"}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{p.empresa || "—"}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400">
                        {p._count || 0}
                      </span>
                    </td>
                    <td className="p-4">
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
                              Excluir parceiro &quot;{p.nome}&quot;? As oportunidades vinculadas não serão excluídas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#252836]" style={{ color: '#e8eaf0', background: 'transparent' }}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: '#fff' }}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
