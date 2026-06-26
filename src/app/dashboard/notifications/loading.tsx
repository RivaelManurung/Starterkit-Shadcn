import * as React from "react"

export default function NotificationsLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="border-b border-border/40 pb-5">
        <div className="h-8 bg-muted/40 rounded w-48 mb-2" />
        <div className="h-4 bg-muted/40 rounded w-80" />
      </div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 border border-border/10 rounded-xl p-4 flex gap-4 items-center">
            <div className="h-10 bg-muted/40 rounded-full w-10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted/40 rounded w-1/3" />
              <div className="h-3 bg-muted/30 rounded w-2/3" />
            </div>
            <div className="h-4 bg-muted/40 rounded w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
