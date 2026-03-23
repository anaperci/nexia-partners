import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { OnboardingClient } from "@/components/onboarding/OnboardingClient"

export default async function OnboardingPage() {
  const profile = await getUserProfile()
  if (!profile) redirect("/login")
  if (profile.onboarding_completo) redirect("/")

  return <OnboardingClient profile={profile} />
}
