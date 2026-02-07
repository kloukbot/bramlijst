"use client"

import React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { GiftCard } from "@/components/dashboard/gift-card"
import type { Gift } from "@/types"

type SortableGiftListProps = {
  gifts: Gift[]
  onReorder: (gifts: Gift[]) => void
  onToggleVisibility: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

function SortableGiftItem({
  gift,
  index,
  total,
  onToggleVisibility,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  gift: Gift
  index: number
  total: number
  onToggleVisibility: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gift.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-1">
      <button
        {...attributes}
        {...listeners}
        className="flex items-center px-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Versleep om te herordenen"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <GiftCard
          gift={gift}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={index === 0}
          isLast={index === total - 1}
        />
      </div>
    </div>
  )
}

export function SortableGiftList({
  gifts,
  onReorder,
  onToggleVisibility,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SortableGiftListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = gifts.findIndex((g) => g.id === active.id)
    const newIndex = gifts.findIndex((g) => g.id === over.id)
    const newGifts = arrayMove(gifts, oldIndex, newIndex)
    onReorder(newGifts)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={gifts.map((g) => g.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {gifts.map((gift, i) => (
            <SortableGiftItem
              key={gift.id}
              gift={gift}
              index={i}
              total={gifts.length}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
