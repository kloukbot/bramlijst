import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Heart, CreditCard } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_33%_26%/0.05),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-28 md:pt-24 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              Nu beschikbaar voor bruidsparen in Nederland
            </div>

            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              De cadeaulijst die bij jullie{" "}
              <span className="text-primary">bruiloft</span> past
            </h1>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Maak een persoonlijke online cadeaulijst en laat gasten bijdragen
              aan wat jullie echt willen. Veilig via iDEAL, direct op jullie
              rekening.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="#start" className="gap-2">
                  Gratis lijst aanmaken
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#voorbeeld">Bekijk voorbeeld</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Veilig betalen</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Direct via iDEAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>500+ bruidsparen</span>
              </div>
            </div>
          </div>

          {/* Right: Preview card */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-lg shadow-foreground/5 md:p-8">
              {/* Mini gift list preview */}
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary" />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    Emma & Luuk
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trouwen op 15 augustus 2026
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Wat fijn dat je een kijkje neemt op onze cadeaulijst! We kijken
                uit naar onze grote dag en waarderen elke bijdrage enorm.
              </p>

              {/* Mini gift cards */}
              <div className="space-y-3">
                <GiftPreviewCard
                  title="Huwelijksreis Bali"
                  target={3500}
                  collected={2100}
                />
                <GiftPreviewCard
                  title="KitchenAid mixer"
                  target={450}
                  collected={450}
                  completed
                />
                <GiftPreviewCard
                  title="Diner bij Ron Gastrobar"
                  target={250}
                  collected={75}
                />
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/5" />
          </div>
        </div>
      </div>
    </section>
  )
}

function GiftPreviewCard({
  title,
  target,
  collected,
  completed = false,
}: {
  title: string
  target: number
  collected: number
  completed?: boolean
}) {
  const percentage = Math.min(100, Math.round((collected / target) * 100))

  return (
    <div
      className={`rounded-xl border border-border p-4 transition-colors ${
        completed ? "bg-secondary/50 opacity-70" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-sm font-medium ${
            completed
              ? "text-muted-foreground line-through"
              : "text-card-foreground"
          }`}
        >
          {title}
        </p>
        {completed && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Voltooid
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all ${
              completed ? "bg-primary/40" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
          }).format(collected)}{" "}
          / {new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
          }).format(target)}
        </span>
      </div>
    </div>
  )
}
