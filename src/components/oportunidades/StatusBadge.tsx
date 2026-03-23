import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  ativo:    { label: "Ativo",    className: "bg-green-50 text-green-800" },
  vencendo: { label: "Vencendo", className: "bg-amber-50 text-amber-800" },
  expirado: { label: "Expirado", className: "bg-red-50 text-red-800" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-600" }
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", config.className)}>
      {config.label}
    </span>
  )
}
