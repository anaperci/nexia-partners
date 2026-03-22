"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import type { OportunidadePDTI } from "@/lib/types"

const potencialConfig = {
  alto: { bg: "bg-green-50", text: "text-green-700", label: "ALTO" },
  medio: { bg: "bg-amber-50", text: "text-amber-700", label: "MÉDIO" },
  baixo: { bg: "bg-gray-100", text: "text-gray-600", label: "BAIXO" },
}

export function OportunidadePDTICard({ oportunidade }: { oportunidade: OportunidadePDTI }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const pot = potencialConfig[oportunidade.potencial] || potencialConfig.medio

  function handleRegistrar() {
    const params = new URLSearchParams({
      orgao: oportunidade.orgao_nome,
      titulo: oportunidade.descricao.slice(0, 100),
      solucao: oportunidade.area || "",
      obs: `Identificado via PDTI. Evidência: "${oportunidade.evidencia_texto?.slice(0, 200) || ""}"`,
      pdti_id: oportunidade.id,
    })
    router.push(`/oportunidades/nova?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
      <div className="flex items-start gap-3">
        {/* Ícone órgão */}
        <div className="p-2 rounded-lg shrink-0" style={{ background: "rgba(70,52,127,0.06)" }}>
          <Building2 className="h-5 w-5" style={{ color: "#46347F" }} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm" style={{ color: "#111827" }}>{oportunidade.orgao_nome}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pot.bg} ${pot.text}`}>
              {pot.label}
            </span>
            {oportunidade.area && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                {oportunidade.area}
              </span>
            )}
          </div>

          <p className="text-sm" style={{ color: "#374151" }}>{oportunidade.descricao}</p>

          {/* Evidência expansível */}
          {oportunidade.evidencia_texto && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#46347F]"
                style={{ color: "#6b7280" }}
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Evidência no PDTI
              </button>
              {expanded && (
                <p className="text-xs mt-1.5 p-2 rounded" style={{ background: "#f9fafb", color: "#6b7280" }}>
                  &ldquo;{oportunidade.evidencia_texto}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "#9ca3af" }}>
            {oportunidade.timing_previsto && <span>Timing: {oportunidade.timing_previsto}</span>}
            {oportunidade.orcamento_estimado && (
              <span>Orçamento: R$ {(oportunidade.orcamento_estimado / 1000).toFixed(0)}k</span>
            )}
          </div>
        </div>

        {/* Ação */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegistrar}
          className="shrink-0 text-xs border-gray-200 hover:bg-[#46347F] hover:text-white hover:border-[#46347F] transition-colors"
          style={{ color: "#46347F" }}
        >
          Registrar <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
