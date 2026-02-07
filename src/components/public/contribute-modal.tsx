"use client"

import { useState } from "react"
import type { Gift } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCents, centsToEuro, euroToCents } from "@/lib/utils"
import { MIN_CONTRIBUTION_CENTS } from "@/lib/constants"

interface ContributeModalProps {
  gift: Gift | null
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
}

const SUGGESTION_EUROS = [25, 50, 100]

export function ContributeModal({
  gift,
  open,
  onOpenChange,
  slug,
}: ContributeModalProps) {
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [amountEuros, setAmountEuros] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Early return must be after all hooks
  const remaining = gift ? gift.target_amount - gift.collected_amount : 0
  const remainingEuros = centsToEuro(remaining)
  const minEuros = gift ? centsToEuro(Math.max(MIN_CONTRIBUTION_CENTS, gift.min_contribution)) : centsToEuro(MIN_CONTRIBUTION_CENTS)

  if (!gift) return null

  function validate(): boolean {
    if (!gift) return false
    const errs: Record<string, string> = {}
    if (!guestName.trim()) errs.guestName = "Naam is verplicht"
    if (guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      errs.guestEmail = "Ongeldig e-mailadres"
    }
    const euros = parseFloat(amountEuros)
    if (isNaN(euros) || euros <= 0) {
      errs.amount = "Vul een geldig bedrag in"
    } else if (euroToCents(euros) < Math.max(MIN_CONTRIBUTION_CENTS, gift.min_contribution)) {
      errs.amount = `Minimaal bedrag is ${formatCents(Math.max(MIN_CONTRIBUTION_CENTS, gift.min_contribution))}`
    } else if (euroToCents(euros) > remaining) {
      errs.amount = `Maximaal ${formatCents(remaining)} (resterend bedrag)`
    }
    if (message.length > 1000) errs.message = "Bericht is te lang (max 1000 tekens)"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !gift) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_id: gift.id,
          amount: euroToCents(parseFloat(amountEuros)),
          guest_name: guestName.trim(),
          guest_email: guestEmail.trim() || undefined,
          message: message.trim() || undefined,
          slug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || "Er ging iets mis. Probeer het opnieuw.")
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url
    } catch {
      setSubmitError("Er ging iets mis. Controleer je internetverbinding.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function selectSuggestion(euros: number) {
    const capped = Math.min(euros, remainingEuros)
    setAmountEuros(capped.toString())
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setGuestName("")
      setGuestEmail("")
      setAmountEuros("")
      setMessage("")
      setErrors({})
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[100dvh] overflow-y-auto sm:max-w-md max-sm:h-full max-sm:max-h-full max-sm:rounded-none max-sm:border-0">
        <DialogHeader>
          <DialogTitle>Bijdragen aan {gift.name}</DialogTitle>
          <DialogDescription>
            Nog {formatCents(remaining)} nodig van {formatCents(gift.target_amount)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest name */}
          <div className="space-y-1.5">
            <Label htmlFor="guestName">Je naam *</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Bijv. Jan & Petra"
            />
            {errors.guestName && (
              <p className="text-sm text-destructive">{errors.guestName}</p>
            )}
          </div>

          {/* Guest email */}
          <div className="space-y-1.5">
            <Label htmlFor="guestEmail">E-mailadres (optioneel)</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="jan@voorbeeld.nl"
            />
            {errors.guestEmail && (
              <p className="text-sm text-destructive">{errors.guestEmail}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Bedrag (€) *</Label>
            <div className="flex gap-2">
              {SUGGESTION_EUROS.map((euros) => (
                <Button
                  key={euros}
                  type="button"
                  variant={amountEuros === euros.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectSuggestion(euros)}
                  disabled={euroToCents(euros) > remaining && euros !== Math.min(euros, remainingEuros)}
                >
                  €{euros}
                </Button>
              ))}
            </div>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={minEuros}
              max={remainingEuros}
              value={amountEuros}
              onChange={(e) => setAmountEuros(e.target.value)}
              placeholder={`${minEuros} - ${remainingEuros}`}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message">Persoonlijk bericht (optioneel)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gefeliciteerd met jullie huwelijk!"
              rows={3}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-destructive text-center">{submitError}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Even geduld..." : "💳 Betalen via iDEAL"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
