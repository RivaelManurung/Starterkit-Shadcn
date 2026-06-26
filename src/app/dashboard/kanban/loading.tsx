import * as React from "react"

export default function KanbanLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="border-b border-border/40 pb-5">
        <div className="h-8 bg-muted/40 rounded w-48 mb-2" />
        <div className="h-4 bg-muted/40 rounded w-80" />
      </div>

      {/* Kanban Board Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/10 border border-border/20 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <div className="h-5 bg-muted/40 rounded w-24" />
              <div className="h-5 bg-muted/40 rounded-full w-6" />
            </div>
            {[...Array(i === 0 ? 3 : i === 1 ? 2 : i === 2 ? 1 : 0)].map((_, j) => (
              <div key={j} className="h-28 bg-muted/20 border border-border/10 rounded-xl p-3 space-y-2">
                <div className="h-4 bg-muted/40 rounded w-3/4" />
                <div className="h-3 bg-muted/30 rounded w-full" />
                <div className="h-3 bg-muted/30 rounded w-5/6" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-muted/40 rounded w-16" />
                  <div className="h-5 bg-muted/40 rounded-full w-5" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
