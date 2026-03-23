"use client"

import { cn } from "@/lib/utils"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { FileText, CheckCircle, AlertTriangle, XCircle, Users, type LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  FileText, CheckCircle, AlertTriangle, XCircle, Users,
}

interface MetricCardProps {
  label: string
  value: number | string
  sublabel: string
  iconName: string
  iconBg: string
  iconColor: string
  valueColor?: string
}

export function MetricCard({ label, value, sublabel, iconName, iconBg, iconColor, valueColor }: MetricCardProps) {
  const Icon = iconMap[iconName] || FileText

  return (
    <div className="bg-white rounded-xl border border-black/[0.07] p-4 flex items-center gap-3 transition-all hover:border-black/[0.12]">
      <div className={cn("w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0", iconBg)}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-[#9ca3af] uppercase tracking-[0.06em] font-medium">
          {label}
        </div>
        <div className={cn("text-[26px] font-bold leading-none mt-0.5 tracking-tight", valueColor ?? "text-[#1a1523]")} style={{ fontFamily: "Syne, sans-serif" }}>
          {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </div>
        <div className="text-[11px] text-[#9ca3af] mt-0.5">
          {sublabel}
        </div>
      </div>
    </div>
  )
}
