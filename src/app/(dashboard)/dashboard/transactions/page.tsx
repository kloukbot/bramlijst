import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionStats } from "@/components/dashboard/transaction-stats"
import { TransactionTable } from "@/components/dashboard/transaction-table"
import { Pagination } from "@/components/dashboard/pagination"

const PAGE_SIZE = 20

interface TransactionsPageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const currentPage = Math.max(1, parseInt(sp.page ?? "1", 10) || 1)
  const statusFilter = sp.status ?? "all"
  const search = sp.search ?? ""

  // Build query for count
  let countQuery = supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (statusFilter !== "all") {
    countQuery = countQuery.eq("status", statusFilter)
  }
  if (search.trim()) {
    countQuery = countQuery.ilike("guest_name", `%${search.trim()}%`)
  }

  const { count: totalCount } = await countQuery
  const total = totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Build data query
  let dataQuery = supabase
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

  if (statusFilter !== "all") {
    dataQuery = dataQuery.eq("status", statusFilter)
  }
  if (search.trim()) {
    dataQuery = dataQuery.ilike("guest_name", `%${search.trim()}%`)
  }

  const { data: contributions } = await dataQuery
    .order("created_at", { ascending: false })
    .range(from, to)

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

  // Stats — always over all succeeded (unfiltered)
  const { data: allSucceeded } = await supabase
    .from("contributions")
    .select("amount, guest_name")
    .eq("user_id", user.id)
    .eq("status", "succeeded")

  const succeededRows = allSucceeded ?? []
  const totalCollected = succeededRows.reduce((sum, r) => sum + r.amount, 0)
  const averageContribution = succeededRows.length > 0 ? Math.round(totalCollected / succeededRows.length) : 0
  const uniqueGuests = new Set(succeededRows.map((r) => r.guest_name.toLowerCase())).size

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
        totalContributions={succeededRows.length}
      />

      <TransactionTable
        contributions={rows}
        currentStatus={statusFilter}
        currentSearch={search}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={total}
        statusFilter={statusFilter}
        search={search}
      />
    </div>
  )
}
