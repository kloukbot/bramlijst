"use server"

import { createClient } from "@/lib/supabase/server"
import { getAccountStatus } from "@/lib/stripe/connect"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/types"

export async function refreshStripeStatus(): Promise<
  ActionResult & {
    chargesEnabled?: boolean
    payoutsEnabled?: boolean
    detailsSubmitted?: boolean
  }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Niet ingelogd" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_account_id) {
    return { error: "Geen Stripe account gekoppeld" }
  }

  try {
    const status = await getAccountStatus(profile.stripe_account_id)

    // Update onboarding status in DB
    await supabase
      .from("profiles")
      .update({
        stripe_onboarding_complete:
          status.chargesEnabled && status.payoutsEnabled,
      })
      .eq("id", user.id)

    revalidatePath("/dashboard/settings/stripe")

    return {
      success: true,
      chargesEnabled: status.chargesEnabled,
      payoutsEnabled: status.payoutsEnabled,
      detailsSubmitted: status.detailsSubmitted,
    }
  } catch {
    return { error: "Kon Stripe status niet ophalen" }
  }
}
