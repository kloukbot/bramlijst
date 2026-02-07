"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/types"
import { createGiftSchema, updateGiftSchema, type CreateGiftInput, type UpdateGiftInput } from "@/lib/validations/gift"
import { sanitize } from "@/lib/utils"
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from "@/lib/constants"

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return { supabase, user }
}

export async function createGift(
  data: CreateGiftInput,
  imageFormData?: FormData
): Promise<ActionResult & { id?: string }> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const parsed = createGiftSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  let imageUrl: string | null = null

  if (imageFormData) {
    const file = imageFormData.get("file") as File | null
    if (file && file.size > 0) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) return { error: "Afbeelding is te groot (max 5MB)" }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "Alleen JPG, PNG of WebP" }

      const ext = file.name.split(".").pop() || "jpg"
      const path = `${auth.user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await auth.supabase.storage
        .from("gift-images")
        .upload(path, file, { upsert: true })

      if (uploadError) return { error: uploadError.message }

      const { data: { publicUrl } } = auth.supabase.storage
        .from("gift-images")
        .getPublicUrl(path)

      imageUrl = publicUrl
    }
  }

  // Get next sort_order
  const { data: lastGift } = await auth.supabase
    .from("gifts")
    .select("sort_order")
    .eq("user_id", auth.user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextSortOrder = (lastGift?.sort_order ?? -1) + 1

  const { data: gift, error } = await auth.supabase
    .from("gifts")
    .insert({
      user_id: auth.user.id,
      name: sanitize(parsed.data.name),
      description: parsed.data.description ? sanitize(parsed.data.description) : null,
      target_amount: parsed.data.targetAmount,
      allow_partial: parsed.data.allowPartial,
      min_contribution: parsed.data.minContribution,
      is_visible: parsed.data.isVisible,
      image_url: imageUrl,
      sort_order: nextSortOrder,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/dashboard/gifts")
  revalidatePath("/dashboard")
  return { success: true, id: gift.id }
}

export async function updateGift(
  giftId: string,
  data: UpdateGiftInput,
  imageFormData?: FormData
): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const parsed = updateGiftSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  // Build update object from only provided fields
  const updateData: Record<string, unknown> = {}
  if (parsed.data.name !== undefined) updateData.name = sanitize(parsed.data.name)
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description ? sanitize(parsed.data.description) : null
  if (parsed.data.targetAmount !== undefined) updateData.target_amount = parsed.data.targetAmount
  if (parsed.data.allowPartial !== undefined) updateData.allow_partial = parsed.data.allowPartial
  if (parsed.data.minContribution !== undefined) updateData.min_contribution = parsed.data.minContribution
  if (parsed.data.isVisible !== undefined) updateData.is_visible = parsed.data.isVisible

  // Handle image upload
  if (imageFormData) {
    const file = imageFormData.get("file") as File | null
    if (file && file.size > 0) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) return { error: "Afbeelding is te groot (max 5MB)" }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "Alleen JPG, PNG of WebP" }

      const ext = file.name.split(".").pop() || "jpg"
      const path = `${auth.user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await auth.supabase.storage
        .from("gift-images")
        .upload(path, file, { upsert: true })

      if (uploadError) return { error: uploadError.message }

      const { data: { publicUrl } } = auth.supabase.storage
        .from("gift-images")
        .getPublicUrl(path)

      updateData.image_url = publicUrl
    }
  }

  const { error } = await auth.supabase
    .from("gifts")
    .update(updateData)
    .eq("id", giftId)
    .eq("user_id", auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/gifts")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteGift(giftId: string): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  // Get gift to clean up image
  const { data: gift } = await auth.supabase
    .from("gifts")
    .select("image_url")
    .eq("id", giftId)
    .eq("user_id", auth.user.id)
    .single()

  if (!gift) return { error: "Cadeau niet gevonden" }

  // Delete image from storage if exists
  if (gift.image_url) {
    try {
      const url = new URL(gift.image_url)
      const pathMatch = url.pathname.match(/\/gift-images\/(.+)$/)
      if (pathMatch) {
        await auth.supabase.storage.from("gift-images").remove([pathMatch[1]])
      }
    } catch {
      // Image cleanup is best-effort
    }
  }

  const { error } = await auth.supabase
    .from("gifts")
    .delete()
    .eq("id", giftId)
    .eq("user_id", auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/gifts")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function toggleGiftVisibility(giftId: string): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  const { data: gift } = await auth.supabase
    .from("gifts")
    .select("is_visible")
    .eq("id", giftId)
    .eq("user_id", auth.user.id)
    .single()

  if (!gift) return { error: "Cadeau niet gevonden" }

  const { error } = await auth.supabase
    .from("gifts")
    .update({ is_visible: !gift.is_visible })
    .eq("id", giftId)
    .eq("user_id", auth.user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/gifts")
  return { success: true }
}

export async function reorderGifts(orderedIds: string[]): Promise<ActionResult> {
  const auth = await getAuthUser()
  if (!auth) return { error: "Niet ingelogd" }

  // Update sort_order for each gift
  const updates = orderedIds.map((id, index) =>
    auth.supabase
      .from("gifts")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("user_id", auth.user.id)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) return { error: failed.error.message }

  revalidatePath("/dashboard/gifts")
  return { success: true }
}
