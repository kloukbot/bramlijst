"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/types"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/settings"
import { sanitize } from "@/lib/utils"
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from "@/lib/constants"

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return { supabase, user }
}

export async function updateProfile(data: UpdateProfileInput): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { partnerName1, partnerName2, slug, weddingDate, welcomeMessage, theme } = parsed.data

  // Check slug uniqueness (exclude own profile)
  const { data: existing } = await auth.supabase
    .from("profiles")
    .select("id")
    .eq("slug", slug)
    .neq("id", auth.user.id)
    .maybeSingle()

  if (existing) {
    return { error: "Deze URL is al in gebruik. Kies een andere." }
  }

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      partner_name_1: sanitize(partnerName1),
      partner_name_2: sanitize(partnerName2),
      display_name: `${sanitize(partnerName1)} & ${sanitize(partnerName2)}`,
      slug,
      wedding_date: weddingDate || null,
      welcome_message: welcomeMessage ? sanitize(welcomeMessage) : null,
      ...(theme ? { theme } : {}),
    })
    .eq("id", auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard")
  return { success: true }
}

async function uploadImage(
  formData: FormData,
  bucket: string,
  folder: string
): Promise<ActionResult & { url?: string; auth?: { user: { id: string }; supabase: any } }> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const file = formData.get("file") as File | null
  if (!file) return { error: "Geen bestand geselecteerd" }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Bestand is te groot (max 5MB)" }
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Alleen JPG, PNG of WebP bestanden zijn toegestaan" }
  }

  const ext = file.name.split(".").pop() || "jpg"
  const path = `${auth.user.id}/${folder}-${Date.now()}.${ext}`

  const { error: uploadError } = await auth.supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = auth.supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return { success: true, url: publicUrl, auth }
}

export async function uploadCoverImage(formData: FormData): Promise<ActionResult> {
  const result = await uploadImage(formData, "profile-images", "cover")
  if (result.error || !result.auth) return { error: result.error ?? "Niet ingelogd" }

  const { error } = await result.auth.supabase
    .from("profiles")
    .update({ cover_image_url: result.url })
    .eq("id", result.auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function uploadAvatar(formData: FormData): Promise<ActionResult> {
  const result = await uploadImage(formData, "profile-images", "avatar")
  if (result.error || !result.auth) return { error: result.error ?? "Niet ingelogd" }

    const { error } = await result.auth.supabase
    .from("profiles")
    .update({ avatar_url: result.url })
    .eq("id", result.auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function togglePublished(): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("is_published")
    .eq("id", auth.user.id)
    .single()

  if (!profile) return { error: "Profiel niet gevonden" }

  const { error } = await auth.supabase
    .from("profiles")
    .update({ is_published: !profile.is_published })
    .eq("id", auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard")
  return { success: true }
}
