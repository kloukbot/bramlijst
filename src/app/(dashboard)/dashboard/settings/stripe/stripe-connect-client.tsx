"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { refreshStripeStatus } from "@/actions/stripe"
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertTriangle,
  LinkIcon,
  RefreshCw,
} from "lucide-react"

interface StripeConnectClientProps {
  stripeAccountId: string | null
  onboardingComplete: boolean
}

export function StripeConnectClient({
  stripeAccountId,
  onboardingComplete,
}: StripeConnectClientProps) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [statusInfo, setStatusInfo] = useState<{
    chargesEnabled?: boolean
    payoutsEnabled?: boolean
    detailsSubmitted?: boolean
  } | null>(null)

  const successParam = searchParams.get("success")
  const errorParam = searchParams.get("error")

  async function handleConnect() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Er ging iets mis")
        setLoading(false)
      }
    } catch {
      alert("Er ging iets mis bij het starten van de koppeling")
      setLoading(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    const result = await refreshStripeStatus()
    if (result.success) {
      setStatusInfo({
        chargesEnabled: result.chargesEnabled,
        payoutsEnabled: result.payoutsEnabled,
        detailsSubmitted: result.detailsSubmitted,
      })
    }
    setRefreshing(false)
  }

  const isReady = onboardingComplete || (statusInfo?.chargesEnabled && statusInfo?.payoutsEnabled)

  return (
    <div className="space-y-4">
      {/* Success/error messages from callback */}
      {successParam === "true" && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Stripe is succesvol gekoppeld!
          </AlertDescription>
        </Alert>
      )}
      {errorParam && (
        <Alert className="border-destructive/20 bg-destructive/5 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{decodeURIComponent(errorParam)}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Stripe Account
                {isReady ? (
                  <Badge className="bg-green-600">Actief</Badge>
                ) : stripeAccountId ? (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Onvolledig
                  </Badge>
                ) : (
                  <Badge variant="secondary">Niet gekoppeld</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isReady
                  ? "Je Stripe-account is gekoppeld en klaar om betalingen te ontvangen."
                  : stripeAccountId
                    ? "Je Stripe-account is gekoppeld maar de onboarding is nog niet afgerond."
                    : "Koppel je Stripe-account om betalingen te ontvangen van gasten."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stripeAccountId && (
            <div className="rounded-md bg-muted p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Account ID:</span>{" "}
                <code className="text-xs">{stripeAccountId}</code>
              </p>
              {statusInfo && (
                <>
                  <p>
                    <span className="text-muted-foreground">Betalingen:</span>{" "}
                    {statusInfo.chargesEnabled ? "✅ Ingeschakeld" : "❌ Uitgeschakeld"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Uitbetalingen:</span>{" "}
                    {statusInfo.payoutsEnabled ? "✅ Ingeschakeld" : "❌ Uitgeschakeld"}
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!stripeAccountId ? (
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="mr-2 h-4 w-4" />
                )}
                Stripe koppelen
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Status vernieuwen
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Stripe Dashboard
                  </a>
                </Button>
                {!isReady && (
                  <Button onClick={handleConnect} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LinkIcon className="mr-2 h-4 w-4" />
                    )}
                    Opnieuw koppelen
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
