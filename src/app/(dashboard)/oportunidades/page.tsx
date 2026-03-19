import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Header } from "@/components/layout/Header"
import { OportunidadesListClient } from "@/components/oportunidades/OportunidadesListClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function OportunidadesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("*")
    .order("criado_em", { ascending: false })

  const { data: parceiros } = await supabase
    .from("parceiros")
    .select("id, nome")
    .order("nome")

  return (
    <>
      <Header title="Oportunidades" description="Gerencie todas as oportunidades de parceiros">
        <Link href="/oportunidades/nova">
          <Button style={{ background: '#4f8ef7', color: '#fff' }}>
            <Plus className="mr-2 h-4 w-4" /> Nova Oportunidade
          </Button>
        </Link>
      </Header>
      <OportunidadesListClient
        oportunidades={oportunidades || []}
        parceiros={parceiros || []}
      />
    </>
  )
}
