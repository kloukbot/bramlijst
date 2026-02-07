"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[DashboardError]", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold">Er ging iets mis</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Er is een fout opgetreden bij het laden van deze pagina. Probeer het
        opnieuw.
      </p>
      <Button onClick={reset}>Opnieuw proberen</Button>
    </div>
  )
}
