"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "cookie-consent-accepted"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="mx-auto max-w-lg rounded-xl border bg-background/95 backdrop-blur-sm shadow-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Deze website gebruikt alleen essentiële cookies voor het functioneren
          van de site. Geen tracking of marketing cookies.
        </p>
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "true")
            setVisible(false)
          }}
        >
          Akkoord
        </Button>
      </div>
    </div>
  )
}
