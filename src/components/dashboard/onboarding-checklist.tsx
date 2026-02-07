"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Check, Circle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type OnboardingChecklistProps = {
  hasProfile: boolean
  hasStripe: boolean
  hasGifts: boolean
  hasWelcomeMessage: boolean
  isPublished: boolean
}

type Step = {
  label: string
  done: boolean
  href: string
  cta: string
}

export function OnboardingChecklist({
  hasProfile,
  hasStripe,
  hasGifts,
  hasWelcomeMessage,
  isPublished,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true) // default hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem("onboarding-dismissed") === "true")
  }, [])

  const steps: Step[] = [
    { label: "Profiel ingevuld", done: hasProfile, href: "/dashboard/settings", cta: "Naar profiel" },
    { label: "Stripe gekoppeld", done: hasStripe, href: "/dashboard/settings", cta: "Stripe koppelen" },
    { label: "Eerste cadeau toegevoegd", done: hasGifts, href: "/dashboard/gifts/new", cta: "Cadeau toevoegen" },
    { label: "Welkomstbericht geschreven", done: hasWelcomeMessage, href: "/dashboard/settings", cta: "Bericht schrijven" },
    { label: "Lijst gepubliceerd & gedeeld", done: isPublished, href: "/dashboard/settings", cta: "Publiceren" },
  ]

  const completed = steps.filter((s) => s.done).length
  const allDone = completed === steps.length

  if (dismissed || allDone) return null

  function handleDismiss() {
    localStorage.setItem("onboarding-dismissed", "true")
    setDismissed(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Aan de slag! 🚀</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {completed} van {steps.length} stappen voltooid
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
          <X className="h-4 w-4" />
          <span className="sr-only">Sluiten</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={(completed / steps.length) * 100} className="h-2" />
        <ul className="space-y-2">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {step.done ? (
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}
                <span className={step.done ? "text-sm text-muted-foreground line-through" : "text-sm"}>
                  {step.label}
                </span>
              </div>
              {!step.done && (
                <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" asChild>
                  <Link href={step.href}>
                    {step.cta} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
