import { redirect } from "next/navigation"
import { getUserProfile, isNexia } from "@/lib/auth"
import { DashboardNexia } from "@/components/dashboard/DashboardNexia"
import { DashboardParceiro } from "@/components/dashboard/DashboardParceiro"

export default async function DashboardPage() {
  const profile = await getUserProfile()

  if (!profile) redirect("/login")

  if (isNexia(profile)) {
    return <DashboardNexia profile={profile} />
  }

  return <DashboardParceiro profile={profile} />
}
