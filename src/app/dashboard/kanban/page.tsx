import { KanbanBoard } from "@/features/kanban/components/KanbanBoard"

export default function KanbanPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          Kanban Board
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola alur kerja dan penugasan penulisan konten blog secara visual.
        </p>
      </div>

      <KanbanBoard />
    </div>
  )
}
