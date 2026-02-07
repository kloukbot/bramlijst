import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"

import "./globals.css"
import { CookieConsent } from "@/components/cookie-consent"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Wedding Gift List — De moderne cadeaulijst voor jullie bruiloft",
  description:
    "Maak een persoonlijke online cadeaulijst voor jullie bruiloft. Gasten dragen eenvoudig bij via iDEAL. Veilig, overzichtelijk en snel geregeld.",
  keywords: [
    "cadeaulijst",
    "bruiloft",
    "trouwen",
    "cadeau",
    "huwelijk",
    "iDEAL",
    "gift list",
  ],
  openGraph: {
    title: "Wedding Gift List — De moderne cadeaulijst voor jullie bruiloft",
    description:
      "Maak een persoonlijke online cadeaulijst voor jullie bruiloft. Gasten dragen eenvoudig bij via iDEAL.",
    type: "website",
    locale: "nl_NL",
    siteName: "Wedding Gift List",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b6b4f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
