import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { formatDate } from "@/lib/utils"
import { Briefcase, CheckCircle, AlertTriangle, XCircle, Users } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("*")
    .order("criado_em", { ascending: false })

  const { data: parceiros } = await supabase.from("parceiros").select("id")

  const all = oportunidades || []
  const total = all.length
  const ativos = all.filter((o) => o.status === "ativo").length
  const vencendo = all.filter((o) => o.status === "vencendo").length
  const expirados = all.filter((o) => o.status === "expirado").length
  const totalParceiros = parceiros?.length || 0
  const recentes = all.slice(0, 5)

  const cards = [
    { label: "Total", value: total, icon: Briefcase, color: "#4f8ef7", bg: "rgba(79,142,247,0.1)" },
    { label: "Ativas", value: ativos, icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    { label: "Vencendo", value: vencendo, icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { label: "Expiradas", value: expirados, icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    { label: "Parceiros", value: totalParceiros, icon: Users, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  ]

  return (
    <>
      <Header title="Dashboard" description="Visão geral das oportunidades" />

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-5"
            style={{ background: '#13151e', borderColor: '#252836' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: '#6b7280' }}>{card.label}</span>
              <div className="p-2 rounded-lg" style={{ background: card.bg }}>
                <card.icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabela de oportunidades recentes */}
      <div className="rounded-xl border" style={{ background: '#13151e', borderColor: '#252836' }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#252836' }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            Oportunidades Recentes
          </h2>
          <Link
            href="/oportunidades"
            className="text-sm hover:underline"
            style={{ color: '#4f8ef7' }}
          >
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderColor: '#252836' }} className="border-b">
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Título</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Parceiro</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Órgão/Empresa</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Validade</th>
                <th className="text-left p-4 font-medium" style={{ color: '#6b7280' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center" style={{ color: '#6b7280' }}>
                    Nenhuma oportunidade registrada ainda.
                  </td>
                </tr>
              ) : (
                recentes.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: '#252836' }}>
                    <td className="p-4">
                      <Link href={`/oportunidades/${op.id}`} className="hover:underline" style={{ color: '#e8eaf0' }}>
                        {op.titulo}
                      </Link>
                    </td>
                    <td className="p-4" style={{ color: '#e8eaf0' }}>{op.parceiro_nome}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{op.orgao_empresa}</td>
                    <td className="p-4" style={{ color: '#6b7280' }}>{formatDate(op.data_validade)}</td>
                    <td className="p-4"><StatusBadge status={op.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
