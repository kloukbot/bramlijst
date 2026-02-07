import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const included = [
  "Onbeperkt cadeaus toevoegen",
  "Persoonlijke URL",
  "iDEAL-betalingen via Stripe",
  "Overzichtelijk dashboard",
  "Persoonlijke berichten van gasten",
  "Foto-uploads per cadeau",
  "Direct uitbetaald op jullie rekening",
  "Mobiel-vriendelijk design",
]

export function Pricing() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Tarieven
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Eenvoudig en transparant
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Geen verrassingen. Geen maandelijkse kosten. Eenmalig en klaar.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Compleet pakket
              </p>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="font-serif text-5xl font-semibold tracking-tight text-foreground">
                  {"€49"}
                </span>
                <span className="text-sm text-muted-foreground">,95</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Eenmalig, wordt verrekend met jullie opbrengst
              </p>
            </div>

            <div className="my-8 h-px bg-border" />

            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button className="mt-8 w-full" size="lg" asChild>
              <Link href="/register">Lijst aanmaken</Link>
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {"Gasten betalen € 0,95 administratiekosten per bijdrage"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
