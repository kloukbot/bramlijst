import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-amber-900">
          Bramlijst
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/lijst/bram-en-frank" className="text-amber-800 hover:text-amber-600">
            Voorbeeldlijst
          </Link>
          <Link href="/login">
            <Button variant="ghost">Inloggen</Button>
          </Link>
          <Link href="/start">
            <Button className="bg-amber-700 hover:bg-amber-800">Begin nu</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-700 mb-4">Voor bruidsparen</p>
          <h1 className="text-5xl font-serif text-amber-900 mb-6">
            Maak samen jullie bruiloft cadeaulijst
          </h1>
          <p className="text-xl text-amber-800 mb-8">
            Jullie trouwdag, jullie wensen. Met een online bruiloft cadeaulijst 
            geven gasten precies wat bij jullie past: een reis, een nieuw avontuur 
            of gewoon een mooi begin samen.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/start">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
                Begin nu
              </Button>
            </Link>
            <Link href="/lijst/bram-en-frank">
              <Button size="lg" variant="outline" className="border-amber-700 text-amber-700">
                Bekijk voorbeeldlijst →
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Een cadeaulijst die bij jullie past
            </h3>
            <p className="text-amber-700">
              Maak snel een persoonlijke bruiloft cadeaulijst, helemaal afgestemd op jullie wensen.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Deel eenvoudig jullie lijst
            </h3>
            <p className="text-amber-700">
              Deel jullie cadeaulijst en laat gasten bijdragen aan wat jullie echt willen.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Alles in één overzicht
            </h3>
            <p className="text-amber-700">
              Zie alle bijdragen mét lieve berichtjes in jullie dashboard en laat het bedrag uitbetalen.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-32 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Wat kost Bramlijst?</h2>
          <p className="text-amber-700 mb-8">
            Een account en lijst aanmaken is gratis. Bramlijst kost eenmalig €49,95. 
            Dit bedrag wordt automatisch verrekend met het totaal dat jullie ophalen. 
            Gasten betalen daarnaast €0,95 administratiekosten per bijdrage.
          </p>
          <Link href="/start">
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
              Gratis account aanmaken
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-amber-100">
        <div className="flex justify-between items-center text-amber-600 text-sm">
          <p>© 2026 Bramlijst Clone. Demo project.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-amber-800">Algemene voorwaarden</Link>
            <Link href="#" className="hover:text-amber-800">Privacybeleid</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
