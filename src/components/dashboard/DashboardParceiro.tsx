import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { formatDate } from "@/lib/utils"
import { getStatsOportunidades, getOportunidadesRecentes } from "@/lib/queries/oportunidades"
import { Briefcase, CheckCircle, AlertTriangle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserProfile } from "@/lib/types"

export async function DashboardParceiro({ profile }: { profile: UserProfile }) {
  const parceiroId = profile.parceiro_id

  const [stats, recentes] = await Promise.all([
    getStatsOportunidades(parceiroId),
    getOportunidadesRecentes(5, parceiroId),
  ])

  const cards = [
    { label: "Minhas Oportunidades", value: stats.total, icon: Briefcase, color: "#46347F", bg: "rgba(70,52,127,0.08)" },
    { label: "Ativas", value: stats.ativas, icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
    { label: "Vencendo", value: stats.vencendo, icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { label: "Expiradas", value: stats.expiradas, icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  ]

  return (
    <>
      <Header title="Dashboard" description={`Bem-vindo(a), ${profile.nome}`} />

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "#6b7280" }}>{card.label}</span>
              <div className="p-2 rounded-lg" style={{ background: card.bg }}>
                <card.icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Registrar oportunidade */}
      <div
        className="rounded-xl border p-6 mb-8 flex items-center justify-between"
        style={{ background: "rgba(70,52,127,0.04)", borderColor: "rgba(70,52,127,0.15)" }}
      >
        <div>
          <h3 className="text-base font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
            Encontrou uma nova oportunidade?
          </h3>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Registre agora e nossa equipe entrará em contato.
          </p>
        </div>
        <Link href="/oportunidades/nova">
          <Button style={{ background: "#46347F", color: "#fff" }}>
            <Plus className="mr-2 h-4 w-4" /> Registrar oportunidade
          </Button>
        </Link>
      </div>

      {/* Minhas oportunidades recentes */}
      <div className="rounded-xl border" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
            Minhas Oportunidades Recentes
          </h2>
          <Link href="/oportunidades" className="text-sm hover:underline" style={{ color: "#46347F" }}>
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#e5e7eb" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Título</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Órgão/Empresa</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Validade</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center" style={{ color: "#6b7280" }}>
                    Você ainda não registrou nenhuma oportunidade.
                  </td>
                </tr>
              ) : (
                recentes.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "#e5e7eb" }}>
                    <td className="p-4">
                      <Link href={`/oportunidades/${op.id}`} className="hover:underline" style={{ color: "#1a1523" }}>
                        {op.titulo}
                      </Link>
                    </td>
                    <td className="p-4" style={{ color: "#6b7280" }}>{op.orgao_empresa}</td>
                    <td className="p-4" style={{ color: "#6b7280" }}>{formatDate(op.data_validade)}</td>
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
