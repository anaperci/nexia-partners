import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { ConfiguracoesClient } from "@/components/configuracoes/ConfiguracoesClient"

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabaseClient()

  // Buscar config global
  const { data: configGlobal } = await supabase
    .from("configuracoes_duracao")
    .select("*")
    .is("parceiro_id", null)
    .single()

  // Buscar configs por parceiro
  const { data: configsParceiros } = await supabase
    .from("configuracoes_duracao")
    .select("*")
    .not("parceiro_id", "is", null)
    .order("criado_em", { ascending: false })

  // Buscar parceiros para o select
  const { data: parceiros } = await supabase
    .from("parceiros")
    .select("id, nome")
    .order("nome")

  // Enriquecer com nome do parceiro
  const configsEnriquecidas = (configsParceiros || []).map((c) => {
    const parceiro = parceiros?.find((p) => p.id === c.parceiro_id)
    return { ...c, parceiro_nome: parceiro?.nome || "Parceiro removido" }
  })

  return (
    <>
      <Header title="Configurações" description="Gerencie a duração padrão das oportunidades" />
      <ConfiguracoesClient
        configGlobal={configGlobal || { duracao_meses: 6 }}
        configsParceiros={configsEnriquecidas}
        parceiros={parceiros || []}
      />
    </>
  )
}
