import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/dashboard/profile-form"
import type { Profile } from "@/types"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Instellingen
        </h1>
        <p className="text-sm text-muted-foreground">
          Beheer jullie profiel en lijstinstellingen
        </p>
      </div>

      <ProfileForm profile={profile as Profile} />
    </div>
  )
}
