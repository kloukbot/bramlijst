import { UserPlus, ListPlus, Send, Banknote } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Maak een account",
    description:
      "Registreer met jullie e-mailadres en stel jullie profiel in. Koppel jullie bankrekening veilig via Stripe.",
  },
  {
    icon: ListPlus,
    step: "02",
    title: "Stel jullie lijst samen",
    description:
      "Voeg cadeaus en wensen toe met foto, beschrijving en doelbedrag. Maak de lijst helemaal persoonlijk.",
  },
  {
    icon: Send,
    step: "03",
    title: "Deel met jullie gasten",
    description:
      "Deel jullie persoonlijke link via de trouwkaart, WhatsApp of e-mail. Gasten hoeven geen account aan te maken.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Ontvang bijdragen",
    description:
      "Gasten dragen bij via iDEAL. Het bedrag komt direct op jullie rekening. Bekijk alle berichten in het dashboard.",
  },
]

export function HowItWorks() {
  return (
    <section id="hoe-het-werkt" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Hoe het werkt
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            In vier stappen klaar
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Van registratie tot het ontvangen van bijdragen: het is eenvoudiger
            dan jullie denken.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line on desktop */}
              {index < steps.length - 1 && (
                <div className="absolute left-full top-8 hidden h-px w-full bg-border lg:block" />
              )}

              <div className="flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
                  Stap {step.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
