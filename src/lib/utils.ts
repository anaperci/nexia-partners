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
