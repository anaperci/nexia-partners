"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Briefcase, Users, BarChart3, Settings, User, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"

const navItemsNexia = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, submenu: null },
  {
    label: "Oportunidades", href: "/oportunidades", icon: Briefcase,
    submenu: [
      { label: "Listar todas", href: "/oportunidades" },
      { label: "Nova oportunidade", href: "/oportunidades/nova" },
    ],
  },
  { label: "Parceiros", href: "/parceiros", icon: Users, submenu: null },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3, submenu: null },
  { label: "Configurações", href: "/configuracoes", icon: Settings, submenu: null },
]

const navItemsParceiro = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, submenu: null },
  {
    label: "Oportunidades", href: "/oportunidades", icon: Briefcase,
    submenu: [
      { label: "Minhas oportunidades", href: "/oportunidades" },
      { label: "Nova oportunidade", href: "/oportunidades/nova" },
    ],
  },
  { label: "Meu Perfil", href: "/perfil", icon: User, submenu: null },
]

interface SidebarProps {
  userName: string
  userEmail: string
  perfil?: "nexia" | "parceiro"
  vencendoCount?: number
}

export function Sidebar({ userName, userEmail, perfil = "nexia", vencendoCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const navItems = perfil === "nexia" ? navItemsNexia : navItemsParceiro

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success("Logout realizado")
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="no-print fixed left-0 top-0 h-screen w-[240px] flex flex-col z-40" style={{ background: "#46347F" }}>

      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-nexia-white.png" alt="NexIA Lab" width={110} height={28} priority />
        </Link>
        <p className="text-[11px] mt-1.5 font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Syne, sans-serif" }}>
          Partners
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const isExpanded = expandedMenu === item.href || isActive

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault()
                    setExpandedMenu(isExpanded ? null : item.href)
                    if (!isActive) router.push(item.href)
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:text-white/90 hover:bg-white/[0.07]"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.submenu && (
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform opacity-50", isExpanded && "rotate-180")} />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && isExpanded && (
                <div className="ml-[30px] mt-0.5 space-y-0.5 border-l" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  {item.submenu.map((sub) => {
                    const isSubActive = pathname === sub.href
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block pl-3 py-1.5 text-[12px] rounded-r-md transition-colors",
                          isSubActive
                            ? "text-white font-medium bg-white/10"
                            : "text-white/40 hover:text-white/75"
                        )}
                      >
                        {sub.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Badge vencendo */}
      {vencendoCount > 0 && (
        <Link
          href="/oportunidades?status=vencendo"
          className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-white/10"
          style={{ background: "rgba(245,158,11,0.15)", color: "rgba(255,255,255,0.85)" }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          {vencendoCount} oportunidade{vencendoCount > 1 ? "s" : ""} vencendo
        </Link>
      )}

      {/* Rodapé com usuário */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #5a44a0, #4f8ef7)" }}
          >
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white truncate">{userName || "Usuário"}</p>
            <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/80 transition-colors p-1"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
