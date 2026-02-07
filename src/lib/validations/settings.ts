import { z } from "zod"
import { SLUG_REGEX, SLUG_MIN_LENGTH, SLUG_MAX_LENGTH, RESERVED_SLUGS } from "@/lib/constants"

export const updateProfileSchema = z.object({
  partnerName1: z
    .string()
    .min(1, "Naam partner 1 is verplicht")
    .max(100, "Naam is te lang"),
  partnerName2: z
    .string()
    .min(1, "Naam partner 2 is verplicht")
    .max(100, "Naam is te lang"),
  slug: z
    .string()
    .min(SLUG_MIN_LENGTH, `Slug moet minimaal ${SLUG_MIN_LENGTH} tekens zijn`)
    .max(SLUG_MAX_LENGTH, `Slug mag maximaal ${SLUG_MAX_LENGTH} tekens zijn`)
    .regex(SLUG_REGEX, "Slug mag alleen kleine letters, cijfers en koppeltekens bevatten")
    .refine(
      (val) => !RESERVED_SLUGS.includes(val as (typeof RESERVED_SLUGS)[number]),
      "Deze URL is gereserveerd"
    ),
  weddingDate: z.string().optional(),
  welcomeMessage: z.string().max(2000, "Welkomstbericht is te lang").optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
