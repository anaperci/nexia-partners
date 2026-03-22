import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { OportunidadePDTICard } from "./OportunidadePDTICard"
import { formatDate } from "@/lib/utils"
import { getStatsOportunidades, getOportunidadesRecentes, getTopParceiros, getAlertasVencendo } from "@/lib/queries/oportunidades"
import { getOportunidadesPDTI } from "@/lib/queries/pdti"
import { Briefcase, CheckCircle, AlertTriangle, XCircle, Users, Sparkles } from "lucide-react"
import type { UserProfile } from "@/lib/types"

export async function DashboardNexia({ profile }: { profile: UserProfile }) {
  const [stats, recentes, pdtiOps, topParceiros, alertas] = await Promise.all([
    getStatsOportunidades(),
    getOportunidadesRecentes(5),
    getOportunidadesPDTI(8),
    getTopParceiros(5),
    getAlertasVencendo(),
  ])

  const cards = [
    { label: "Total", value: stats.total, icon: Briefcase, color: "#46347F", bg: "rgba(70,52,127,0.08)" },
    { label: "Ativas", value: stats.ativas, icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
    { label: "Vencendo", value: stats.vencendo, icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { label: "Expiradas", value: stats.expiradas, icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    { label: "Parceiros", value: topParceiros.length, icon: Users, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  ]

  return (
    <>
      <Header title="Dashboard" description={`Bem-vinda, ${profile.nome}`} />

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border p-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "#6b7280" }}>{card.label}</span>
              <div className="p-2 rounded-lg" style={{ background: card.bg }}>
                <card.icon className="h-4 w-4" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#111827" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Grid principal: PDTI + Parceiros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Oportunidades via PDTI — 2 colunas */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5" style={{ color: "#46347F" }} />
            <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#111827" }}>
              Oportunidades via PDTIs
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#46347F" }}>
              Exclusivo NexIA
            </span>
            <span className="text-xs ml-auto" style={{ color: "#9ca3af" }}>
              Identificadas por IA
            </span>
          </div>
          <div className="space-y-3">
            {pdtiOps.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: "#6b7280" }}>
                Nenhuma oportunidade PDTI identificada no momento.
              </p>
            ) : (
              pdtiOps.map((op) => <OportunidadePDTICard key={op.id} oportunidade={op} />)
            )}
          </div>
        </div>

        {/* Top Parceiros — 1 coluna */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "#111827" }}>
            Top Parceiros
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e5e7eb", background: "#f9fafb" }}>
                  <th className="text-left p-3 font-medium" style={{ color: "#6b7280" }}>Parceiro</th>
                  <th className="text-center p-3 font-medium" style={{ color: "#6b7280" }}>Total</th>
                  <th className="text-center p-3 font-medium" style={{ color: "#6b7280" }}>Ativas</th>
                </tr>
              </thead>
              <tbody>
                {topParceiros.length === 0 ? (
                  <tr><td colSpan={3} className="p-6 text-center" style={{ color: "#6b7280" }}>Nenhum parceiro ainda.</td></tr>
                ) : (
                  topParceiros.map((p) => (
                    <tr key={p.nome} className="border-b" style={{ borderColor: "#e5e7eb" }}>
                      <td className="p-3 font-medium" style={{ color: "#111827" }}>{p.nome}</td>
                      <td className="p-3 text-center" style={{ color: "#111827" }}>{p.total}</td>
                      <td className="p-3 text-center" style={{ color: "#22c55e" }}>{p.ativas}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Alertas vencendo */}
          {alertas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold mb-3" style={{ color: "#f59e0b" }}>
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Vencendo em breve
              </h3>
              <div className="space-y-2">
                {alertas.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    href={`/oportunidades/${a.id}`}
                    className="block rounded-lg border p-3 hover:shadow-sm transition-shadow"
                    style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}
                  >
                    <p className="text-sm font-medium" style={{ color: "#111827" }}>{a.titulo}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      {a.parceiro_nome} · Vence em {formatDate(a.data_validade)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Oportunidades Recentes */}
      <div className="rounded-xl border" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#111827" }}>
            Oportunidades Recentes
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
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Parceiro</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Órgão/Empresa</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Validade</th>
                <th className="text-left p-4 font-medium" style={{ color: "#6b7280" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center" style={{ color: "#6b7280" }}>
                    Nenhuma oportunidade registrada ainda.
                  </td>
                </tr>
              ) : (
                recentes.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "#e5e7eb" }}>
                    <td className="p-4">
                      <Link href={`/oportunidades/${op.id}`} className="hover:underline" style={{ color: "#111827" }}>
                        {op.titulo}
                      </Link>
                    </td>
                    <td className="p-4" style={{ color: "#111827" }}>{op.parceiro_nome}</td>
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
