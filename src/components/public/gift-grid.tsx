"use client"

import { useState } from "react"
import type { Gift } from "@/types"
import { GiftCardPublic } from "./gift-card-public"
import { ContributeModal } from "./contribute-modal"

interface GiftGridProps {
  gifts: Gift[]
  slug: string
  stripeReady: boolean
}

export function GiftGrid({ gifts, slug, stripeReady }: GiftGridProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function handleContribute(gift: Gift) {
    setSelectedGift(gift)
    setModalOpen(true)
  }

  if (gifts.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-lg">Er zijn nog geen cadeaus op deze lijst.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => (
          <GiftCardPublic
            key={gift.id}
            gift={gift}
            onContribute={handleContribute}
            stripeReady={stripeReady}
          />
        ))}
      </div>

      <ContributeModal
        gift={selectedGift}
        open={modalOpen}
        onOpenChange={setModalOpen}
        slug={slug}
      />
    </>
  )
}
