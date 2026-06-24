import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusVariant = 
  | "published" | "active" | "success"
  | "draft" | "inactive" 
  | "scheduled" | "info"
  | "archived" | "warning" | "pending"
  | "suspended" | "error" | "failed"
  | "banned" | "critical"

interface StatusBadgeProps {
  status: StatusVariant | string
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  // Normalize status for mapping
  const normalizedStatus = String(status).toLowerCase() as StatusVariant

  let badgeClass = ""
  let defaultLabel = String(status)

  switch (normalizedStatus) {
    case "published":
    case "active":
    case "success":
      badgeClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
      defaultLabel = normalizedStatus === "published" ? "Diterbitkan" : normalizedStatus === "active" ? "Aktif" : "Sukses"
      break
    case "draft":
    case "inactive":
      badgeClass = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
      defaultLabel = normalizedStatus === "draft" ? "Draft" : "Tidak Aktif"
      break
    case "scheduled":
    case "info":
      badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200"
      defaultLabel = normalizedStatus === "scheduled" ? "Terjadwal" : "Info"
      break
    case "archived":
    case "warning":
    case "pending":
      badgeClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200"
      defaultLabel = normalizedStatus === "archived" ? "Diarsipkan" : normalizedStatus === "pending" ? "Menunggu" : "Peringatan"
      break
    case "suspended":
    case "error":
    case "failed":
      badgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
      defaultLabel = normalizedStatus === "suspended" ? "Ditangguhkan" : normalizedStatus === "failed" ? "Gagal" : "Error"
      break
    case "banned":
    case "critical":
      badgeClass = "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800"
      defaultLabel = normalizedStatus === "banned" ? "Diblokir" : "Kritis"
      break
    default:
      badgeClass = "bg-secondary text-secondary-foreground"
      // try to capitalize first letter
      defaultLabel = String(status).charAt(0).toUpperCase() + String(status).slice(1)
  }

  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", badgeClass, className)}>
      {label || defaultLabel}
    </Badge>
  )
}
