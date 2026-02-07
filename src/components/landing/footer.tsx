import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-foreground">
                Wedding Gift List
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              De moderne cadeaulijst voor jullie bruiloft. Persoonlijk,
              overzichtelijk en veilig.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#hoe-het-werkt"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Hoe het werkt
                </Link>
              </li>
              <li>
                <Link
                  href="#voordelen"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Voordelen
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link
                  href="#voorbeeld"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Voorbeeldlijst
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Juridisch</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link
                  href="/voorwaarden"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Algemene voorwaarden
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {"© 2026 Wedding Gift List. Alle rechten voorbehouden."}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Betalingen via
            </span>
            <div className="flex items-center gap-2">
              <div className="rounded bg-foreground/5 px-2 py-1 text-xs font-medium text-muted-foreground">
                Stripe
              </div>
              <div className="rounded bg-foreground/5 px-2 py-1 text-xs font-medium text-muted-foreground">
                iDEAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
