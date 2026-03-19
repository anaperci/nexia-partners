"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error("Erro ao fazer login", { description: error.message })
      setLoading(false)
      return
    }

    toast.success("Login realizado com sucesso!")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0c0e14' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl border p-8" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo-nexia.svg" alt="NexIA Lab" width={200} height={50} priority />
        </div>

        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#2D1B4E' }}>
            NexIA Partners
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Gestão de Oportunidades de Parceiros
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#374151' }}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 focus:border-[#46347F] focus:ring-[#46347F]"
              style={{ background: '#f9fafb', color: '#111827' }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#374151' }}>Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-300 focus:border-[#46347F] focus:ring-[#46347F]"
              style={{ background: '#f9fafb', color: '#111827' }}
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white"
            disabled={loading}
            style={{ background: '#46347F' }}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Entrar
          </Button>
        </form>

        {/* Rodapé */}
        <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
          © 2026 NexIA Lab — Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
