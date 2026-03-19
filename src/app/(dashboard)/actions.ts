"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import type { OportunidadeInsert, OportunidadeUpdate } from "@/lib/types"

// ─── Oportunidades ───

export async function criarOportunidade(data: OportunidadeInsert) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("oportunidades").insert(data)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/oportunidades")
}

export async function atualizarOportunidade(id: string, data: OportunidadeUpdate) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("oportunidades")
    .update({ ...data, atualizado_em: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/oportunidades")
  revalidatePath(`/oportunidades/${id}`)
}

export async function excluirOportunidade(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("oportunidades").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/oportunidades")
}

// ─── Parceiros ───

export async function criarParceiro(data: { nome: string; email?: string; telefone?: string; empresa?: string }) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiros").insert(data)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
}

export async function atualizarParceiro(id: string, data: { nome?: string; email?: string; telefone?: string; empresa?: string }) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiros").update(data).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
  revalidatePath("/oportunidades")
}

export async function excluirParceiro(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiros").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
}
