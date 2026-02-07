import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacybeleid — Wedding Gift List",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>
      <p className="text-muted-foreground mb-6">
        Laatst bijgewerkt: februari 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">1. Wie zijn wij?</h2>
          <p>
            Wedding Gift List is een online platform waarmee koppels een
            cadeaulijst kunnen maken voor hun bruiloft. Gasten kunnen via het
            platform bijdragen aan cadeaus.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            2. Welke gegevens verzamelen wij?
          </h2>
          <p>Wij verzamelen de volgende persoonsgegevens:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Koppels (accounthouders):</strong> e-mailadres, namen van
              partners, trouwdatum, profielfoto&apos;s.
            </li>
            <li>
              <strong>Gasten (bijdragers):</strong> naam, optioneel e-mailadres,
              persoonlijke berichten, bijdragebedragen.
            </li>
            <li>
              <strong>Betalingsgegevens:</strong> worden verwerkt door Stripe en
              worden niet door ons opgeslagen.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            3. Waarvoor gebruiken wij uw gegevens?
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Het aanmaken en beheren van uw cadeaulijst</li>
            <li>Het verwerken van bijdragen en betalingen</li>
            <li>Het versturen van bevestigingsmails en bedankberichten</li>
            <li>Het verbeteren van onze dienstverlening</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            4. Rechtsgrondslag
          </h2>
          <p>
            Wij verwerken uw persoonsgegevens op basis van:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Uitvoering van een overeenkomst:</strong> noodzakelijk om
              onze dienst te leveren.
            </li>
            <li>
              <strong>Toestemming:</strong> voor het versturen van optionele
              e-mailmeldingen.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            5. Hoe lang bewaren wij uw gegevens?
          </h2>
          <p>
            Accountgegevens worden bewaard zolang u een actief account heeft.
            Bijdragegegevens worden bewaard voor boekhouddoeleinden (maximaal 7
            jaar na de transactie). U kunt op elk moment verzoeken om verwijdering
            van uw account en gegevens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            6. Delen met derden
          </h2>
          <p>
            Wij delen uw gegevens alleen met:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Stripe:</strong> voor betalingsverwerking (eigen
              privacybeleid van toepassing).
            </li>
            <li>
              <strong>Supabase:</strong> voor veilige gegevensopslag (EU-servers).
            </li>
          </ul>
          <p>
            Wij verkopen uw gegevens niet aan derden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">7. Uw rechten</h2>
          <p>
            Op grond van de AVG/GDPR heeft u het recht op:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Inzage in uw persoonsgegevens</li>
            <li>Rectificatie van onjuiste gegevens</li>
            <li>Verwijdering van uw gegevens</li>
            <li>Beperking van de verwerking</li>
            <li>Overdraagbaarheid van uw gegevens</li>
            <li>Bezwaar tegen de verwerking</li>
          </ul>
          <p>
            Neem voor verzoeken contact met ons op via het e-mailadres in uw
            accountinstellingen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">8. Cookies</h2>
          <p>
            Wij gebruiken uitsluitend essentiële cookies die noodzakelijk zijn
            voor het functioneren van de website (authenticatie). Wij gebruiken
            geen tracking- of marketingcookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">
            9. Beveiliging
          </h2>
          <p>
            Wij nemen passende technische en organisatorische maatregelen om uw
            persoonsgegevens te beschermen tegen onbevoegde toegang, verlies of
            misbruik.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact</h2>
          <p>
            Voor vragen over dit privacybeleid kunt u contact opnemen via uw
            accountinstellingen of door een e-mail te sturen naar het
            ondersteuningsteam.
          </p>
        </section>
      </div>
    </div>
  )
}
