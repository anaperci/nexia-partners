"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { LayoutDashboard, Briefcase, Users, BarChart3, LogOut, Menu, ChevronDown, Settings, User } from "lucide-react"
import { toast } from "sonner"

const navItemsNexia = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, submenu: null },
  {
    label: "Oportunidades", href: "/oportunidades", icon: Briefcase,
    submenu: [
      { label: "Listar todas", href: "/oportunidades" },
      { label: "Nova oportunidade", href: "/oportunidades/nova" },
      { label: "Ativas", href: "/oportunidades?status=ativo" },
      { label: "Vencendo", href: "/oportunidades?status=vencendo" },
      { label: "Expiradas", href: "/oportunidades?status=expirado" },
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
      { label: "Ativas", href: "/oportunidades?status=ativo" },
      { label: "Vencendo", href: "/oportunidades?status=vencendo" },
    ],
  },
  { label: "Meu Perfil", href: "/perfil", icon: User, submenu: null },
]

interface TopNavProps {
  userName: string
  userEmail: string
  vencendoCount?: number
  perfil?: 'nexia' | 'parceiro'
}

export function TopNav({ userName, userEmail, vencendoCount = 0, perfil = 'nexia' }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = perfil === 'nexia' ? navItemsNexia : navItemsParceiro

  // Determinar item ativo (match mais longo, Dashboard só se pathname === "/")
  const activeItem = navItems.find((item) => {
    if (item.href === "/") return pathname === "/"
    return pathname.startsWith(item.href)
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success("Logout realizado")
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="no-print sticky top-0 z-50">
      {/* Barra principal roxa */}
      <nav
        className="flex items-center justify-between px-6 h-[50px]"
        style={{ background: "#46347F" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-nexia-white.jpg" alt="NexIA Lab" width={100} height={26} priority className="" />
          <span
            className="text-white font-bold text-[15px] hidden sm:inline"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Partners
          </span>
        </Link>

        {/* Nav items — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-colors"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-md"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.submenu && <ChevronDown className="h-3 w-3 opacity-60" />}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-3">
          {/* Badge vencendo */}
          {vencendoCount > 0 && (
            <Link
              href="/oportunidades?status=vencendo"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {vencendoCount} vencendo
            </Link>
          )}

          {/* Avatar + dropdown */}
          <div className="relative group">
            <button
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #46347F, #4f8ef7)" }}
            >
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 top-10 w-56 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="p-3 border-b" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-sm font-medium" style={{ color: "#111827" }}>{userName}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{userEmail}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => router.push("/perfil")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
                  style={{ color: "#374151" }}
                >
                  <User className="h-4 w-4" />
                  Meu Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
                  style={{ color: "#ef4444" }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Subbarra contextual — só aparece se a seção ativa tiver submenu */}
      {activeItem?.submenu && (
        <div
          className="hidden md:flex items-center gap-2 px-6 h-[44px] border-b"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          {activeItem.submenu.map((sub) => {
            const isSubActive = pathname + (typeof window !== "undefined" ? window.location.search : "") === sub.href ||
              (pathname === sub.href.split("?")[0] && !sub.href.includes("?") && pathname === sub.href)
            return (
              <Link
                key={sub.href}
                href={sub.href}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  background: isSubActive ? "#f3f4f6" : "transparent",
                  color: isSubActive ? "#111827" : "#6b7280",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {sub.label}
              </Link>
            )
          })}
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] p-0" style={{ background: "#46347F" }}>
            {/* Logo */}
            <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <Image src="/logo-nexia-white.jpg" alt="NexIA Lab" width={120} height={30} className="" />
            </div>
            {/* Nav items */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                    {/* Sub items mobile */}
                    {isActive && item.submenu && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-1.5 text-xs rounded-md"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
            {/* User info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #46347F, #4f8ef7)" }}>
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
