import Link from "next/link"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { MetricCard } from "./MetricCard"
import { OportunidadePDTICard } from "./OportunidadePDTICard"
import { formatDate } from "@/lib/utils"
import { getStatsOportunidades, getOportunidadesRecentes, getTopParceiros, getAlertasVencendo } from "@/lib/queries/oportunidades"
import { getOportunidadesPDTI } from "@/lib/queries/pdti"
import { FileText, CheckCircle, AlertTriangle, XCircle, Users, Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserProfile } from "@/lib/types"

export async function DashboardNexia({ profile }: { profile: UserProfile }) {
  const [stats, recentes, pdtiOps, topParceiros, alertas] = await Promise.all([
    getStatsOportunidades(),
    getOportunidadesRecentes(5),
    getOportunidadesPDTI(8),
    getTopParceiros(5),
    getAlertasVencendo(),
  ])

  return (
    <>
      {/* Page header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#1a1523]" style={{ fontFamily: "Syne, sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Bem-vinda, {profile.nome}
          </p>
        </div>
        <Link href="/oportunidades/nova">
          <Button className="bg-[#46347F] hover:bg-[#3a2d6e] text-white rounded-lg h-9 px-4 text-[13px] font-medium">
            <Plus size={14} className="mr-1.5" /> Nova oportunidade
          </Button>
        </Link>
      </div>

      {/* Métricas — linha 1: 3 colunas */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <MetricCard label="Total" value={stats.total} sublabel="oportunidades" icon={FileText}
          iconBg="bg-[#f0edf8]" iconColor="text-[#46347F]" />
        <MetricCard label="Ativas" value={stats.ativas} sublabel="em vigor" icon={CheckCircle}
          iconBg="bg-green-50" iconColor="text-green-700" valueColor="text-green-700" />
        <MetricCard label="Vencendo" value={stats.vencendo} sublabel="próximos 15 dias" icon={AlertTriangle}
          iconBg="bg-amber-50" iconColor="text-amber-700" valueColor="text-amber-700" />
      </div>

      {/* Métricas — linha 2: 2 colunas */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <MetricCard label="Expiradas" value={stats.expiradas} sublabel="encerradas" icon={XCircle}
          iconBg="bg-red-50" iconColor="text-red-700" valueColor="text-red-700" />
        <MetricCard label="Parceiros" value={topParceiros.length} sublabel="ativos" icon={Users}
          iconBg="bg-blue-50" iconColor="text-blue-700" valueColor="text-blue-700" />
      </div>

      {/* Grid principal: PDTI (esquerda) + Laterais (direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* Coluna esquerda — PDTI */}
        <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          {/* Header PDTI */}
          <div className="px-4 py-3 border-b border-black/[0.06] flex items-center gap-2">
            <Sparkles size={14} className="text-[#46347F] shrink-0" />
            <span className="text-[14px] font-semibold text-[#1a1523]">
              Oportunidades via PDTIs
            </span>
            <span className="text-[10px] bg-[#46347F] text-white rounded-full px-2 py-0.5 font-semibold tracking-wide">
              Exclusivo NexIA
            </span>
            <span className="text-[11px] text-gray-400 ml-auto">
              Identificadas por IA
            </span>
          </div>

          {/* Lista PDTI */}
          {pdtiOps.length === 0 ? (
            <p className="text-sm py-10 text-center text-gray-400">
              Nenhuma oportunidade PDTI identificada no momento.
            </p>
          ) : (
            <div>
              {pdtiOps.map((op) => (
                <div key={op.id} className="border-b border-black/[0.05] last:border-0">
                  <OportunidadePDTICard oportunidade={op} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna direita — Recentes + Top Parceiros + Alertas */}
        <div className="flex flex-col gap-4">

          {/* Oportunidades recentes */}
          <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
            <div className="px-3.5 py-3 border-b border-black/[0.06] flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#1a1523]">Oportunidades recentes</span>
              <Link href="/oportunidades" className="text-[11px] text-[#46347F] font-medium">Ver todas →</Link>
            </div>
            {recentes.length === 0 ? (
              <p className="text-xs py-8 text-center text-gray-400">Nenhuma oportunidade ainda.</p>
            ) : (
              recentes.map((op) => (
                <div key={op.id} className="px-3.5 py-2.5 border-b border-black/[0.04] last:border-0">
                  <Link href={`/oportunidades/${op.id}`} className="hover:underline">
                    <p className="text-[12px] font-medium text-[#1a1523] truncate">{op.titulo}</p>
                  </Link>
                  <p className="text-[11px] text-gray-500 mt-0.5">{op.orgao_empresa} · {op.parceiro_nome}</p>
                  <div className="flex items-center justify-between mt-1">
                    <StatusBadge status={op.status} />
                    <span className="text-[10px] text-gray-400">{formatDate(op.criado_em)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Top parceiros */}
          <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
            <div className="px-3.5 py-3 border-b border-black/[0.06] flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#1a1523]">Top parceiros</span>
              <Link href="/parceiros" className="text-[11px] text-[#46347F] font-medium">Ver todos →</Link>
            </div>
            {topParceiros.length === 0 ? (
              <p className="text-xs py-8 text-center text-gray-400">Nenhum parceiro ainda.</p>
            ) : (
              topParceiros.map((p) => (
                <div key={p.nome} className="px-3.5 py-2.5 border-b border-black/[0.04] last:border-0 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[7px] bg-[#f0edf8] flex items-center justify-center text-[10px] font-bold text-[#46347F] shrink-0">
                    {p.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1a1523] truncate">{p.nome}</p>
                    <p className="text-[11px] text-gray-500">{p.total} oportunidades</p>
                  </div>
                  <div className="w-14 h-1 bg-[#f0edf8] rounded-full shrink-0">
                    <div
                      className="h-1 bg-[#46347F] rounded-full"
                      style={{ width: `${topParceiros[0].total > 0 ? (p.total / topParceiros[0].total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Alertas vencendo */}
          {alertas.length > 0 && (
            <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
              <div className="px-3.5 py-3 border-b border-black/[0.06]">
                <span className="text-[13px] font-semibold text-amber-700">
                  <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                  Vencendo em breve
                </span>
              </div>
              {alertas.slice(0, 4).map((a) => (
                <Link
                  key={a.id}
                  href={`/oportunidades/${a.id}`}
                  className="block px-3.5 py-2.5 border-b border-black/[0.04] last:border-0 hover:bg-amber-50/30 transition-colors"
                >
                  <p className="text-[12px] font-medium text-[#1a1523]">{a.titulo}</p>
                  <p className="text-[11px] text-gray-500">{a.parceiro_nome} · Vence {formatDate(a.data_validade)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
