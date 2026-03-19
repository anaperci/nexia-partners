import { getStatusColor } from "@/lib/utils"

export function StatusBadge({ status }: { status: string }) {
  const { bg, text, label } = getStatusColor(status)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}
