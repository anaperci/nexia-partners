import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Sidebar } from "@/components/layout/Sidebar"
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

  // Contar oportunidades vencendo
  let vencendoQuery = supabase.from("oportunidades").select("id").eq("status", "vencendo")
  if (profile?.perfil === "parceiro" && profile.parceiro_id) {
    vencendoQuery = vencendoQuery.eq("parceiro_id", profile.parceiro_id)
  }
  const { data: vencendo } = await vencendoQuery

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        vencendoCount={vencendo?.length || 0}
        perfil={profile?.perfil || 'nexia'}
      />
      <main className="ml-[240px] px-8 py-6 max-w-[1400px]">
        {children}
      </main>
    </div>
  )
}
