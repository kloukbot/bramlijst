import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email"
import { contributionReceivedEmail, paymentConfirmationEmail } from "@/lib/email-templates"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const contributionId = session.metadata?.contribution_id
        if (!contributionId) break

        // Idempotency: skip if already succeeded
        const { data: existing } = await supabase
          .from("contributions")
          .select("status")
          .eq("id", contributionId)
          .single()

        if (existing?.status === "succeeded") break

        await supabase
          .from("contributions")
          .update({
            status: "succeeded",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
          })
          .eq("id", contributionId)

        // Send notification emails (Epic 8.4 + 8.6)
        try {
          const { data: contribution } = await supabase
            .from("contributions")
            .select("guest_name, guest_email, amount, message, gift_id, user_id")
            .eq("id", contributionId)
            .single()

          if (contribution) {
            // Get gift name
            let giftName: string | null = null
            if (contribution.gift_id) {
              const { data: gift } = await supabase
                .from("gifts")
                .select("name")
                .eq("id", contribution.gift_id)
                .single()
              giftName = gift?.name ?? null
            }

            // Get couple profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("email, partner_name_1, partner_name_2, display_name")
              .eq("id", contribution.user_id)
              .single()

            const coupleName = profile?.partner_name_1 && profile?.partner_name_2
              ? `${profile.partner_name_1} & ${profile.partner_name_2}`
              : profile?.display_name || "Het bruidspaar"

            // 8.4: Email to couple
            if (profile?.email) {
              const template = contributionReceivedEmail({
                coupleName,
                guestName: contribution.guest_name,
                giftName,
                amount: contribution.amount,
                message: contribution.message,
              })
              const result = await sendEmail({ to: profile.email, ...template })
              await supabase.from("email_logs").insert({
                user_id: contribution.user_id,
                contribution_id: contributionId,
                email_type: "contribution_received",
                recipient_email: profile.email,
                subject: template.subject,
                status: result.success ? "sent" : "failed",
                error_message: result.error || null,
                sent_at: result.success ? new Date().toISOString() : null,
              })
            }

            // 8.6: Confirmation email to guest
            if (contribution.guest_email) {
              const template = paymentConfirmationEmail({
                guestName: contribution.guest_name,
                coupleName,
                giftName,
                amount: contribution.amount,
              })
              const result = await sendEmail({ to: contribution.guest_email, ...template })
              await supabase.from("email_logs").insert({
                user_id: contribution.user_id,
                contribution_id: contributionId,
                email_type: "payment_confirmation",
                recipient_email: contribution.guest_email,
                subject: template.subject,
                status: result.success ? "sent" : "failed",
                error_message: result.error || null,
                sent_at: result.success ? new Date().toISOString() : null,
              })
            }
          }
        } catch (emailErr) {
          console.error("[webhook] Email notification error:", emailErr)
          // Don't fail the webhook for email errors
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Find contribution by payment intent
        const { data: contrib } = await supabase
          .from("contributions")
          .select("id, status")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single()

        if (contrib && contrib.status !== "failed") {
          await supabase
            .from("contributions")
            .update({ status: "failed" })
            .eq("id", contrib.id)
        }

        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const piId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id

        if (!piId) break

        const { data: contrib } = await supabase
          .from("contributions")
          .select("id, status")
          .eq("stripe_payment_intent_id", piId)
          .single()

        if (contrib && contrib.status !== "refunded") {
          await supabase
            .from("contributions")
            .update({ status: "refunded" })
            .eq("id", contrib.id)
        }

        break
      }

      default:
        // Unhandled event type — that's fine
        break
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err)
    // Still return 200 to prevent Stripe retries for processing errors
  }

  return NextResponse.json({ received: true })
}
