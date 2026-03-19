"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
      <Card className="w-full max-w-md" style={{ background: '#13151e', borderColor: '#252836' }}>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            NexIA Partners
          </CardTitle>
          <CardDescription style={{ color: '#6b7280' }}>
            Gestão de Oportunidades de Parceiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#e8eaf0' }}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#252836] focus:border-[#4f8ef7]"
                style={{ background: '#1a1d2a', color: '#e8eaf0' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#e8eaf0' }}>Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#252836] focus:border-[#4f8ef7]"
                style={{ background: '#1a1d2a', color: '#e8eaf0' }}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{ background: '#4f8ef7', color: '#ffffff' }}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
