import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getOportunidadesPDTI(limite = 8) {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("pdti_oportunidades")
    .select("*")
    .is("oportunidade_parceiro_id", null)
    .order("criado_em", { ascending: false })
    .limit(limite)

  return data || []
}

export async function vincularPDTIaOportunidade(pdtiId: string, oportunidadeId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("pdti_oportunidades")
    .update({ oportunidade_parceiro_id: oportunidadeId })
    .eq("id", pdtiId)
  if (error) throw new Error(error.message)
}
