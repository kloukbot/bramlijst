"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCents } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { sendThankYou, markAllThanked } from "@/actions/contributions"
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Heart,
  CheckCheck,
  Mail,
  MessageSquare,
} from "lucide-react"
import type { ContributionStatus } from "@/types"

type ContributionRow = {
  id: string
  guest_name: string
  guest_email: string | null
  amount: number
  message: string | null
  status: ContributionStatus
  is_thank_you_sent: boolean
  thank_you_message: string | null
  thank_you_sent_at: string | null
  stripe_payment_intent_id: string | null
  created_at: string
  gift_name: string | null
}

type TransactionTableProps = {
  contributions: ContributionRow[]
  currentStatus?: string
  currentSearch?: string
}

const statusConfig: Record<ContributionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  succeeded: { label: "Geslaagd", variant: "default" },
  pending: { label: "In afwachting", variant: "secondary" },
  failed: { label: "Mislukt", variant: "destructive" },
  refunded: { label: "Terugbetaald", variant: "outline" },
}

export function TransactionTable({ contributions, currentStatus = "all", currentSearch = "" }: TransactionTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | "all">(currentStatus as ContributionStatus | "all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const navigate = useCallback((newStatus: string, newSearch: string) => {
    const params = new URLSearchParams()
    if (newStatus !== "all") params.set("status", newStatus)
    if (newSearch.trim()) params.set("search", newSearch.trim())
    // Reset to page 1 on filter change
    const qs = params.toString()
    router.push(`/dashboard/transactions${qs ? `?${qs}` : ""}`)
  }, [router])
  const [thankYouId, setThankYouId] = useState<string | null>(null)
  const [thankYouMessage, setThankYouMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  // Data is already filtered and sorted server-side
  const filtered = contributions

  const unthankedSucceeded = filtered.filter(
    (c) => c.status === "succeeded" && !c.is_thank_you_sent
  )

  async function handleSendThankYou() {
    if (!thankYouId || !thankYouMessage.trim()) return
    setSending(true)
    const result = await sendThankYou(thankYouId, thankYouMessage.trim())
    setSending(false)
    if (result.success) {
      setThankYouId(null)
      setThankYouMessage("")
    }
  }

  async function handleBulkThank() {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    await markAllThanked(Array.from(selectedIds))
    setSelectedIds(new Set())
    setBulkLoading(false)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllUnthanked() {
    setSelectedIds(new Set(unthankedSucceeded.map((c) => c.id)))
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Zoek op gastnaam..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              // Debounce-ish: navigate on Enter or clear
              if (e.target.value === "") navigate(statusFilter, "")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(statusFilter, search)
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["all", "succeeded", "pending", "failed", "refunded"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter(s); navigate(s, search) }}
            >
              {s === "all" ? "Alle" : statusConfig[s].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {unthankedSucceeded.length > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAllUnthanked}>
            <CheckCheck className="mr-1 h-3 w-3" />
            Selecteer alle onbedankte ({unthankedSucceeded.length})
          </Button>
          {selectedIds.size > 0 && (
            <Button size="sm" onClick={handleBulkThank} disabled={bulkLoading}>
              <Heart className="mr-1 h-3 w-3" />
              {bulkLoading ? "Bezig..." : `Markeer ${selectedIds.size} als bedankt`}
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-10 px-3 py-3"></th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Datum</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Gast</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Cadeau</th>
                <th className="px-3 py-3 text-right font-medium text-muted-foreground">Bedrag</th>
                <th className="px-3 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-3 text-center font-medium text-muted-foreground">Bericht</th>
                <th className="px-3 py-3 text-center font-medium text-muted-foreground">Bedankt</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-12 text-center text-muted-foreground">
                    Geen bijdragen gevonden
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const expanded = expandedId === c.id
                const sc = statusConfig[c.status]
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : c.id)}
                    >
                      <td className="px-3 py-3">
                        {c.status === "succeeded" && !c.is_thank_you_sent && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(c.id)}
                            onChange={(e) => { e.stopPropagation(); toggleSelect(c.id) }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-border"
                          />
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-3 py-3 font-medium">{c.guest_name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{c.gift_name || "—"}</td>
                      <td className="px-3 py-3 text-right font-medium">{formatCents(c.amount)}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {c.message && <MessageSquare className="mx-auto h-4 w-4 text-muted-foreground" />}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {c.is_thank_you_sent ? (
                          <Heart className="mx-auto h-4 w-4 text-pink-500 fill-pink-500" />
                        ) : c.status === "succeeded" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setThankYouId(c.id); setThankYouMessage("") }}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </td>
                    </tr>
                    {/* Expanded detail row (Epic 7.2) */}
                    {expanded && (
                      <tr className="border-b border-border bg-muted/20">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Naam:</span>{" "}
                              <span className="font-medium">{c.guest_name}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              <span className="font-medium">{c.guest_email || "Niet opgegeven"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Bedrag:</span>{" "}
                              <span className="font-medium">{formatCents(c.amount)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cadeau:</span>{" "}
                              <span className="font-medium">{c.gift_name || "Geen"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Stripe PI:</span>{" "}
                              <span className="font-mono text-xs">{c.stripe_payment_intent_id || "—"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tijdstip:</span>{" "}
                              <span className="font-medium">{formatDate(c.created_at)}</span>
                            </div>
                            {c.message && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <span className="text-muted-foreground">Bericht:</span>{" "}
                                <span className="italic">&quot;{c.message}&quot;</span>
                              </div>
                            )}
                            {c.is_thank_you_sent && c.thank_you_message && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <span className="text-muted-foreground">Bedankbericht:</span>{" "}
                                <span className="italic text-pink-600">&quot;{c.thank_you_message}&quot;</span>
                                {c.thank_you_sent_at && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({formatDate(c.thank_you_sent_at)})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thank You Dialog */}
      <Dialog open={!!thankYouId} onOpenChange={(open) => !open && setThankYouId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bedankbericht sturen</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Schrijf een persoonlijk bedankbericht voor deze gast.
              {contributions.find((c) => c.id === thankYouId)?.guest_email
                ? " Het bericht wordt ook per email verstuurd."
                : " De gast heeft geen email opgegeven, het bericht wordt alleen opgeslagen."}
            </p>
            <Textarea
              placeholder="Lieve gast, bedankt voor jullie bijdrage..."
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setThankYouId(null)}>
                Annuleren
              </Button>
              <Button onClick={handleSendThankYou} disabled={sending || !thankYouMessage.trim()}>
                {sending ? "Versturen..." : "Verstuur bedankje"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
