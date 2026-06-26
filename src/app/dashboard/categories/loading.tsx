import * as React from "react"

export default function CategoriesLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="h-9 bg-muted/40 rounded w-36" />
      </div>
      <div className="h-96 bg-muted/20 rounded-xl w-full" />
    </div>
  )
}
