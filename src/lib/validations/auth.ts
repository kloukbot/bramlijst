import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Wachtwoord moet minimaal 8 karakters bevatten")
  .regex(/[A-Z]/, "Wachtwoord moet minimaal 1 hoofdletter bevatten")
  .regex(/[0-9]/, "Wachtwoord moet minimaal 1 cijfer bevatten")
  .regex(
    /[^A-Za-z0-9]/,
    "Wachtwoord moet minimaal 1 speciaal teken bevatten"
  )

export const loginSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  password: z.string().min(1, "Wachtwoord is verplicht"),
})

export const registerSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  password: passwordSchema,
  partnerName1: z
    .string()
    .min(1, "Naam partner 1 is verplicht")
    .max(100, "Naam is te lang"),
  partnerName2: z
    .string()
    .min(1, "Naam partner 2 is verplicht")
    .max(100, "Naam is te lang"),
  weddingDate: z.string().min(1, "Trouwdatum is verplicht"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
