import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types"
import { StripeConnectClient } from "./stripe-connect-client"

export default async function StripeSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Stripe Koppeling</h2>
        <p className="text-muted-foreground">
          Koppel je Stripe-account om betalingen te ontvangen via je cadeaulijst.
        </p>
      </div>

      <StripeConnectClient
        stripeAccountId={profile?.stripe_account_id ?? null}
        onboardingComplete={profile?.stripe_onboarding_complete ?? false}
      />
    </div>
  )
}
