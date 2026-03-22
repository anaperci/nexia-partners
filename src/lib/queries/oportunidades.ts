import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getStatsOportunidades(parceiroId?: string) {
  const supabase = await createServerSupabaseClient()
  let query = supabase.from("oportunidades").select("status")
  if (parceiroId) query = query.eq("parceiro_id", parceiroId)

  const { data } = await query
  const all = data || []
  return {
    total: all.length,
    ativas: all.filter((o) => o.status === "ativo").length,
    vencendo: all.filter((o) => o.status === "vencendo").length,
    expiradas: all.filter((o) => o.status === "expirado").length,
  }
}

export async function getOportunidadesRecentes(limite = 5, parceiroId?: string) {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from("oportunidades")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(limite)

  if (parceiroId) query = query.eq("parceiro_id", parceiroId)
  const { data } = await query
  return data || []
}

export async function getTopParceiros(limite = 5) {
  const supabase = await createServerSupabaseClient()
  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("parceiro_nome, parceiro_id, status, criado_em")

  if (!oportunidades) return []

  const map: Record<string, { nome: string; total: number; ativas: number; ultima: string }> = {}
  oportunidades.forEach((o) => {
    if (!map[o.parceiro_nome]) {
      map[o.parceiro_nome] = { nome: o.parceiro_nome, total: 0, ativas: 0, ultima: o.criado_em }
    }
    map[o.parceiro_nome].total++
    if (o.status === "ativo") map[o.parceiro_nome].ativas++
    if (o.criado_em > map[o.parceiro_nome].ultima) map[o.parceiro_nome].ultima = o.criado_em
  })

  return Object.values(map)
    .sort((a, b) => b.total - a.total)
    .slice(0, limite)
}

export async function getAlertasVencendo() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("oportunidades")
    .select("id, titulo, parceiro_nome, data_validade")
    .eq("status", "vencendo")
    .order("data_validade", { ascending: true })

  return data || []
}
