"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function criarParceiroAction(data: {
  nome: string; razao_social?: string; cnpj?: string; email_comercial?: string;
  telefone?: string; site?: string; cidade?: string; estado?: string;
  segmentos?: string[]; status?: string; observacoes?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiros").insert(data)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
}

export async function editarParceiroAction(id: string, data: {
  nome?: string; razao_social?: string; cnpj?: string; email_comercial?: string;
  telefone?: string; site?: string; cidade?: string; estado?: string;
  segmentos?: string[]; status?: string; observacoes?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("parceiros")
    .update({ ...data, atualizado_em: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
  revalidatePath(`/parceiros/${id}`)
}

export async function excluirParceiroAction(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiros").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/parceiros")
}

// ─── Usuários do Parceiro ───

export async function criarUsuarioParceiroAction(data: {
  parceiro_id: string; nome: string; email: string; cargo?: string; telefone?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiro_usuarios").insert(data)
  if (error) throw new Error(error.message)
  revalidatePath(`/parceiros/${data.parceiro_id}`)
}

export async function editarUsuarioParceiroAction(id: string, parceiroId: string, data: {
  nome?: string; email?: string; cargo?: string; telefone?: string; status?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("parceiro_usuarios")
    .update({ ...data, atualizado_em: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/parceiros/${parceiroId}`)
}

export async function excluirUsuarioParceiroAction(id: string, parceiroId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("parceiro_usuarios").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/parceiros/${parceiroId}`)
}
