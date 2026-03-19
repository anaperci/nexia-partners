import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { ParceirosClient } from "@/components/parceiros/ParceirosClient"

export default async function ParceirosPage() {
  const supabase = await createServerSupabaseClient()

  const { data: parceiros } = await supabase
    .from("parceiros")
    .select("*")
    .order("nome")

  // Contar oportunidades por parceiro
  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("parceiro_nome")

  const contagem: Record<string, number> = {}
  oportunidades?.forEach((o) => {
    contagem[o.parceiro_nome] = (contagem[o.parceiro_nome] || 0) + 1
  })

  const parceirosComContagem = (parceiros || []).map((p) => ({
    ...p,
    _count: contagem[p.nome] || 0,
  }))

  return (
    <>
      <Header title="Parceiros" description="Cadastre e gerencie os parceiros comerciais" />
      <ParceirosClient parceiros={parceirosComContagem} />
    </>
  )
}
