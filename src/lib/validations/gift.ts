import { z } from "zod"

export const createGiftSchema = z.object({
  name: z
    .string()
    .min(1, "Naam is verplicht")
    .max(200, "Naam is te lang"),
  description: z
    .string()
    .max(2000, "Beschrijving is te lang")
    .optional(),
  targetAmount: z
    .number()
    .int("Bedrag moet een geheel getal zijn (in centen)")
    .positive("Doelbedrag moet positief zijn")
    .min(100, "Minimaal doelbedrag is €1,00"),
  allowPartial: z.boolean().default(true),
  minContribution: z
    .number()
    .int()
    .min(100, "Minimum bijdrage is €1,00")
    .default(500),
  isVisible: z.boolean().default(true),
})

export const updateGiftSchema = createGiftSchema.partial()

export type CreateGiftInput = z.infer<typeof createGiftSchema>
export type UpdateGiftInput = z.infer<typeof updateGiftSchema>
