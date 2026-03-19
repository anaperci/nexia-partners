import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { OportunidadeForm } from "@/components/oportunidades/OportunidadeForm"

export default async function NovaOportunidadePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: parceiros } = await supabase.from("parceiros").select("*").order("nome")

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || ""

  return (
    <>
      <Header title="Nova Oportunidade" description="Registre uma nova oportunidade de parceiro" />
      <OportunidadeForm
        parceiros={parceiros || []}
        userId={user?.id}
        userName={userName}
      />
    </>
  )
}
