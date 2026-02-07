import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Algemene Voorwaarden — Wedding Gift List",
}

export default function VoorwaardenPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Algemene Voorwaarden</h1>
      <p className="text-muted-foreground mb-6">
        Laatst bijgewerkt: februari 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            1. Definities
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Platform:</strong> de website en dienst van Wedding Gift
              List.
            </li>
            <li>
              <strong>Gebruiker:</strong> een persoon die een account aanmaakt om
              een cadeaulijst te beheren.
            </li>
            <li>
              <strong>Gast:</strong> een persoon die bijdraagt aan een cadeau via
              het platform.
            </li>
            <li>
              <strong>Bijdrage:</strong> een financiële bijdrage van een gast aan
              een cadeau.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            2. Gebruik van het platform
          </h2>
          <p>
            Wedding Gift List biedt een platform waarop koppels een online
            cadeaulijst kunnen aanmaken. Gasten kunnen via het platform bijdragen
            aan cadeaus. Het platform faciliteert de betaling via Stripe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            3. Account en verantwoordelijkheid
          </h2>
          <p>
            U bent verantwoordelijk voor het geheim houden van uw
            inloggegevens. Alle activiteiten die via uw account plaatsvinden zijn
            uw verantwoordelijkheid. Meld ongeautoriseerd gebruik direct.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            4. Betalingen en uitbetalingen
          </h2>
          <p>
            Alle betalingen worden verwerkt via Stripe. Het platform is geen
            partij bij de betaling tussen gast en gebruiker. Uitbetalingen
            worden door Stripe rechtstreeks op het gekoppelde bankrekening van de
            gebruiker gestort, conform de voorwaarden van Stripe.
          </p>
          <p>
            Het platform brengt geen transactiekosten in rekening. Stripe-kosten
            zijn voor rekening van de gebruiker conform het Stripe-tariefplan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            5. Terugbetalingen
          </h2>
          <p>
            Verzoeken tot terugbetaling dienen rechtstreeks met het betreffende
            koppel te worden afgehandeld. Het platform kan, indien nodig,
            ondersteuning bieden bij het proces.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            6. Verboden gebruik
          </h2>
          <p>Het is niet toegestaan om het platform te gebruiken voor:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Frauduleuze of misleidende doeleinden</li>
            <li>Het witwassen van geld</li>
            <li>Het schenden van rechten van derden</li>
            <li>Het verspreiden van onrechtmatige of aanstootgevende inhoud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            7. Aansprakelijkheid
          </h2>
          <p>
            Het platform wordt aangeboden &quot;as is&quot;. Wij zijn niet
            aansprakelijk voor directe of indirecte schade voortkomend uit het
            gebruik van het platform, tenzij er sprake is van opzet of grove
            nalatigheid.
          </p>
          <p>
            Wij garanderen geen ononderbroken beschikbaarheid van het platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            8. Intellectueel eigendom
          </h2>
          <p>
            Alle rechten op het platform, inclusief maar niet beperkt tot
            ontwerp, code en inhoud, berusten bij Wedding Gift List. Door het
            uploaden van afbeeldingen verleent u ons een beperkte licentie om
            deze te tonen op het platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            9. Beëindiging
          </h2>
          <p>
            U kunt uw account op elk moment verwijderen. Wij behouden het recht
            om accounts te beëindigen bij schending van deze voorwaarden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            10. Toepasselijk recht
          </h2>
          <p>
            Op deze voorwaarden is Nederlands recht van toepassing. Geschillen
            worden voorgelegd aan de bevoegde rechter in Nederland.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            11. Wijzigingen
          </h2>
          <p>
            Wij behouden het recht om deze voorwaarden te wijzigen. Wijzigingen
            worden op het platform gepubliceerd. Voortgezet gebruik na
            wijziging geldt als acceptatie.
          </p>
        </section>
      </div>
    </div>
  )
}
