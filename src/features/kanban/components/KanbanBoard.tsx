"use client"

import * as React from "react"
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import { useKanbanStore, KanbanCard as KanbanCardType } from "@/stores/useKanbanStore"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function KanbanBoard() {
  const { columns, cards: storeCards, moveCard, addCard, editCard, deleteCard, reorderCards } = useKanbanStore()

  const [localCards, setLocalCards] = React.useState<KanbanCardType[]>([])

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid conflict with clicks on buttons
      },
    })
  )

  // Add/Edit Dialog State
  const [isOpen, setIsOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"add" | "edit">("add")
  const [targetColumnId, setTargetColumnId] = React.useState("")
  const [editCardId, setEditCardId] = React.useState("")

  // Form State
  const [title, setTitle] = React.useState("")
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("medium")
  const [assignee, setAssignee] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")

  // Active dragging state
  const [activeDragCard, setActiveDragCard] = React.useState<KanbanCardType | null>(null)
  const [initialColumnId, setInitialColumnId] = React.useState<string | null>(null)

  // Sync localCards with store when not dragging
  React.useEffect(() => {
    if (!activeDragCard) {
      setLocalCards(storeCards)
    }
  }, [storeCards, activeDragCard])

  const handleDragStart = (event: any) => {
    const cardId = event.active.id
    const card = localCards.find((c) => c.id === cardId)
    if (card) {
      setActiveDragCard(card)
      setInitialColumnId(card.columnId)
    }
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeCard = localCards.find((c) => c.id === activeId)
    if (!activeCard) return

    // If over is a column
    const isColumn = columns.some((col) => col.id === overId)
    if (isColumn) {
      if (activeCard.columnId !== overId) {
        setLocalCards((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, columnId: overId } : c))
        )
      }
      return
    }

    // If over is another card
    const overCard = localCards.find((c) => c.id === overId)
    if (overCard && activeCard.columnId !== overCard.columnId) {
      setLocalCards((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, columnId: overCard.columnId } : c))
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Clear overlay state
    setActiveDragCard(null)

    if (!over || !activeDragCard) {
      setInitialColumnId(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Find the current card state
    const currentCard = localCards.find((c) => c.id === activeId)
    
    // If it was moved to another column, show toast
    if (currentCard && initialColumnId && currentCard.columnId !== initialColumnId) {
      const getColumnTitle = (id: string) => {
        return columns.find(col => col.id === id)?.title || id
      }
      toast.success(`Tugas "${currentCard.title}" dipindahkan ke "${getColumnTitle(currentCard.columnId)}"`)
    }

    // Determine final cards order
    let finalCards = [...localCards]
    const overCard = localCards.find((c) => c.id === overId)
    
    if (overCard) {
      const activeIndex = localCards.findIndex((c) => c.id === activeId)
      const overIndex = localCards.findIndex((c) => c.id === overId)
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        finalCards = arrayMove(localCards, activeIndex, overIndex)
      }
    }

    // Commit to Zustand store and localStorage ONLY ONCE at the end
    reorderCards(finalCards)
    setLocalCards(finalCards)
    setInitialColumnId(null)
  }

  const openAddModal = (columnId: string) => {
    setDialogMode("add")
    setTargetColumnId(columnId)
    setTitle("")
    setPriority("medium")
    setAssignee("")
    setDueDate("")
    setIsOpen(true)
  }

  const openEditModal = (card: KanbanCardType) => {
    setDialogMode("edit")
    setEditCardId(card.id)
    setTitle(card.title)
    setPriority(card.priority)
    setAssignee(card.assignee)
    setDueDate(card.dueDate)
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assignee.trim()) {
      return
    }

    if (dialogMode === "add") {
      addCard(targetColumnId, {
        title,
        priority,
        assignee,
        dueDate,
      })
    } else {
      editCard(editCardId, {
        title,
        priority,
        assignee,
        dueDate,
      })
    }
    setIsOpen(false)
  }

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 items-start select-none min-h-[calc(100vh-250px)] max-h-[calc(100vh-220px)] scrollbar-thin">
          {columns.map((column) => {
            const columnCards = localCards.filter((c) => c.columnId === column.id)
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
                onAddCard={openAddModal}
                onEditCard={openEditModal}
                onDeleteCard={deleteCard}
              />
            )
          })}
        </div>
        <DragOverlay>
          {activeDragCard ? (
            <KanbanCard
              card={activeDragCard}
              onEdit={() => {}}
              onDelete={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add / Edit Task Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {dialogMode === "add" ? "Tambah Tugas Baru" : "Edit Tugas"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">Judul Tugas</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul tugas..."
                className="rounded-lg text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignee" className="text-xs font-semibold">Assignee</Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Nama penanggung jawab..."
                className="rounded-lg text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-semibold">Prioritas</Label>
                <Select
                  value={priority}
                  onValueChange={(val: any) => setPriority(val)}
                >
                  <SelectTrigger className="rounded-lg text-xs w-full">
                    <SelectValue placeholder="Prioritas">
                      {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Prioritas"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs">Low</SelectItem>
                    <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                    <SelectItem value="high" className="text-xs">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDate" className="text-xs font-semibold">Tenggat Waktu</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg text-xs"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold rounded-lg"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="text-xs font-semibold rounded-lg"
              >
                {dialogMode === "add" ? "Tambah" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
