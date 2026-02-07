import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function StripeNotConnected() {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle>Betalingen nog niet beschikbaar</AlertTitle>
      <AlertDescription>
        Het bruidspaar heeft betalingen nog niet ingesteld. Je kunt de cadeaulijst
        bekijken, maar nog niet bijdragen.
      </AlertDescription>
    </Alert>
  )
}
