import { stripe } from "./client"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Gift, Profile } from "@/types"

export interface CreateCheckoutParams {
  gift_id: string
  amount: number // in cents
  guest_name: string
  guest_email?: string
  message?: string
  slug: string
}

export interface CheckoutResult {
  checkout_url: string
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutResult> {
  const { gift_id, amount, guest_name, guest_email, message, slug } = params
  const supabase = createAdminClient()

  // 1. Fetch gift + owner profile in one go
  const { data: gift, error: giftError } = await supabase
    .from("gifts")
    .select("*, profiles:user_id(*)")
    .eq("id", gift_id)
    .single<Gift & { profiles: Profile }>()

  if (giftError || !gift) {
    throw new CheckoutError("Gift niet gevonden", 404)
  }

  if (!gift.is_visible) {
    throw new CheckoutError("Dit cadeau is niet beschikbaar", 400)
  }

  if (gift.is_fully_funded) {
    throw new CheckoutError("Dit cadeau is al volledig gefinancierd", 400)
  }

  const profile = gift.profiles
  if (!profile?.stripe_account_id || !profile.stripe_onboarding_complete) {
    throw new CheckoutError(
      "Betalingen zijn nog niet ingesteld voor deze lijst",
      400
    )
  }

  // 2. Validate amount
  const minContribution = Math.max(500, gift.min_contribution) // at least €5
  const remaining = gift.target_amount - gift.collected_amount

  if (amount < minContribution) {
    throw new CheckoutError(
      `Minimaal bedrag is €${(minContribution / 100).toFixed(2)}`,
      400
    )
  }

  if (amount > remaining) {
    throw new CheckoutError(
      `Maximaal ${(remaining / 100).toFixed(2)} euro (resterend bedrag)`,
      400
    )
  }

  // 3. Create contribution record (pending)
  const { data: contribution, error: contribError } = await supabase
    .from("contributions")
    .insert({
      gift_id,
      user_id: gift.user_id,
      guest_name: guest_name.trim(),
      guest_email: guest_email?.trim() || null,
      amount,
      message: message?.trim() || null,
      status: "pending",
      metadata: { slug },
    })
    .select("id")
    .single()

  if (contribError || !contribution) {
    throw new CheckoutError("Kon bijdrage niet aanmaken", 500)
  }

  // 4. Create Stripe Checkout Session
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["ideal"],
    mode: "payment",
    currency: "eur",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: amount,
          product_data: {
            name: gift.name,
            description: `Bijdrage van ${guest_name}`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: profile.stripe_account_id,
      },
      application_fee_amount: 0,
    },
    metadata: {
      gift_id,
      contribution_id: contribution.id,
      guest_name,
      slug,
    },
    success_url: `${appUrl}/${slug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/${slug}?cancelled=true`,
    ...(guest_email ? { customer_email: guest_email.trim() } : {}),
  })

  // 5. Store session ID on contribution
  await supabase
    .from("contributions")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", contribution.id)

  if (!session.url) {
    throw new CheckoutError("Stripe checkout URL niet beschikbaar", 500)
  }

  return { checkout_url: session.url }
}

export class CheckoutError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "CheckoutError"
    this.status = status
  }
}
