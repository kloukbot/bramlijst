"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold">Er ging iets mis</h1>
        <p className="text-muted-foreground">
          Sorry, er is een onverwachte fout opgetreden. Probeer het opnieuw of
          vernieuw de pagina.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset}>Opnieuw proberen</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Naar homepagina
          </Button>
        </div>
      </div>
    </div>
  )
}
