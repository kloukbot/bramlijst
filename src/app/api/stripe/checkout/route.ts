import { NextRequest, NextResponse } from "next/server"
import {
  createCheckoutSession,
  CheckoutError,
  type CreateCheckoutParams,
} from "@/lib/stripe/checkout"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { sanitize } from "@/lib/utils"

export async function POST(request: NextRequest) {
  // Rate limiting: 10 req/10s per IP (Upstash Redis)
  const ip = getClientIp(request)
  const rl = await checkRateLimit(`checkout:${ip}`, "api")
  if (!rl.success) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset ?? 10000) / 1000)) } }
    )
  }

  // CSRF: verify Origin header
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: "Ongeldig verzoek" }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: "Ongeldig verzoek" }, { status: 403 })
    }
  }

  try {
    const body = (await request.json()) as Partial<CreateCheckoutParams>

    // Basic validation
    if (!body.gift_id || typeof body.gift_id !== "string") {
      return NextResponse.json({ error: "gift_id is verplicht" }, { status: 400 })
    }
    if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json({ error: "Ongeldig bedrag" }, { status: 400 })
    }
    if (!body.guest_name || typeof body.guest_name !== "string" || !body.guest_name.trim()) {
      return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string") {
      return NextResponse.json({ error: "slug is verplicht" }, { status: 400 })
    }

    const result = await createCheckoutSession({
      gift_id: body.gift_id,
      amount: body.amount,
      guest_name: body.guest_name.trim(),
      guest_email: body.guest_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.guest_email) ? body.guest_email : undefined,
      message: body.message ? body.message.trim() : undefined,
      slug: body.slug,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("[checkout] Unexpected error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    )
  }
}
