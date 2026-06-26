"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { useActivityStore } from "@/stores/activity-store"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

// Lazy load heavy components
const LogTable = dynamic(
  () => import("@/features/log-aktivitas/components/LogTable").then((mod) => mod.LogTable),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
)

function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 animate-pulse rounded w-48" />
          <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-5 bg-muted/40 animate-pulse rounded w-20" />
          <div className="h-9 bg-muted/40 animate-pulse rounded w-32" />
        </div>
      </div>
      <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />
    </div>
  )
}

function ActivityPageContent() {
  const clearLogs = useActivityStore((state) => state.clearOldLogs)
  const [autoRefresh, setAutoRefresh] = React.useState(true)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Log Aktivitas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rekam jejak seluruh aktivitas sistem dan pengguna.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 mr-2">
            <Switch 
              id="auto-refresh" 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh} 
              className="h-5"
            />
            <Label htmlFor="auto-refresh" className={`text-xs font-semibold ${autoRefresh ? "text-primary" : "text-muted-foreground"}`}>
              {autoRefresh ? "Live: On" : "Live: Off"}
            </Label>
          </div>
          <ConfirmDelete
            title="Bersihkan Log?"
            description="Aksi ini akan menghapus seluruh riwayat aktivitas dan tidak dapat dibatalkan."
            onConfirm={() => {
              clearLogs(0)
              toast.success("Log aktivitas dibersihkan")
            }}
            trigger={
              <Button variant="destructive" className="rounded-xl font-semibold h-9 text-xs">
                <Trash2 className="h-4 w-4 mr-2" />
                Bersihkan Log
              </Button>
            }
          />
        </div>
      </div>

      <LogTable />
    </div>
  )
}

export default function ActivityPage() {
  return (
    <React.Suspense fallback={<ActivitySkeleton />}>
      <ActivityPageContent />
    </React.Suspense>
  )
}

