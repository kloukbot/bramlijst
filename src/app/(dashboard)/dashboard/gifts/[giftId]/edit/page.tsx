import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { GiftForm } from "@/components/dashboard/gift-form"
import type { Gift } from "@/types"

type Props = {
  params: Promise<{ giftId: string }>
}

export default async function EditGiftPage({ params }: Props) {
  const { giftId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: gift } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", giftId)
    .eq("user_id", user.id)
    .single()

  if (!gift) notFound()

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Cadeau bewerken
        </h1>
        <p className="text-sm text-muted-foreground">
          Pas de details van &ldquo;{gift.name}&rdquo; aan
        </p>
      </div>

      <GiftForm gift={gift as Gift} mode="edit" />
    </div>
  )
}
