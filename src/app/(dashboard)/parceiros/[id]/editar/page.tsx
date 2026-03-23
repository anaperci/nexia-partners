import { notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ParceiroForm } from "@/components/parceiros/ParceiroForm"
import { getParceiro } from "@/lib/queries/parceiros"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarParceiroPage({ params }: Props) {
  const { id } = await params
  const parceiro = await getParceiro(id)
  if (!parceiro) return notFound()

  return (
    <>
      <Header title="Editar Parceiro" description={parceiro.nome} />
      <ParceiroForm parceiro={parceiro} />
    </>
  )
}
