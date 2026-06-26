import * as React from "react"

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="h-9 bg-muted/40 rounded w-32" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/20 rounded-xl border border-border/10" />
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px] bg-muted/20 rounded-xl" />
        <div className="lg:col-span-1 h-[350px] bg-muted/20 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="h-64 bg-muted/20 rounded-xl" />
    </div>
  )
}
