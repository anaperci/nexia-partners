import { Header } from "@/components/layout/Header"
import { ParceirosListPage } from "@/components/parceiros/ParceirosListPage"
import { getParceiros } from "@/lib/queries/parceiros"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ParceirosPage() {
  const parceiros = await getParceiros()

  return (
    <>
      <Header title="Parceiros" description="Gerencie os parceiros e seus usuários">
        <Link href="/parceiros/novo">
          <Button className="bg-[#46347F] hover:bg-[#3a2d6e] text-white rounded-lg h-9 px-4 text-[13px] font-medium">
            <Plus size={14} className="mr-1.5" /> Novo Parceiro
          </Button>
        </Link>
      </Header>
      <ParceirosListPage parceiros={parceiros} />
    </>
  )
}
