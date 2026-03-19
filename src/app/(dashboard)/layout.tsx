import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário"
  const userEmail = user?.email || ""

  return (
    <div className="min-h-screen" style={{ background: '#0c0e14' }}>
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="ml-[240px] p-8">
        {children}
      </main>
    </div>
  )
}
