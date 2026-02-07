"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SortableGiftList } from "@/components/dashboard/gift-list-sortable"
import { deleteGift, toggleGiftVisibility, reorderGifts } from "@/actions/gifts"
import type { Gift } from "@/types"

type GiftListProps = {
  gifts: Gift[]
}

export function GiftList({ gifts: initialGifts }: GiftListProps) {
  const [gifts, setGifts] = useState(initialGifts)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggleVisibility(id: string) {
    startTransition(async () => {
      await toggleGiftVisibility(id)
      setGifts((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_visible: !g.is_visible } : g))
      )
    })
  }

  function handleDelete(id: string) {
    setDeleteId(id)
  }

  function confirmDelete() {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    startTransition(async () => {
      await deleteGift(id)
      setGifts((prev) => prev.filter((g) => g.id !== id))
    })
  }

  function handleMoveUp(id: string) {
    const index = gifts.findIndex((g) => g.id === id)
    if (index <= 0) return
    const newGifts = [...gifts]
    ;[newGifts[index - 1], newGifts[index]] = [newGifts[index], newGifts[index - 1]]
    setGifts(newGifts)
    startTransition(async () => {
      await reorderGifts(newGifts.map((g) => g.id))
    })
  }

  function handleMoveDown(id: string) {
    const index = gifts.findIndex((g) => g.id === id)
    if (index < 0 || index >= gifts.length - 1) return
    const newGifts = [...gifts]
    ;[newGifts[index], newGifts[index + 1]] = [newGifts[index + 1], newGifts[index]]
    setGifts(newGifts)
    startTransition(async () => {
      await reorderGifts(newGifts.map((g) => g.id))
    })
  }

  function handleReorder(newGifts: Gift[]) {
    setGifts(newGifts)
    startTransition(async () => {
      await reorderGifts(newGifts.map((g) => g.id))
    })
  }

  const deletingGift = gifts.find((g) => g.id === deleteId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Cadeaus beheren
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {gifts.length} cadeau{gifts.length !== 1 ? "s" : ""} op jullie lijst
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/gifts/new">
            <Plus className="mr-2 h-4 w-4" />
            Nieuw cadeau
          </Link>
        </Button>
      </div>

      {gifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Nog geen cadeaus op jullie lijst. Voeg er een toe!
          </p>
          <Button asChild>
            <Link href="/dashboard/gifts/new">
              <Plus className="mr-2 h-4 w-4" />
              Eerste cadeau toevoegen
            </Link>
          </Button>
        </div>
      ) : (
        <SortableGiftList
          gifts={gifts}
          onReorder={handleReorder}
          onToggleVisibility={handleToggleVisibility}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadeau verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je &ldquo;{deletingGift?.name}&rdquo; wilt verwijderen?
              Dit kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Annuleren
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
