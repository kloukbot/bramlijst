"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "names" | "settings";

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("names");
  const [loading, setLoading] = useState(false);
  
  const [coupleNames, setCoupleNames] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [description, setDescription] = useState("Leuk dat je naar onze lijst kijkt!");
  const [slug, setSlug] = useState("");

  const handleNamesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate slug from names
    const generatedSlug = coupleNames
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(generatedSlug);
    setStep("settings");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock creation - in production this would create in Supabase
    const listData = {
      couple_names: coupleNames,
      wedding_date: weddingDate,
      description,
      slug,
      is_published: false,
    };
    
    localStorage.setItem("currentList", JSON.stringify(listData));
    localStorage.setItem("user", JSON.stringify({ email: "demo@felicio.nl", name: coupleNames }));

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="text-2xl font-serif text-amber-900">
          Bramlijst
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {step === "names" ? (
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Maak je eerste cadeaulijst</CardTitle>
              <CardDescription>
                Binnen 30 seconden klaar — je kunt alles later nog aanpassen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNamesSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="names">Namen van het stel</Label>
                  <Input
                    id="names"
                    placeholder="bijv. Jan en Marie"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Datum van de bruiloft</Label>
                  <Input
                    id="date"
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  Maak mijn lijst
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Door verder te gaan, ga je akkoord met onze voorwaarden.
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Stel je lijst in</CardTitle>
              <CardDescription>
                Voeg een welkomsttekst toe, upload een foto en kies je link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Welkomsttekst / Over jullie (optioneel)</Label>
                  <Textarea
                    id="description"
                    placeholder="Vertel iets over jullie..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Coverafbeelding (optioneel)</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Liggend formaat, minimaal 1600px breed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Kies je link</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">felicio.nl/lijst/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1"
                      required
                    />
                  </div>
                  {slug && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span>✓</span> Beschikbaar
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep("names")}
                    className="flex-1"
                  >
                    Terug
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-amber-700 hover:bg-amber-800"
                    disabled={loading}
                  >
                    {loading ? "Aanmaken..." : "Naar cadeaus"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
