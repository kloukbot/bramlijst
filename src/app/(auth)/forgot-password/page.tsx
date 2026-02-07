"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Mail } from "lucide-react"
import { forgotPassword } from "@/actions/auth"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    if (!email) {
      setError("Vul een e-mailadres in")
      setIsLoading(false)
      return
    }

    const result = await forgotPassword(email)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  return (
    <>
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar inloggen
      </Link>

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
          Wachtwoord vergeten
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vul jullie e-mailadres in en we sturen een link om het wachtwoord te resetten.
        </p>
      </div>

      {success ? (
        <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
          Als dit e-mailadres bij ons bekend is, ontvangen jullie binnen enkele minuten een e-mail met een resetlink.
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jullie@email.nl"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? "Even geduld..." : "Resetlink versturen"}
            </Button>
          </form>
        </>
      )}
    </>
  )
}
