"use client"

import * as React from "react"
import { useActivityStore } from "@/stores/activity-store"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { ActivityLog } from "@/types"
import { Badge } from "@/components/ui/badge"

export default function ActivityPage() {
  const logs = useActivityStore(state => state.logs)
  const clearLogs = useActivityStore(state => state.clearOldLogs)
  // removed getLogs call

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "action",
      header: "Aksi",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.getValue("action")}
        </Badge>
      ),
    },
    {
      accessorKey: "entityTitle",
      header: "Entitas",
      cell: ({ row }) => {
        const log = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{log.entityTitle}</span>
            <span className="text-xs text-muted-foreground">{log.entity}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "userId",
      header: "Pengguna",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("userId")}</span>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Waktu",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Log Aktivitas</h1>
          <p className="text-sm text-muted-foreground">
            Rekam jejak seluruh aktivitas sistem dan pengguna.
          </p>
        </div>
        <ConfirmDelete
          title="Bersihkan Log?"
          description="Aksi ini akan menghapus semua riwayat aktivitas dan tidak dapat dibatalkan."
          onConfirm={() => {
            clearLogs(0)
            toast.success("Log aktivitas dibersihkan")
          }}
          trigger={
            <Button variant="destructive">
              Bersihkan Log
            </Button>
          }
        />
      </div>

      <DataTable columns={columns} data={logs} />
    </div>
  )
}
