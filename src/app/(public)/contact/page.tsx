import { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact met ons op",
}

export default function ContactPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          Heb je een vraag, opmerking of probleem? Stuur ons gerust een e-mail
          en we reageren zo snel mogelijk.
        </p>
        <a
          href="mailto:info@weddinggiftlist.nl"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <Mail className="h-4 w-4" />
          info@weddinggiftlist.nl
        </a>
      </div>
    </main>
  )
}
