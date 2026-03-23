import { Header } from "@/components/layout/Header"
import { ParceiroForm } from "@/components/parceiros/ParceiroForm"

export default function NovoParceiroPage() {
  return (
    <>
      <Header title="Novo Parceiro" description="Cadastre um novo parceiro comercial" />
      <ParceiroForm />
    </>
  )
}
