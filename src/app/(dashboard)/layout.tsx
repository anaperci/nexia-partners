import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Sidebar } from "@/components/layout/Sidebar"
import { getUserProfile } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Paralelizar todas as queries
  const [supabase, profile] = await Promise.all([
    createServerSupabaseClient(),
    getUserProfile(),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  const userName = profile?.nome || user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário"
  const userEmail = user?.email || ""

  // Query vencendo em paralelo (não bloqueia render)
  const vencendoPromise = (async () => {
    let q = supabase.from("oportunidades").select("id").eq("status", "vencendo")
    if (profile?.perfil === "parceiro" && profile.parceiro_id) {
      q = q.eq("parceiro_id", profile.parceiro_id)
    }
    const { data } = await q
    return data?.length || 0
  })()

  const vencendoCount = await vencendoPromise

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        vencendoCount={vencendoCount}
        perfil={profile?.perfil || "nexia"}
      />
      <main className="ml-[240px] px-8 py-6 max-w-[1400px]">
        {children}
      </main>
    </div>
  )
}
