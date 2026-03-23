import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: number | string
  sublabel: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  valueColor?: string
}

export function MetricCard({ label, value, sublabel, icon: Icon, iconBg, iconColor, valueColor }: MetricCardProps) {
  return (
    <div className="bg-white rounded-[10px] border border-black/[0.07] p-4 flex items-center gap-3">
      <div className={cn("w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0", iconBg)}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-gray-500 uppercase tracking-[0.06em] font-medium">
          {label}
        </div>
        <div className={cn("text-[26px] font-bold leading-none mt-0.5 tracking-tight", valueColor ?? "text-[#1a1523]")} style={{ fontFamily: "Syne, sans-serif" }}>
          {value}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {sublabel}
        </div>
      </div>
    </div>
  )
}
