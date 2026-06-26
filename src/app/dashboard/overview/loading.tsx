import * as React from "react"

export default function OverviewLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 rounded w-48" />
          <div className="h-4 bg-muted/40 rounded w-80" />
        </div>
        <div className="h-10 bg-muted/40 rounded w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/20 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 h-[350px] bg-muted/20 rounded-xl" />
        <div className="xl:col-span-4 h-[350px] bg-muted/20 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 h-80 bg-muted/20 rounded-xl" />
        <div className="xl:col-span-4 h-80 bg-muted/20 rounded-xl" />
        <div className="xl:col-span-4 h-80 bg-muted/20 rounded-xl" />
      </div>
    </div>
  )
}
