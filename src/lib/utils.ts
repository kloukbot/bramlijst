import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format cents to euro display string */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

/** Convert euro string/number to cents */
export function euroToCents(euros: number): number {
  return Math.round(euros * 100)
}

/** Convert cents to euros */
export function centsToEuro(cents: number): number {
  return cents / 100
}

/** Sanitize user input against XSS — strips HTML tags and trims */
export function sanitize(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
}

/** Calculate progress percentage */
export function progressPercent(collected: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(Math.round((collected / target) * 100), 100)
}
