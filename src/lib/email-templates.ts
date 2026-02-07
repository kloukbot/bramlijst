/**
 * Simple HTML email templates for MVP
 */

import { formatCents } from "@/lib/utils"

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#ec4899,#f43f5e);padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">💍 Bramlijst</h1>
    </div>
    <div style="padding:32px">
      ${content}
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af">
      Verstuurd via Bramlijst
    </div>
  </div>
</body>
</html>`
}

/** Welcome email for new couples */
export function welcomeEmail(displayName: string): { subject: string; html: string } {
  return {
    subject: "Welkom bij Bramlijst! 🎉",
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111;font-size:18px">Welkom, ${displayName}!</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px">
        Jullie account is aangemaakt. Tijd om jullie cadeaulijst samen te stellen!
      </p>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px">
        Begin met het toevoegen van cadeaus en deel jullie unieke link met gasten.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
         style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:500">
        Ga naar je dashboard →
      </a>
    `),
  }
}

/** Email to couple when a new contribution is received */
export function contributionReceivedEmail(params: {
  coupleName: string
  guestName: string
  giftName: string | null
  amount: number // cents
  message: string | null
}): { subject: string; html: string } {
  return {
    subject: `🎁 Nieuwe bijdrage van ${params.guestName}!`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111;font-size:18px">Nieuwe bijdrage ontvangen!</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px">
        Goed nieuws, ${params.coupleName}! Er is een bijdrage binnengekomen.
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px">
        <p style="margin:0 0 8px;color:#111"><strong>Gast:</strong> ${params.guestName}</p>
        ${params.giftName ? `<p style="margin:0 0 8px;color:#111"><strong>Cadeau:</strong> ${params.giftName}</p>` : ""}
        <p style="margin:0 0 8px;color:#111"><strong>Bedrag:</strong> ${formatCents(params.amount)}</p>
        ${params.message ? `<p style="margin:0;color:#111"><strong>Bericht:</strong> "${params.message}"</p>` : ""}
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/transactions" 
         style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:500">
        Bekijk transacties →
      </a>
    `),
  }
}

/** Thank you email from couple to guest */
export function thankYouEmail(params: {
  guestName: string
  coupleName: string
  message: string
  giftName: string | null
}): { subject: string; html: string } {
  return {
    subject: `Bedankt van ${params.coupleName}! 💕`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111;font-size:18px">Lieve ${params.guestName},</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px">
        ${params.coupleName} heeft je een persoonlijk bericht gestuurd:
      </p>
      <div style="background:#fdf2f8;border-left:4px solid #ec4899;padding:16px;border-radius:0 8px 8px 0;margin:0 0 16px">
        <p style="margin:0;color:#111;font-style:italic;line-height:1.6">"${params.message}"</p>
      </div>
      ${params.giftName ? `<p style="color:#9ca3af;font-size:13px;margin:0">Voor: ${params.giftName}</p>` : ""}
    `),
  }
}

/** Payment confirmation email to guest */
export function paymentConfirmationEmail(params: {
  guestName: string
  coupleName: string
  giftName: string | null
  amount: number // cents
}): { subject: string; html: string } {
  return {
    subject: `Bevestiging: bijdrage aan ${params.coupleName}`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111;font-size:18px">Bedankt, ${params.guestName}!</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 16px">
        Je bijdrage is succesvol ontvangen. Hier is een overzicht:
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px">
        <p style="margin:0 0 8px;color:#111"><strong>Voor:</strong> ${params.coupleName}</p>
        ${params.giftName ? `<p style="margin:0 0 8px;color:#111"><strong>Cadeau:</strong> ${params.giftName}</p>` : ""}
        <p style="margin:0;color:#111"><strong>Bedrag:</strong> ${formatCents(params.amount)}</p>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:0">
        Dit is een automatische bevestiging. Je hoeft niet te antwoorden.
      </p>
    `),
  }
}
