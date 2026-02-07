import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionStats } from "@/components/dashboard/transaction-stats"
import { TransactionTable } from "@/components/dashboard/transaction-table"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch contributions with gift names
  const { data: contributions } = await supabase
    .from("contributions")
    .select(`
      id,
      guest_name,
      guest_email,
      amount,
      message,
      status,
      is_thank_you_sent,
      thank_you_message,
      thank_you_sent_at,
      stripe_payment_intent_id,
      created_at,
      gift_id,
      gifts (name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const rows = (contributions ?? []).map((c) => ({
    id: c.id,
    guest_name: c.guest_name,
    guest_email: c.guest_email,
    amount: c.amount,
    message: c.message,
    status: c.status as "succeeded" | "pending" | "failed" | "refunded",
    is_thank_you_sent: c.is_thank_you_sent,
    thank_you_message: c.thank_you_message,
    thank_you_sent_at: c.thank_you_sent_at,
    stripe_payment_intent_id: c.stripe_payment_intent_id,
    created_at: c.created_at,
    gift_name: (c.gifts as unknown as { name: string } | null)?.name ?? null,
  }))

  // Stats (Epic 7.5)
  const succeeded = rows.filter((r) => r.status === "succeeded")
  const totalCollected = succeeded.reduce((sum, r) => sum + r.amount, 0)
  const averageContribution = succeeded.length > 0 ? Math.round(totalCollected / succeeded.length) : 0
  const uniqueGuests = new Set(succeeded.map((r) => r.guest_name.toLowerCase())).size

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Transacties
        </h1>
        <p className="text-sm text-muted-foreground">
          Overzicht van alle bijdragen aan jullie cadeaulijst.
        </p>
      </div>

      <TransactionStats
        totalCollected={totalCollected}
        averageContribution={averageContribution}
        uniqueGuests={uniqueGuests}
        totalContributions={succeeded.length}
      />

      <TransactionTable contributions={rows} />
    </div>
  )
}
