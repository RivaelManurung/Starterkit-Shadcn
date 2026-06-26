import * as React from "react"

export default function ActivityLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-5 bg-muted/40 rounded w-20" />
          <div className="h-9 bg-muted/40 rounded w-32" />
        </div>
      </div>
      <div className="h-96 bg-muted/20 rounded-xl w-full" />
    </div>
  )
}
