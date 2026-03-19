"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Briefcase, Users, BarChart3, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Oportunidades", href: "/oportunidades", icon: Briefcase },
  { name: "Parceiros", href: "/parceiros", icon: Users },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
]

interface SidebarProps {
  userName: string
  userEmail: string
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success("Logout realizado")
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="no-print fixed left-0 top-0 h-screen w-[240px] flex flex-col" style={{ background: '#46347F' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          NexIA Partners
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Gestão de Oportunidades
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-gray-100 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé com usuário */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName || "Usuário"}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
