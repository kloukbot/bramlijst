"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Pencil, Trash2, ArrowUp, ArrowDown, Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCents, progressPercent } from "@/lib/utils"
import type { Gift as GiftType } from "@/types"

type GiftCardProps = {
  gift: GiftType
  onToggleVisibility: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  isFirst?: boolean
  isLast?: boolean
}

export function GiftCard({
  gift,
  onToggleVisibility,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: GiftCardProps) {
  const progress = progressPercent(gift.collected_amount, gift.target_amount)

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative aspect-square w-full sm:w-32 shrink-0 bg-secondary">
          {gift.image_url ? (
            <Image src={gift.image_url} alt={gift.name} fill sizes="(max-width: 640px) 100vw, 128px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gift className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{gift.name}</h3>
                {!gift.is_visible && (
                  <Badge variant="secondary" className="text-xs">Verborgen</Badge>
                )}
                {gift.is_fully_funded && (
                  <Badge className="text-xs bg-green-100 text-green-800">Voltooid</Badge>
                )}
              </div>
              {gift.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {gift.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCents(gift.collected_amount)} van {formatCents(gift.target_amount)}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/dashboard/gifts/${gift.id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Bewerken</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleVisibility(gift.id)}
            >
              {gift.is_visible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">
                {gift.is_visible ? "Verbergen" : "Tonen"}
              </span>
            </Button>
            {onMoveUp && !isFirst && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMoveUp(gift.id)}>
                <ArrowUp className="h-3.5 w-3.5" />
                <span className="sr-only">Omhoog</span>
              </Button>
            )}
            {onMoveDown && !isLast && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMoveDown(gift.id)}>
                <ArrowDown className="h-3.5 w-3.5" />
                <span className="sr-only">Omlaag</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(gift.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Verwijderen</span>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
