import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { Header } from "@/components/layout/Header"
import { PerfilClient } from "@/components/perfil/PerfilClient"

export default async function PerfilPage() {
  const profile = await getUserProfile()
  if (!profile) redirect("/login")

  return (
    <>
      <Header title="Meu Perfil" description="Edite suas informações pessoais" />
      <PerfilClient profile={profile} />
    </>
  )
}
