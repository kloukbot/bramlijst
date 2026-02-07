"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("password");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login - in production this would use Supabase auth
    setTimeout(() => {
      // Store mock session
      localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }));
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

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === "email" ? "Inloggen" : "Vul je wachtwoord in"}
            </CardTitle>
            <CardDescription>
              om door te gaan naar Bramlijst
            </CardDescription>
            {step === "password" && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">{email}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep("email")}
                >
                  Wijzig
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jouw@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
                  Doorgaan
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Link href="#" className="text-sm text-amber-700 hover:underline">
                      Wachtwoord vergeten?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  disabled={loading}
                >
                  {loading ? "Inloggen..." : "Doorgaan"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Geen account? </span>
              <Link href="/start" className="text-amber-700 hover:underline">
                Registreren
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
