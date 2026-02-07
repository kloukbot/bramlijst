import React from "react"
import { Heart } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative */}
      <div className="relative hidden flex-1 items-center justify-center bg-primary lg:flex">
        <div className="relative z-10 max-w-md px-12">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-primary-foreground">
            Maak samen jullie perfecte cadeaulijst
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/70">
            Deel jullie wensen met familie en vrienden. Veilig en eenvoudig — gasten dragen bij via iDEAL, direct op jullie rekening.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p className="text-2xl font-bold text-primary-foreground">500+</p>
              <p className="mt-1 text-xs text-primary-foreground/60">Bruidsparen</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">12k+</p>
              <p className="mt-1 text-xs text-primary-foreground/60">Bijdragen</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">98%</p>
              <p className="mt-1 text-xs text-primary-foreground/60">Tevreden</p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right side - Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
