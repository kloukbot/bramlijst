/**
 * Email helper — MVP implementation
 * Uses Resend if API key available, otherwise logs to console.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || "Bramlijst <noreply@bramlijst.nl>"

type SendEmailParams = {
  to: string
  subject: string
  html: string
}

type SendEmailResult = {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
  // Graceful degradation: no API key = console log
  if (!RESEND_API_KEY || RESEND_API_KEY === "re_placeholder") {
    console.log(`[email] Would send to: ${to}`)
    console.log(`[email] Subject: ${subject}`)
    console.log(`[email] Body length: ${html.length} chars`)
    return { success: true, id: `console-${Date.now()}` }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error(`[email] Resend error: ${err}`)
      return { success: false, error: err }
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error(`[email] Failed to send: ${message}`)
    return { success: false, error: message }
  }
}
