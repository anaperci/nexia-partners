"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Plus, List } from "lucide-react"

export default function ConfirmacaoPage() {
  const params = useSearchParams()
  const titulo = params.get("titulo") || "Oportunidade"
  const orgao = params.get("orgao") || ""
  const data = params.get("data") || new Date().toLocaleDateString("pt-BR")

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center rounded-2xl border p-10" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(34,197,94,0.1)" }}>
          <CheckCircle className="h-8 w-8" style={{ color: "#22c55e" }} />
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#1a1523" }}>
          Oportunidade registrada com sucesso!
        </h1>

        <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
          Nossa equipe foi notificada e entrará em contato com você em até 48 horas úteis.
        </p>

        <div className="rounded-lg p-4 mb-6 text-left space-y-2" style={{ background: "#f9fafb" }}>
          <div>
            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>Oportunidade</span>
            <p className="text-sm font-medium" style={{ color: "#1a1523" }}>{titulo}</p>
          </div>
          {orgao && (
            <div>
              <span className="text-xs font-medium" style={{ color: "#6b7280" }}>Órgão/Empresa</span>
              <p className="text-sm" style={{ color: "#1a1523" }}>{orgao}</p>
            </div>
          )}
          <div>
            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>Registrada em</span>
            <p className="text-sm" style={{ color: "#1a1523" }}>{data}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/oportunidades/nova">
            <Button variant="outline" className="border-gray-300" style={{ color: "#374151" }}>
              <Plus className="mr-2 h-4 w-4" /> Registrar outra
            </Button>
          </Link>
          <Link href="/oportunidades">
            <Button style={{ background: "#46347F", color: "#fff" }}>
              <List className="mr-2 h-4 w-4" /> Ver minhas oportunidades
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
