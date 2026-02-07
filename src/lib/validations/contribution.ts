import { z } from "zod"

export const createContributionSchema = z.object({
  giftId: z.string().uuid("Ongeldig cadeau ID"),
  amount: z
    .number()
    .int("Bedrag moet een geheel getal zijn (in centen)")
    .positive("Bedrag moet positief zijn")
    .min(100, "Minimaal bedrag is €1,00"),
  guestName: z
    .string()
    .min(1, "Naam is verplicht")
    .max(200, "Naam is te lang"),
  guestEmail: z
    .string()
    .email("Ongeldig e-mailadres")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .max(1000, "Bericht is te lang")
    .optional(),
  slug: z.string().min(1, "Slug is verplicht"),
})

export type CreateContributionInput = z.infer<typeof createContributionSchema>
