"use client"

import * as React from "react"
import dynamic from "next/dynamic"

const NotifikasiList = dynamic(
  () => import("@/features/notifikasi/components/NotifikasiList").then((mod) => mod.NotifikasiList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 border border-border/10 rounded-xl w-full" />
        ))}
      </div>
    ),
  }
)

function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border/40 pb-5">
        <div className="h-8 bg-muted/40 animate-pulse rounded w-48 mb-2" />
        <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
      </div>

      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/20 border border-border/10 rounded-xl w-full" />
        ))}
      </div>
    </div>
  )
}

function NotificationsPageContent() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          Notifikasi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Semua pemberitahuan sistem dan aktivitas untuk Anda.
        </p>
      </div>

      <NotifikasiList />
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <React.Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsPageContent />
    </React.Suspense>
  )
}

