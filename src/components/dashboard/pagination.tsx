"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalCount: number
  statusFilter: string
  search: string
}

function buildHref(page: number, statusFilter: string, search: string) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (statusFilter !== "all") params.set("status", statusFilter)
  if (search.trim()) params.set("search", search.trim())
  const qs = params.toString()
  return `/dashboard/transactions${qs ? `?${qs}` : ""}`
}

export function Pagination({ currentPage, totalPages, totalCount, statusFilter, search }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {totalCount} resultaten — Pagina {currentPage} van {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={buildHref(currentPage - 1, statusFilter, search)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Vorige
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Vorige
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={buildHref(currentPage + 1, statusFilter, search)}>
              Volgende
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Volgende
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
