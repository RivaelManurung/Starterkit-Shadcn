import * as React from "react"

export default function PostsLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-9 bg-muted/40 rounded w-28" />
          <div className="h-9 bg-muted/40 rounded w-28" />
        </div>
      </div>
      <div className="h-10 bg-muted/40 rounded-lg w-full" />
      <div className="h-96 bg-muted/20 rounded-xl w-full" />
    </div>
  )
}
