"use client"

import * as React from "react"
import dynamic from "next/dynamic"

const KanbanBoard = dynamic(
  () => import("@/features/kanban/components/KanbanBoard").then((mod) => mod.KanbanBoard),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/10 border border-border/20 rounded-xl p-4 min-h-[300px]">
            <div className="h-5 bg-muted/40 rounded w-24 mb-4" />
          </div>
        ))}
      </div>
    ),
  }
)

function KanbanSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border/40 pb-5">
        <div className="h-8 bg-muted/40 animate-pulse rounded w-48 mb-2" />
        <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/10 border border-border/20 rounded-xl p-4 min-h-[300px]" />
        ))}
      </div>
    </div>
  )
}

function KanbanPageContent() {
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

export default function KanbanPage() {
  return (
    <React.Suspense fallback={<KanbanSkeleton />}>
      <KanbanPageContent />
    </React.Suspense>
  )
}

