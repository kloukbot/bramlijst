import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, BarChart3, Link2 } from "lucide-react"

export function Preview() {
  return (
    <section id="voorbeeld" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Voorbeeld
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Zo ziet jullie cadeaulijst eruit
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Persoonlijk, overzichtelijk en altijd makkelijk te delen met jullie
            gasten.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Feature highlight 1 */}
          <div className="flex flex-col rounded-xl border border-border bg-background p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              Eigen touch
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {"Voeg foto's en teksten toe zoals jullie willen. Kies een welkomsttekst, upload een profielfoto en maak de lijst helemaal jullie eigen."}
            </p>
            {/* Mini preview */}
            <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/15" />
                <div>
                  <div className="h-3 w-24 rounded bg-foreground/10" />
                  <div className="mt-1.5 h-2 w-32 rounded bg-foreground/5" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded bg-foreground/5" />
                <div className="h-2 w-4/5 rounded bg-foreground/5" />
              </div>
            </div>
          </div>

          {/* Feature highlight 2 */}
          <div className="flex flex-col rounded-xl border border-border bg-background p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              Overzichtelijk dashboard
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Bekijk na jullie bruiloft wie wat heeft gegeven en lees de
              persoonlijke berichtjes. Alles netjes op een rij.
            </p>
            {/* Mini dashboard preview */}
            <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-card p-3">
                  <div className="text-xs text-muted-foreground">Totaal</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {"€ 2.450"}
                  </div>
                </div>
                <div className="rounded-md bg-card p-3">
                  <div className="text-xs text-muted-foreground">Bijdragen</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    18
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Oma & Opa</span>
                  <span className="font-medium text-foreground">{"€ 150"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Familie de Vries</span>
                  <span className="font-medium text-foreground">{"€ 100"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlight 3 */}
          <div className="flex flex-col rounded-xl border border-border bg-background p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Link2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              Makkelijk delen
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Kies zelf een persoonlijke link en deel die met al jullie gasten.
              Via WhatsApp, e-mail of op jullie trouwkaart.
            </p>
            {/* Mini URL preview */}
            <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 rounded-md bg-card px-3 py-2">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  weddinggiftlist.nl/
                </span>
                <span className="text-xs font-medium text-primary">
                  emma-en-luuk
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 rounded-md bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
                  WhatsApp
                </div>
                <div className="flex-1 rounded-md bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
                  E-mail
                </div>
                <div className="flex-1 rounded-md bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
                  Kopieer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/marvintest1-15e49d" className="gap-2">
              Bekijk een voorbeeldlijst
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
