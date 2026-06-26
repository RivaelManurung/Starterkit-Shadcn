import * as React from "react"

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="border-b border-border/40 pb-5">
        <div className="h-8 bg-muted/40 rounded w-48 mb-2" />
        <div className="h-4 bg-muted/40 rounded w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 col-span-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 bg-muted/20 rounded-lg" />
          ))}
        </div>
        <div className="col-span-3 space-y-4">
          <div className="h-[200px] bg-muted/20 rounded-xl" />
          <div className="h-[200px] bg-muted/20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
