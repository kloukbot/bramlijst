"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

export function PaymentResult() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success") === "true"
  const cancelled = searchParams.get("cancelled") === "true"
  const sessionId = searchParams.get("session_id")

  if (!success && !cancelled) return null

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle>Bedankt voor je bijdrage!</AlertTitle>
        <AlertDescription>
          Je betaling is succesvol ontvangen. Het bruidspaar ontvangt een melding.
          {sessionId && (
            <span className="block mt-1 text-xs text-green-700">
              Referentie: {sessionId.slice(0, 16)}…
            </span>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-900">
      <XCircle className="h-5 w-5 text-orange-600" />
      <AlertTitle>Betaling geannuleerd</AlertTitle>
      <AlertDescription>
        Je betaling is niet afgerond. Je kunt het opnieuw proberen door een
        cadeau te kiezen en bij te dragen.
      </AlertDescription>
    </Alert>
  )
}
