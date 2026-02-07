"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { thankYouEmail } from "@/lib/email-templates"
import type { ActionResult } from "@/types"
import { sanitize } from "@/lib/utils"

/** Send a thank-you message for a contribution (Epic 7.3 + 8.5) */
export async function sendThankYou(
  contributionId: string,
  message: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Niet ingelogd" }

  // Get contribution (must belong to this user)
  const { data: contribution, error: fetchErr } = await supabase
    .from("contributions")
    .select("id, guest_name, guest_email, gift_id, user_id")
    .eq("id", contributionId)
    .eq("user_id", user.id)
    .single()

  if (fetchErr || !contribution) return { error: "Bijdrage niet gevonden" }

  // Get gift name if exists
  let giftName: string | null = null
  if (contribution.gift_id) {
    const { data: gift } = await supabase
      .from("gifts")
      .select("name")
      .eq("id", contribution.gift_id)
      .single()
    giftName = gift?.name ?? null
  }

  // Get couple display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("partner_name_1, partner_name_2, display_name")
    .eq("id", user.id)
    .single()

  const coupleName = profile?.partner_name_1 && profile?.partner_name_2
    ? `${profile.partner_name_1} & ${profile.partner_name_2}`
    : profile?.display_name || "Het bruidspaar"

  // Update contribution
  const sanitizedMessage = sanitize(message)
  const { error: updateErr } = await supabase
    .from("contributions")
    .update({
      is_thank_you_sent: true,
      thank_you_message: sanitizedMessage,
      thank_you_sent_at: new Date().toISOString(),
    })
    .eq("id", contributionId)
    .eq("user_id", user.id)

  if (updateErr) return { error: "Kon bedankbericht niet opslaan" }

  // Send email if guest has email (Epic 8.5)
  if (contribution.guest_email) {
    const template = thankYouEmail({
      guestName: contribution.guest_name,
      coupleName,
      message: sanitizedMessage,
      giftName,
    })

    const emailResult = await sendEmail({
      to: contribution.guest_email,
      subject: template.subject,
      html: template.html,
    })

    // Log email
    try {
      const admin = createAdminClient()
      await admin.from("email_logs").insert({
        user_id: user.id,
        contribution_id: contributionId,
        email_type: "thank_you",
        recipient_email: contribution.guest_email,
        subject: template.subject,
        status: emailResult.success ? "sent" : "failed",
        error_message: emailResult.error || null,
        sent_at: emailResult.success ? new Date().toISOString() : null,
      })
    } catch (e) {
      console.error("[sendThankYou] Failed to log email:", e)
    }
  }

  revalidatePath("/dashboard/transactions")
  return { success: true }
}

/** Bulk mark contributions as thanked (Epic 7.4) */
export async function markAllThanked(
  contributionIds: string[]
): Promise<ActionResult> {
  if (contributionIds.length === 0) return { error: "Geen bijdragen geselecteerd" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Niet ingelogd" }

  const { error } = await supabase
    .from("contributions")
    .update({
      is_thank_you_sent: true,
      thank_you_sent_at: new Date().toISOString(),
    })
    .in("id", contributionIds)
    .eq("user_id", user.id)

  if (error) return { error: "Kon bijdragen niet bijwerken" }

  revalidatePath("/dashboard/transactions")
  return { success: true }
}
