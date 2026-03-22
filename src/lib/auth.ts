import { createServerSupabaseClient } from "@/lib/supabase-server"
import type { UserProfile } from "@/lib/types"

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // Fallback: se não tem perfil, considerar como nexia (admin)
    return {
      id: user.id,
      nome: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
      perfil: "nexia",
      criado_em: new Date().toISOString(),
    }
  }

  return profile as UserProfile
}

export function isNexia(profile: UserProfile | null): boolean {
  return profile?.perfil === "nexia"
}
