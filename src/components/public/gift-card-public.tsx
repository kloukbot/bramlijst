"use client"

import type { Gift } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "./progress-bar"
import { formatCents } from "@/lib/utils"
import { Gift as GiftIcon, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface GiftCardPublicProps {
  gift: Gift
  onContribute: (gift: Gift) => void
  stripeReady: boolean
}

export function GiftCardPublic({
  gift,
  onContribute,
  stripeReady,
}: GiftCardPublicProps) {
  const isFunded = gift.is_fully_funded || gift.collected_amount >= gift.target_amount
  const remaining = gift.target_amount - gift.collected_amount

  return (
    <Card
      className={`overflow-hidden transition-opacity ${isFunded ? "opacity-60" : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {gift.image_url ? (
          <Image
            src={gift.image_url}
            alt={gift.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GiftIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        {isFunded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge className="gap-1.5 bg-green-600 text-sm px-3 py-1">
              <CheckCircle2 className="h-4 w-4" />
              Voltooid
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold text-base leading-tight">{gift.name}</h3>
          {gift.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {gift.description}
            </p>
          )}
        </div>

        <ProgressBar collected={gift.collected_amount} target={gift.target_amount} />

        {!isFunded && (
          <div className="pt-1">
            <Button
              onClick={() => onContribute(gift)}
              disabled={!stripeReady}
              className="w-full"
              size="sm"
            >
              Bijdragen · {formatCents(remaining)} resterend
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
