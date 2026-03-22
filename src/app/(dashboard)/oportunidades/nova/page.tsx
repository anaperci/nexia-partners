import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { OportunidadeForm } from "@/components/oportunidades/OportunidadeForm"

export default async function NovaOportunidadePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: parceiros } = await supabase.from("parceiros").select("*").order("nome")

  // Buscar configs de duração
  const { data: configs } = await supabase.from("configuracoes_duracao").select("*")
  const configGlobal = configs?.find((c) => !c.parceiro_id)
  const porParceiro: Record<string, number> = {}
  configs?.filter((c) => c.parceiro_id).forEach((c) => {
    porParceiro[c.parceiro_id] = c.duracao_meses
  })

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || ""

  return (
    <>
      <Header title="Nova Oportunidade" description="Registre uma nova oportunidade de parceiro" />
      <OportunidadeForm
        parceiros={parceiros || []}
        userId={user?.id}
        userName={userName}
        duracaoConfig={{
          global: configGlobal?.duracao_meses || 6,
          porParceiro,
        }}
      />
    </>
  )
}
