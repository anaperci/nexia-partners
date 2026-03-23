"use client"

import { useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Briefcase, Users, BarChart3, Settings, User, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navItemsNexia = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, submenu: null },
  {
    label: "Oportunidades", href: "/oportunidades", icon: Briefcase,
    submenu: [
      { label: "Listar todas", href: "/oportunidades" },
      { label: "Nova oportunidade", href: "/oportunidades/nova" },
    ],
  },
  {
    label: "Parceiros", href: "/parceiros", icon: Users,
    submenu: [
      { label: "Todos os parceiros", href: "/parceiros" },
      { label: "Novo parceiro", href: "/parceiros/novo" },
    ],
  },
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
  const navItems = perfil === "nexia" ? navItemsNexia : navItemsParceiro

  // Memoizar o supabase client
  const supabase = useMemo(() => createClient(), [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    toast.success("Logout realizado")
    router.push("/login")
    router.refresh()
  }, [supabase, router])

  return (
    <aside className="no-print fixed left-0 top-0 h-screen w-[240px] flex flex-col z-40" style={{ background: "#46347F" }}>

      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-nexia-white.png" alt="NexIA Lab" width={110} height={28} priority />
        </Link>
        <p className="text-[11px] mt-1.5 font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Syne, sans-serif" }}>
          Partners
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-white"
                    : "text-white/80 hover:text-white hover:bg-white/[0.07]"
                )}
              >
                {/* Active background animado */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-white/[0.15]"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative flex items-center gap-3 flex-1">
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.submenu && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 opacity-50 transition-transform duration-200",
                      isActive && "rotate-180"
                    )} />
                  )}
                </span>
              </Link>

              {/* Submenu animado */}
              <AnimatePresence>
                {item.submenu && isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[30px] mt-1 space-y-0.5 border-l" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                      {item.submenu.map((sub) => {
                        const isSubActive = pathname === sub.href
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block pl-3 py-1.5 text-[13px] rounded-r-md transition-colors duration-150",
                              isSubActive
                                ? "text-white font-medium bg-white/10"
                                : "text-white/65 hover:text-white"
                            )}
                          >
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Badge vencendo */}
      {vencendoCount > 0 && (
        <Link
          href="/oportunidades?status=vencendo"
          className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-150 hover:bg-white/10"
          style={{ background: "rgba(245,158,11,0.15)", color: "rgba(255,255,255,0.9)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
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
            <p className="text-[13px] font-medium text-white truncate">{userName || "Usuário"}</p>
            <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{userEmail}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="text-white/40 hover:text-white/90 transition-colors p-1.5 rounded-md hover:bg-white/[0.07]"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
