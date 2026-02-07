import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getConnectOAuthUrl } from "@/lib/stripe/connect"
import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

/**
 * POST /api/stripe/connect
 * Generate Stripe Connect OAuth URL and redirect user.
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 5 req/min per IP
  const ip = getClientIp(request)
  const rl = rateLimit(`connect:${ip}`, { maxRequests: 5, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    )
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  }

  // Generate CSRF state token
  const state = randomBytes(32).toString("hex")

  // Store state in cookie for verification on callback
  const cookieStore = await cookies()
  cookieStore.set("stripe_connect_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  const url = getConnectOAuthUrl(state)
  return NextResponse.json({ url })
}
