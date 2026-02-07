"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"
import { resetPassword } from "@/actions/auth"
import { passwordSchema } from "@/lib/validations/auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      setIsLoading(false)
      return
    }

    const parsed = passwordSchema.safeParse(password)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ongeldig wachtwoord")
      setIsLoading(false)
      return
    }

    const result = await resetPassword(password)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    router.push("/login?reset=success")
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
          Nieuw wachtwoord instellen
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kies een nieuw wachtwoord voor jullie account.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Nieuw wachtwoord</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
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
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimaal 8 karakters, 1 hoofdletter, 1 cijfer en 1 speciaal teken.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Bevestig wachtwoord</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Herhaal wachtwoord"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Even geduld..." : "Wachtwoord opslaan"}
        </Button>
      </form>
    </>
  )
}
