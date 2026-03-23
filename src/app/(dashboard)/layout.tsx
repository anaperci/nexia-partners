import { createServerSupabaseClient } from "@/lib/supabase-server"
import { TopNav } from "@/components/layout/TopNav"
import { getUserProfile } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getUserProfile()

  const userName = profile?.nome || user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário"
  const userEmail = user?.email || ""

  // Contar oportunidades vencendo (filtrar por parceiro se for perfil parceiro)
  let vencendoQuery = supabase.from("oportunidades").select("id").eq("status", "vencendo")
  if (profile?.perfil === "parceiro" && profile.parceiro_id) {
    vencendoQuery = vencendoQuery.eq("parceiro_id", profile.parceiro_id)
  }
  const { data: vencendo } = await vencendoQuery

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f5f7' }}>
      <TopNav
        userName={userName}
        userEmail={userEmail}
        vencendoCount={vencendo?.length || 0}
        perfil={profile?.perfil || 'nexia'}
      />
      <main className="flex-1 px-6 py-8 max-w-[1400px] mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
