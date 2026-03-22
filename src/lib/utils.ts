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
      return { bg: 'bg-green-50', text: 'text-green-700', label: 'Ativo' }
    case 'vencendo':
      return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Vencendo' }
    case 'expirado':
      return { bg: 'bg-red-50', text: 'text-red-700', label: 'Expirado' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', label: status }
  }
}
