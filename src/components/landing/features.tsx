import { Gift, Share2, LayoutDashboard, ShieldCheck, CreditCard, Eye } from "lucide-react"

const features = [
  {
    icon: Gift,
    title: "Persoonlijke cadeaulijst",
    description:
      "Voeg cadeaus toe die bij jullie passen: van huwelijksreis tot huishoudelijke apparaten. Met foto, beschrijving en doelbedrag.",
  },
  {
    icon: Share2,
    title: "Eenvoudig delen",
    description:
      "Krijg een eigen URL zoals weddinggiftlist.nl/jan-en-marie. Deel via WhatsApp, e-mail of jullie trouwkaart.",
  },
  {
    icon: CreditCard,
    title: "Betalen via iDEAL",
    description:
      "Gasten betalen veilig en vertrouwd via iDEAL. Het bedrag komt direct op jullie eigen rekening.",
  },
  {
    icon: Eye,
    title: "Live voortgang",
    description:
      "Zie in real-time hoeveel er al is bijgedragen per cadeau. Gasten zien de voortgangsbalk en weten wat nog nodig is.",
  },
  {
    icon: LayoutDashboard,
    title: "Overzichtelijk dashboard",
    description:
      "Beheer jullie lijst, bekijk alle bijdragen en lees de persoonlijke berichten van jullie gasten.",
  },
  {
    icon: ShieldCheck,
    title: "Veilig & betrouwbaar",
    description:
      "Betalingen via Stripe, HTTPS-beveiligd en AVG-compliant. Jullie bankgegevens zijn nooit zichtbaar voor gasten.",
  },
]

export function Features() {
  return (
    <section id="voordelen" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Voordelen
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Alles wat jullie nodig hebben voor de perfecte cadeaulijst
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Van het aanmaken tot het ontvangen van bijdragen: wij regelen het
            zodat jullie kunnen focussen op de bruiloft.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md hover:shadow-foreground/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
