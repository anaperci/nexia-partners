import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getParceiros() {
  const supabase = await createServerSupabaseClient()
  const { data: parceiros } = await supabase
    .from("parceiros")
    .select("*")
    .order("nome")

  // Contar oportunidades e usuários por parceiro
  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("parceiro_id")
  const { data: usuarios } = await supabase
    .from("parceiro_usuarios")
    .select("parceiro_id")

  const opCount: Record<string, number> = {}
  oportunidades?.forEach((o) => { opCount[o.parceiro_id] = (opCount[o.parceiro_id] || 0) + 1 })

  const usrCount: Record<string, number> = {}
  usuarios?.forEach((u) => { usrCount[u.parceiro_id] = (usrCount[u.parceiro_id] || 0) + 1 })

  return (parceiros || []).map((p) => ({
    ...p,
    _count: opCount[p.id] || 0,
    _usuarios: usrCount[p.id] || 0,
  }))
}

export async function getParceiro(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("parceiros")
    .select("*")
    .eq("id", id)
    .single()
  return data
}

export async function getUsuariosParceiro(parceiroId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("parceiro_usuarios")
    .select("*")
    .eq("parceiro_id", parceiroId)
    .order("nome")
  return data || []
}

export async function getOportunidadesParceiro(parceiroId: string, limite = 5) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("oportunidades")
    .select("id, titulo, status, data_validade, orgao_empresa")
    .eq("parceiro_id", parceiroId)
    .order("criado_em", { ascending: false })
    .limit(limite)
  return data || []
}
