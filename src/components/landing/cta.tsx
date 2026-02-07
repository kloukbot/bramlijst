import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section id="start" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center md:px-16 md:py-20">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(152_33%_32%/0.6),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(38_55%_50%/0.08),transparent_50%)]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
              Maak vandaag nog jullie bruiloft cadeaulijst
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-primary-foreground/80">
              Begin direct met een persoonlijke lijst en laat gasten bijdragen
              aan wat jullie echt willen.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
              >
                <Link href="/register" className="gap-2">
                  Gratis lijst aanmaken
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/marvintest1-15e49d">Bekijk voorbeeld</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
