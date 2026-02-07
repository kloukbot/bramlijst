import { stripe } from "./client"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/**
 * Generate Stripe Connect OAuth URL for Standard accounts.
 */
export function getConnectOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.STRIPE_CONNECT_CLIENT_ID!,
    scope: "read_write",
    redirect_uri: `${APP_URL}/api/stripe/connect/callback`,
    state,
    "stripe_landing": "login",
  })
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`
}

/**
 * Exchange OAuth code for Stripe account credentials.
 */
export async function exchangeCodeForAccount(code: string) {
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code,
  })
  return {
    stripeAccountId: response.stripe_user_id!,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  }
}

/**
 * Check if a connected account can accept charges and receive payouts.
 */
export async function getAccountStatus(stripeAccountId: string) {
  const account = await stripe.accounts.retrieve(stripeAccountId)
  return {
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
    email: account.email,
  }
}

/**
 * Check if Stripe account is fully ready (charges + payouts enabled).
 */
export async function isAccountReady(stripeAccountId: string): Promise<boolean> {
  const status = await getAccountStatus(stripeAccountId)
  return status.chargesEnabled && status.payoutsEnabled
}
