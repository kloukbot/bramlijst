"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { LoginInput, RegisterInput } from "@/lib/validations/auth"
import type { ActionResult } from "@/types"
import { sendEmail } from "@/lib/email"
import { welcomeEmailTemplate } from "@/lib/email-templates"

export async function login(
  data: LoginInput
): Promise<ActionResult | undefined> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Onjuist e-mailadres of wachtwoord" }
    }
    if (error.message === "Email not confirmed") {
      return { error: "Bevestig eerst jullie e-mailadres via de link in de e-mail" }
    }
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function register(
  data: RegisterInput
): Promise<ActionResult | undefined> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        partner_name_1: data.partnerName1,
        partner_name_2: data.partnerName2,
        wedding_date: data.weddingDate,
      },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Dit e-mailadres is al geregistreerd" }
    }
    return { error: error.message }
  }

  // Send welcome email (non-blocking, don't fail registration if email fails)
  try {
    const slug = `${(data.partnerName1 || "").toLowerCase()}-en-${(data.partnerName2 || "").toLowerCase()}`.replace(/\s+/g, "-")
    const { subject, html } = welcomeEmailTemplate(
      data.partnerName1,
      data.partnerName2,
      slug
    )
    sendEmail({ to: data.email, subject, html }).catch(() => {})
  } catch {
    // Silently ignore email errors
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function forgotPassword(
  email: string
): Promise<ActionResult | undefined> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPassword(
  newPassword: string
): Promise<ActionResult | undefined> {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
