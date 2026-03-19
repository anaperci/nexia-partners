import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { OportunidadeForm } from "@/components/oportunidades/OportunidadeForm"
import { OportunidadeDetalhe } from "@/components/oportunidades/OportunidadeDetalhe"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function OportunidadeDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { edit } = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: oportunidade } = await supabase
    .from("oportunidades")
    .select("*")
    .eq("id", id)
    .single()

  if (!oportunidade) return notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: parceiros } = await supabase.from("parceiros").select("*").order("nome")

  if (edit === "true") {
    return (
      <>
        <Header title="Editar Oportunidade" description={oportunidade.titulo} />
        <OportunidadeForm
          oportunidade={oportunidade}
          parceiros={parceiros || []}
          userId={user?.id}
          userName={user?.user_metadata?.name || user?.email?.split("@")[0] || ""}
        />
      </>
    )
  }

  return <OportunidadeDetalhe oportunidade={oportunidade} />
}
