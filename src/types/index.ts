/** App-level types (supplements generated Supabase types) */

export type ActionResult = {
  error?: string
  success?: boolean
}

export type Profile = {
  id: string
  email: string
  display_name: string | null
  partner_name_1: string | null
  partner_name_2: string | null
  slug: string
  wedding_date: string | null
  welcome_message: string | null
  cover_image_url: string | null
  avatar_url: string | null
  is_published: boolean
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  currency: string
  locale: string
  pricing_tier: string
  created_at: string
  updated_at: string
}

export type Gift = {
  id: string
  user_id: string
  name: string
  description: string | null
  target_amount: number // in cents
  collected_amount: number // in cents
  image_url: string | null
  is_fully_funded: boolean
  allow_partial: boolean
  min_contribution: number // in cents
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type ContributionStatus = "pending" | "succeeded" | "failed" | "refunded"

export type Contribution = {
  id: string
  gift_id: string | null
  user_id: string
  guest_name: string
  guest_email: string | null
  amount: number // in cents
  message: string | null
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  status: ContributionStatus
  is_thank_you_sent: boolean
  thank_you_message: string | null
  thank_you_sent_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
