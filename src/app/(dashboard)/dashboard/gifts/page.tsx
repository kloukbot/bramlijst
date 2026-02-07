import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GiftList } from "@/components/dashboard/gift-list"
import type { Gift } from "@/types"

export default async function GiftsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: gifts } = await supabase
    .from("gifts")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })

  return <GiftList gifts={(gifts ?? []) as Gift[]} />
}
