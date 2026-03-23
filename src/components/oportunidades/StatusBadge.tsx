import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; bg: string; text: string; pulse?: boolean }> = {
  ativo:    { label: "Ativo",    bg: "bg-[#eaf3de]", text: "text-[#3b6d11]" },
  vencendo: { label: "Vencendo", bg: "bg-[#faeeda]", text: "text-[#854f0b]", pulse: true },
  expirado: { label: "Expirado", bg: "bg-[#fcebeb]", text: "text-[#a32d2d]" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, bg: "bg-gray-100", text: "text-gray-600" }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-lg font-medium", config.bg, config.text)}>
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
        </span>
      )}
      {config.label}
    </span>
  )
}
