import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Hoe werkt Wedding Gift List?",
    answer:
      "Wedding Gift List is een online platform waar jullie eenvoudig een bruiloft cadeaulijst maken. Jullie voegen cadeaus of wensen toe, krijgen een persoonlijke link (bijvoorbeeld weddinggiftlist.nl/jullie-naam) en delen die met jullie gasten. Zij kunnen online bijdragen via iDEAL en een persoonlijk berichtje achterlaten. Alles komt overzichtelijk in jullie dashboard te staan.",
  },
  {
    question: "Wat kost het om een lijst aan te maken?",
    answer:
      "Een account aanmaken en jullie lijst samenstellen is gratis. We rekenen eenmalig een klein bedrag dat automatisch wordt verrekend met het totaal dat jullie ophalen. Gasten betalen daarnaast een kleine administratiekost per bijdrage. Zo houden we het veilig, overzichtelijk en zonder verrassingen.",
  },
  {
    question: "Hoe ontvangen wij het geld?",
    answer:
      "Alle bijdragen worden via Stripe Connect direct op jullie eigen bankrekening gestort. Er is geen tussenrekening. In jullie dashboard zien jullie precies wie wat heeft bijgedragen, inclusief de persoonlijke berichtjes.",
  },
  {
    question: "Is het veilig?",
    answer:
      "Absoluut. Alle betalingen verlopen via Stripe, een wereldwijd erkende betaalprovider. De verbinding is HTTPS-beveiligd en we zijn AVG-compliant. Jullie bankgegevens zijn nooit zichtbaar voor gasten.",
  },
  {
    question: "Kunnen gasten ook een deelbedrag bijdragen?",
    answer:
      "Ja! Meerdere gasten kunnen bijdragen aan hetzelfde cadeau. De voortgangsbalk laat zien hoeveel er al is opgehaald. Zodra het doelbedrag bereikt is, wordt het cadeau automatisch als voltooid gemarkeerd.",
  },
  {
    question: "Moeten gasten een account aanmaken?",
    answer:
      "Nee, gasten hoeven geen account aan te maken. Ze kunnen direct bijdragen door een bedrag te kiezen, hun naam en een optioneel berichtje in te vullen, en te betalen via iDEAL.",
  },
  {
    question: "Hoe lang blijft onze lijst online?",
    answer:
      "Jullie lijst blijft beschikbaar zolang jullie willen. Na de bruiloft kunnen jullie het overzicht rustig bekijken, alle berichtjes lezen en de lijst vervolgens afsluiten wanneer het jullie uitkomt.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Veelgestelde vragen
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Antwoorden op jullie vragen
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Alles wat jullie willen weten over Wedding Gift List.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
