import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { RelatoriosClient } from "@/components/relatorios/RelatoriosClient"

export default async function RelatoriosPage() {
  const supabase = await createServerSupabaseClient()

  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("*")
    .order("data_validade", { ascending: true })

  return (
    <>
      <Header title="Relatórios" description="Análises e exportação de dados" />
      <RelatoriosClient oportunidades={oportunidades || []} />
    </>
  )
}
