"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react"
import { register } from "@/actions/auth"
import { registerSchema } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      partnerName1: formData.get("partner1") as string,
      partnerName2: formData.get("partner2") as string,
      weddingDate: formData.get("wedding-date") as string,
    }

    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ongeldige invoer")
      setIsLoading(false)
      return
    }

    const result = await register(parsed.data)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <>
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar home
        </Link>

        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Bevestig jullie e-mail
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We hebben een bevestigingslink gestuurd naar jullie e-mailadres.
            Klik op de link om jullie account te activeren.
          </p>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Terug naar inloggen</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar home
      </Link>

      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Wedding Gift List
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Maak jullie account aan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Begin vandaag nog met jullie cadeaulijst.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="partner1">Partner 1</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="partner1"
                name="partner1"
                placeholder="Voornaam"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partner2">Partner 2</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="partner2"
                name="partner2"
                placeholder="Voornaam"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="register-email">E-mailadres</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="jullie@email.nl"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="register-password">Wachtwoord</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 karakters"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimaal 8 karakters, 1 hoofdletter, 1 cijfer en 1 speciaal teken.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="wedding-date">Trouwdatum</Label>
          <Input
            id="wedding-date"
            name="wedding-date"
            type="date"
            required
          />
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Account aanmaken..." : "Account aanmaken"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Door je te registreren ga je akkoord met onze{" "}
          <Link href="/voorwaarden" className="text-primary hover:underline">
            algemene voorwaarden
          </Link>{" "}
          en{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            privacybeleid
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Al een account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Inloggen
        </Link>
      </p>
    </>
  )
}
