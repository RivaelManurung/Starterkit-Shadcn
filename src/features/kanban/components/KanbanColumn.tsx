"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanCard } from "./KanbanCard"
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from "@/stores/useKanbanStore"

interface KanbanColumnProps {
  column: KanbanColumnType
  cards: KanbanCardType[]
  onAddCard: (columnId: string) => void
  onEditCard: (card: KanbanCardType) => void
  onDeleteCard: (id: string) => void
}

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const cardIds = React.useMemo(() => cards.map((c) => c.id), [cards])

  return (
    <div className="flex flex-col w-72 shrink-0 rounded-xl bg-muted/40 border border-border/20 p-4 h-full max-h-[calc(100vh-220px)]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">{column.title}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground border border-border/40">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards Area (Droppable) */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px] pr-1 pb-4 scrollbar-thin"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/20 rounded-xl p-8 text-center text-xs text-muted-foreground min-h-[120px]">
            Tarik card ke sini atau tambah baru.
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <Button
        variant="ghost"
        onClick={() => onAddCard(column.id)}
        className="mt-2 w-full justify-center h-9 rounded-lg text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground border border-dashed border-border/25"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Tambah Card
      </Button>
    </div>
  )
}
