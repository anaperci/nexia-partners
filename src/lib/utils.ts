import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR })
}

export function formatDateTime(date: string) {
  return format(parseISO(date), "dd/MM/yyyy HH:mm", { locale: ptBR })
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'ativo':
      return { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Ativo' }
    case 'vencendo':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Vencendo' }
    case 'expirado':
      return { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Expirado' }
    default:
      return { bg: 'bg-gray-500/15', text: 'text-gray-400', label: status }
  }
}
