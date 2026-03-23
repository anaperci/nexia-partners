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

// ─── Configurações de Duração ───

export async function salvarDuracaoPadrao(duracaoMeses: number) {
  const supabase = await createServerSupabaseClient()
  // Atualizar config global (parceiro_id IS NULL)
  const { data: existing } = await supabase
    .from("configuracoes_duracao")
    .select("id")
    .is("parceiro_id", null)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("configuracoes_duracao")
      .update({ duracao_meses: duracaoMeses, atualizado_em: new Date().toISOString() })
      .eq("id", existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from("configuracoes_duracao")
      .insert({ duracao_meses: duracaoMeses, descricao: "Duração padrão global" })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/configuracoes")
  revalidatePath("/oportunidades")
}

export async function salvarDuracaoParceiro(parceiroId: string, duracaoMeses: number) {
  const supabase = await createServerSupabaseClient()
  const { data: existing } = await supabase
    .from("configuracoes_duracao")
    .select("id")
    .eq("parceiro_id", parceiroId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("configuracoes_duracao")
      .update({ duracao_meses: duracaoMeses, atualizado_em: new Date().toISOString() })
      .eq("id", existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from("configuracoes_duracao")
      .insert({ parceiro_id: parceiroId, duracao_meses: duracaoMeses })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/configuracoes")
}

export async function excluirDuracaoParceiro(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("configuracoes_duracao").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes")
}

// ─── Onboarding / Perfil ───

export async function salvarOnboarding(userId: string, data: {
  nome: string; empresa?: string; cargo?: string; telefone?: string;
  segmentos_atuacao?: string[]; como_conheceu?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("user_profiles")
    .update({ ...data, onboarding_completo: true })
    .eq("id", userId)
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

export async function atualizarPerfil(userId: string, data: {
  nome?: string; empresa?: string; cargo?: string; telefone?: string;
  segmentos_atuacao?: string[]; como_conheceu?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("user_profiles")
    .update(data)
    .eq("id", userId)
  if (error) throw new Error(error.message)
  revalidatePath("/perfil")
}
