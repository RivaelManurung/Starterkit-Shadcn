import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Priority = "low" | "medium" | "high"

export interface KanbanCard {
  id: string
  title: string
  columnId: string
  priority: Priority
  assignee: string
  dueDate: string
}

export interface KanbanColumn {
  id: string
  title: string
}

interface KanbanState {
  columns: KanbanColumn[]
  cards: KanbanCard[]
  moveCard: (cardId: string, targetColumnId: string) => void
  addCard: (columnId: string, card: Omit<KanbanCard, "id" | "columnId">) => void
  editCard: (cardId: string, updatedData: Partial<Omit<KanbanCard, "id">>) => void
  deleteCard: (cardId: string) => void
  reorderCards: (orderedCards: KanbanCard[]) => void
}

const defaultColumns: KanbanColumn[] = [
  { id: "todo", title: "Todo" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
]

const seedCards: KanbanCard[] = [
  {
    id: "task_1",
    title: "Menulis draf artikel Next.js 15 App Router",
    columnId: "todo",
    priority: "high",
    assignee: "Rivael",
    dueDate: "2026-07-02",
  },
  {
    id: "task_2",
    title: "Mendesain thumbnail untuk artikel Tailwind CSS v4",
    columnId: "todo",
    priority: "medium",
    assignee: "Hendra",
    dueDate: "2026-07-05",
  },
  {
    id: "task_3",
    title: "Review kode dan integrasi Tiptap Rich Text Editor",
    columnId: "in_progress",
    priority: "high",
    assignee: "Rivael",
    dueDate: "2026-06-28",
  },
  {
    id: "task_4",
    title: "Optimasi SEO halaman utama dan analitik",
    columnId: "in_progress",
    priority: "low",
    assignee: "Budi",
    dueDate: "2026-06-30",
  },
  {
    id: "task_5",
    title: "Menambahkan modul panduan Zustand state management",
    columnId: "review",
    priority: "medium",
    assignee: "Siti",
    dueDate: "2026-06-27",
  },
  {
    id: "task_6",
    title: "Menyelesaikan penataan layout dashboard settings",
    columnId: "done",
    priority: "low",
    assignee: "Siti",
    dueDate: "2026-06-25",
  },
]

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: defaultColumns,
      cards: seedCards,

      moveCard: (cardId, targetColumnId) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, columnId: targetColumnId } : c
          ),
        })),

      addCard: (columnId, cardData) =>
        set((state) => {
          const newCard: KanbanCard = {
            ...cardData,
            id: `task_${Math.random().toString(36).substring(2, 9)}`,
            columnId,
          }
          return { cards: [...state.cards, newCard] }
        }),

      editCard: (cardId, updatedData) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, ...updatedData } : c
          ),
        })),

      deleteCard: (cardId) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== cardId),
        })),

      reorderCards: (orderedCards) =>
        set({ cards: orderedCards }),
    }),
    {
      name: "kanban-store",
    }
  )
)
