"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/oportunidades/StatusBadge"
import { formatDate } from "@/lib/utils"
import { Download, Printer } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Oportunidade } from "@/lib/types"

export function RelatoriosClient({ oportunidades }: { oportunidades: Oportunidade[] }) {
  const [tab, setTab] = useState<"parceiro" | "status" | "orgao" | "timeline">("parceiro")

  // ─── Dados por parceiro ───
  const porParceiro: Record<string, { total: number; ativo: number; vencendo: number; expirado: number }> = {}
  oportunidades.forEach((o) => {
    if (!porParceiro[o.parceiro_nome]) porParceiro[o.parceiro_nome] = { total: 0, ativo: 0, vencendo: 0, expirado: 0 }
    porParceiro[o.parceiro_nome].total++
    porParceiro[o.parceiro_nome][o.status]++
  })
  const dadosParceiro = Object.entries(porParceiro)
    .map(([nome, dados]) => ({ nome, ...dados }))
    .sort((a, b) => b.total - a.total)

  // ─── Dados por status ───
  const porStatus = [
    { name: "Ativo", value: oportunidades.filter((o) => o.status === "ativo").length, color: "#22c55e" },
    { name: "Vencendo", value: oportunidades.filter((o) => o.status === "vencendo").length, color: "#f59e0b" },
    { name: "Expirado", value: oportunidades.filter((o) => o.status === "expirado").length, color: "#ef4444" },
  ]

  // ─── Dados por órgão (top 10) ───
  const porOrgao: Record<string, number> = {}
  oportunidades.forEach((o) => { porOrgao[o.orgao_empresa] = (porOrgao[o.orgao_empresa] || 0) + 1 })
  const dadosOrgao = Object.entries(porOrgao)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // ─── Exportar CSV ───
  function exportCSV() {
    const headers = ["Título", "Parceiro", "Órgão/Empresa", "Solução", "Registrado por", "Data Registro", "Data Validade", "Status", "Descrição", "Observações"]
    const rows = oportunidades.map((o) => [
      o.titulo, o.parceiro_nome, o.orgao_empresa, o.solucao_especifica || "",
      o.registrado_por, o.data_registro, o.data_validade, o.status,
      o.descricao || "", o.observacoes || "",
    ])
    const csv = [headers.join(";"), ...rows.map((r) => r.map((c) => `"${c}"`).join(";"))].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `oportunidades_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { key: "parceiro" as const, label: "Por Parceiro" },
    { key: "status" as const, label: "Por Status" },
    { key: "orgao" as const, label: "Por Órgão" },
    { key: "timeline" as const, label: "Linha do Tempo" },
  ]

  return (
    <div>
      {/* Botões de exportação */}
      <div className="flex gap-3 mb-6 no-print">
        <Button onClick={exportCSV} variant="outline" className="border-[#e5e7eb]" style={{ color: '#1a1523', background: 'transparent' }}>
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
        <Button onClick={() => window.print()} variant="outline" className="border-[#e5e7eb]" style={{ color: '#1a1523', background: 'transparent' }}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 no-print">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "text-white" : "hover:bg-gray-100"
            }`}
            style={{
              background: tab === t.key ? '#46347F' : 'transparent',
              color: tab === t.key ? '#fff' : '#6b7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="rounded-xl border p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>

        {/* Por Parceiro */}
        {tab === "parceiro" && (
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#1a1523' }}>
              Oportunidades por Parceiro
            </h3>
            {dadosParceiro.length > 0 && (
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosParceiro} layout="vertical" margin={{ left: 100 }}>
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis type="category" dataKey="nome" stroke="#6b7280" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1523' }} />
                    <Bar dataKey="total" fill="#46347F" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                    <th className="text-left p-3 font-medium" style={{ color: '#6b7280' }}>Parceiro</th>
                    <th className="text-center p-3 font-medium" style={{ color: '#6b7280' }}>Total</th>
                    <th className="text-center p-3 font-medium" style={{ color: '#22c55e' }}>Ativas</th>
                    <th className="text-center p-3 font-medium" style={{ color: '#f59e0b' }}>Vencendo</th>
                    <th className="text-center p-3 font-medium" style={{ color: '#ef4444' }}>Expiradas</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosParceiro.map((p) => (
                    <tr key={p.nome} className="border-b" style={{ borderColor: '#e5e7eb' }}>
                      <td className="p-3" style={{ color: '#1a1523' }}>{p.nome}</td>
                      <td className="p-3 text-center" style={{ color: '#1a1523' }}>{p.total}</td>
                      <td className="p-3 text-center" style={{ color: '#22c55e' }}>{p.ativo}</td>
                      <td className="p-3 text-center" style={{ color: '#f59e0b' }}>{p.vencendo}</td>
                      <td className="p-3 text-center" style={{ color: '#ef4444' }}>{p.expirado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Por Status */}
        {tab === "status" && (
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#1a1523' }}>
              Oportunidades por Status
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {porStatus.map((s) => (
                <div key={s.name} className="rounded-xl border p-5 text-center" style={{ background: '#f4f5f7', borderColor: '#e5e7eb' }}>
                  <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: s.color }}>{s.value}</p>
                  <p className="text-sm" style={{ color: '#6b7280' }}>{s.name}</p>
                </div>
              ))}
            </div>
            {oportunidades.length > 0 && (
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width={300} height="100%">
                  <PieChart>
                    <Pie data={porStatus} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {porStatus.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1523' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Por Órgão */}
        {tab === "orgao" && (
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#1a1523' }}>
              Top 10 Órgãos/Empresas
            </h3>
            {dadosOrgao.length > 0 && (
              <div className="h-[400px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosOrgao} layout="vertical" margin={{ left: 120 }}>
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis type="category" dataKey="nome" stroke="#6b7280" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1523' }} />
                    <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {dadosOrgao.length === 0 && (
              <p style={{ color: '#6b7280' }}>Nenhuma oportunidade registrada.</p>
            )}
          </div>
        )}

        {/* Linha do Tempo */}
        {tab === "timeline" && (
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#1a1523' }}>
              Linha do Tempo — por Data de Validade
            </h3>
            <div className="space-y-3">
              {oportunidades.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Nenhuma oportunidade registrada.</p>
              ) : (
                oportunidades.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors"
                    style={{
                      background: o.status === 'vencendo' ? 'rgba(245,158,11,0.05)' : o.status === 'expirado' ? 'rgba(239,68,68,0.05)' : 'transparent',
                      borderColor: o.status === 'vencendo' ? 'rgba(245,158,11,0.3)' : o.status === 'expirado' ? 'rgba(239,68,68,0.3)' : '#e5e7eb',
                    }}
                  >
                    <div className="text-center min-w-[80px]">
                      <p className="text-xs" style={{ color: '#6b7280' }}>Validade</p>
                      <p className="text-sm font-medium" style={{ color: '#1a1523' }}>{formatDate(o.data_validade)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#1a1523' }}>{o.titulo}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{o.parceiro_nome} — {o.orgao_empresa}</p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
