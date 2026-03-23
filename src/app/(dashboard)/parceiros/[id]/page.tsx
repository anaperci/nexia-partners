import { notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ParceiroDetalhe } from "@/components/parceiros/ParceiroDetalhe"
import { getParceiro, getUsuariosParceiro, getOportunidadesParceiro } from "@/lib/queries/parceiros"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ParceiroDetalhePage({ params }: Props) {
  const { id } = await params
  const [parceiro, usuarios, oportunidades] = await Promise.all([
    getParceiro(id),
    getUsuariosParceiro(id),
    getOportunidadesParceiro(id),
  ])

  if (!parceiro) return notFound()

  return (
    <>
      <Header title={parceiro.nome} description="Detalhes do parceiro">
        <Link href={`/parceiros/${id}/editar`}>
          <Button variant="outline" className="border-black/[0.07] text-[13px]">
            <Pencil size={14} className="mr-1.5" /> Editar
          </Button>
        </Link>
      </Header>
      <ParceiroDetalhe parceiro={parceiro} usuarios={usuarios} oportunidades={oportunidades} />
    </>
  )
}
