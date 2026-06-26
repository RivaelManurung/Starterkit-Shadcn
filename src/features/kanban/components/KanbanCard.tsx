"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, User, Edit2, Trash2, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { KanbanCard as KanbanCardType } from "@/stores/useKanbanStore"

interface KanbanCardProps {
  card: KanbanCardType
  onEdit: (card: KanbanCardType) => void
  onDelete: (id: string) => void
  isOverlay?: boolean
}

export function KanbanCard({ card, onEdit, onDelete, isOverlay = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: isOverlay })

  const style = isOverlay
    ? {
        opacity: 0.9,
        cursor: "grabbing",
        transform: "scale(1.03)",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
      }

  const getPriorityBadge = (priority: KanbanCardType["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] rounded-lg font-semibold capitalize hover:bg-red-500/20">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] rounded-lg font-semibold capitalize hover:bg-amber-500/20">
            Medium
          </Badge>
        )
      case "low":
      default:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] rounded-lg font-semibold capitalize hover:bg-emerald-500/20">
            Low
          </Badge>
        )
    }
  }

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className="group relative flex flex-col gap-3 rounded-xl border border-border/30 bg-card p-4 shadow-sm hover:shadow-md hover:border-border/60 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top section: Drag handle, Priority, Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted">
            <GripVertical className="h-3.5 w-3.5" />
          </div>
          {getPriorityBadge(card.priority)}
        </div>
        
        {/* Actions visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(card)
            }}
            className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card.id)
            }}
            className="h-6 w-6 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold leading-snug text-foreground">
        {card.title}
      </h4>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-border/20 pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <User className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{card.assignee}</span>
        </div>
        {card.dueDate && (
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>{card.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  )
}
