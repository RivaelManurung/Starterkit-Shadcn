"use client"

import * as React from "react"
import dynamic from "next/dynamic"

// Lazy load heavy components
const PenggunaTable = dynamic(
  () => import("@/features/pengguna/components/PenggunaTable").then((mod) => mod.PenggunaTable),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
)

const UndangPenggunaModal = dynamic(
  () => import("@/features/pengguna/components/UndangPenggunaModal").then((mod) => mod.UndangPenggunaModal),
  {
    ssr: false,
    loading: () => <div className="h-9 bg-muted/40 animate-pulse rounded w-36" />,
  }
)

function UsersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 animate-pulse rounded w-48" />
          <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
        </div>
        <div className="h-9 bg-muted/40 animate-pulse rounded w-36" />
      </div>
      <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />
    </div>
  )
}

function UsersPageContent() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akses dan peran pengguna di dashboard Anda.
          </p>
        </div>
        <UndangPenggunaModal />
      </div>

      <PenggunaTable />
    </div>
  )
}

export default function UsersPage() {
  return (
    <React.Suspense fallback={<UsersSkeleton />}>
      <UsersPageContent />
    </React.Suspense>
  )
}

