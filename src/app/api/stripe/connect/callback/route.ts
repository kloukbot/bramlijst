import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exchangeCodeForAccount, getAccountStatus } from "@/lib/stripe/connect"
import { cookies } from "next/headers"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/**
 * GET /api/stripe/connect/callback
 * Handle Stripe Connect OAuth callback.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const redirectBase = `${APP_URL}/dashboard/settings/stripe`

  // Handle user denial
  if (error) {
    const msg = encodeURIComponent(errorDescription || "Stripe koppeling geannuleerd")
    return NextResponse.redirect(`${redirectBase}?error=${msg}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectBase}?error=${encodeURIComponent("Ongeldige callback parameters")}`)
  }

  // Verify CSRF state
  const cookieStore = await cookies()
  const savedState = cookieStore.get("stripe_connect_state")?.value
  cookieStore.delete("stripe_connect_state")

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${redirectBase}?error=${encodeURIComponent("Ongeldige state parameter (CSRF)")}`)
  }

  // Verify user is logged in
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/login`)
  }

  // Verify state is bound to this user (H3: CSRF protection)
  const [stateUserId] = savedState.split(":")
  if (stateUserId !== user.id) {
    return NextResponse.redirect(`${redirectBase}?error=${encodeURIComponent("State mismatch - probeer opnieuw")}`)
  }

  try {
    // Exchange code for account
    const { stripeAccountId } = await exchangeCodeForAccount(code)

    // Check account status
    const status = await getAccountStatus(stripeAccountId)

    // Save to profile
    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        stripe_account_id: stripeAccountId,
        stripe_onboarding_complete: status.chargesEnabled && status.payoutsEnabled,
      })
      .eq("id", user.id)

    if (dbError) {
      throw new Error(dbError.message)
    }

    return NextResponse.redirect(`${redirectBase}?success=true`)
  } catch (err) {
    console.error("Stripe Connect callback error:", err)
    const msg = encodeURIComponent("Er ging iets mis bij het koppelen van Stripe")
    return NextResponse.redirect(`${redirectBase}?error=${msg}`)
  }
}
