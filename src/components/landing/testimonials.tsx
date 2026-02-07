import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Erg makkelijk om een lijst aan te maken en precies wat we zochten. Gasten vonden het ook heel fijn om via iDEAL te betalen.",
    names: "Sanne & Daan",
    detail: "Getrouwd in juni 2025",
  },
  {
    quote:
      "Ontzettend blij dat we al het ontvangen geld aan de huwelijksreis konden besteden. Het was ook erg leuk om achteraf de berichtjes te lezen!",
    names: "Marit & Thijs",
    detail: "Getrouwd in september 2025",
  },
  {
    quote:
      "Geen gedoe met dubbele cadeaus meer. Onze gasten konden precies bijdragen aan wat wij wilden. Heel fijn geregeld.",
    names: "Mila & Tom",
    detail: "Getrouwd in mei 2025",
  },
]

export function Testimonials() {
  return (
    <section id="ervaringen" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Ervaringen
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Wat bruidsparen zeggen
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Echte verhalen van koppels die Wedding Gift List gebruikten voor hun
            cadeaulijst.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.names}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`star-${t.names}-${i}`}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                {`"${t.quote}"`}
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.names.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.names}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
