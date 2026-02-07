/** Reserved slugs that cannot be used by users */
export const RESERVED_SLUGS = [
  "dashboard",
  "api",
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "admin",
  "settings",
  "privacy",
  "voorwaarden",
  "contact",
] as const

/** Slug format: lowercase letters, numbers, hyphens. Min 3, max 50 chars */
export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
export const SLUG_MIN_LENGTH = 3
export const SLUG_MAX_LENGTH = 50

/** Currency */
export const DEFAULT_CURRENCY = "eur"
export const DEFAULT_LOCALE = "nl"

/** Amounts in cents */
export const MIN_CONTRIBUTION_CENTS = 500 // €5.00
export const MIN_GIFT_AMOUNT_CENTS = 100 // €1.00

/** Image upload */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
