import * as React from "react"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="h-10 bg-muted/40 rounded w-[360px]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-muted/20 rounded-xl" />
        <div className="h-80 bg-muted/20 rounded-xl" />
      </div>
      <div className="h-96 bg-muted/20 rounded-xl" />
    </div>
  )
}
