"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Download, Inbox, ChevronDown, ChevronUp } from "lucide-react"
import { useActivityStore } from "@/stores/activity-store"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/shared/search-input"
import { DatePickerWithRange } from "@/components/shared/date-range-picker"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLogFilters } from "../hooks/useLogFilters"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { useUserStore } from "@/stores/user-store"
import { ActivityLog } from "@/types"

export function LogTable() {
  const logs = useActivityStore((state) => state.logs)
  const users = useUserStore((state) => state.users)
  const [filters, setFilters] = useLogFilters()
  const { search, user, action, page, dateFrom, dateTo } = filters

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null)

  const itemsPerPage = 20

  // 1. Filter log data based on query states
  const filteredData = React.useMemo(() => {
    return logs.filter((log) => {
      // Global Search
      const matchesSearch = search
        ? log.description.toLowerCase().includes(search.toLowerCase()) ||
          log.entityTitle.toLowerCase().includes(search.toLowerCase()) ||
          log.ipAddress.includes(search)
        : true

      // User Filter
      const matchesUser = user && user !== "all" ? log.userId === user : true

      // Action Filter
      const matchesAction =
        action && action !== "all"
          ? log.action.toLowerCase() === action.toLowerCase()
          : true

      // Date Range Filter
      let matchesDate = true
      if (dateFrom || dateTo) {
        const logTime = new Date(log.createdAt).getTime()
        if (dateFrom) {
          const fromTime = new Date(dateFrom).setHours(0, 0, 0, 0)
          matchesDate = matchesDate && logTime >= fromTime
        }
        if (dateTo) {
          const toTime = new Date(dateTo).setHours(23, 59, 59, 999)
          matchesDate = matchesDate && logTime <= toTime
        }
      }

      return matchesSearch && matchesUser && matchesAction && matchesDate
    })
  }, [logs, search, user, action, dateFrom, dateTo])

  // 2. Paginate filtered logs
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, page])

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters({
      dateFrom: range?.from ? range.from.toISOString() : null,
      dateTo: range?.to ? range.to.toISOString() : null,
      page: 1,
    })
  }

  const dateRange: DateRange | undefined =
    dateFrom || dateTo
      ? {
          from: dateFrom ? new Date(dateFrom) : undefined,
          to: dateTo ? new Date(dateTo) : undefined,
        }
      : undefined

  const handleExportCSV = () => {
    const headers = "ID,Timestamp,User,Aksi,Target,IP Address,Status,Deskripsi\n"
    const rows = filteredData
      .map(
        (l) =>
          `"${l.id}","${l.createdAt}","${l.user?.fullName || "System"}","${l.action.toUpperCase()}","${
            l.entityTitle
          }","${l.ipAddress}","${l.status}","${l.description.replace(/"/g, '""')}"`
      )
      .join("\n")
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `log-aktivitas-export-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Berhasil mengekspor log ke CSV")
  }

  const columns = React.useMemo<ColumnDef<ActivityLog>[]>(() => [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Waktu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.getValue("createdAt")).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const u = row.original.user
        if (!u) return <span className="text-sm font-semibold">System</span>
        const initials = u.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-md border border-border/20">
              <AvatarImage src={u.avatar || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-[9px]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold text-foreground">{u.fullName}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "action",
      header: "Aksi",
      cell: ({ row }) => {
        const act = row.getValue("action") as string
        switch (act.toLowerCase()) {
          case "create":
            return (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] rounded-lg font-bold uppercase hover:bg-emerald-500/20">
                CREATE
              </Badge>
            )
          case "update":
            return (
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] rounded-lg font-bold uppercase hover:bg-blue-500/20">
                UPDATE
              </Badge>
            )
          case "delete":
            return (
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] rounded-lg font-bold uppercase hover:bg-red-500/20">
                DELETE
              </Badge>
            )
          case "login":
          default:
            return (
              <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px] rounded-lg font-bold uppercase hover:bg-zinc-500/20">
                {act.toUpperCase()}
              </Badge>
            )
        }
      },
    },
    {
      accessorKey: "entityTitle",
      header: "Target",
      cell: ({ row }) => <span className="text-xs font-medium text-foreground">{row.getValue("entityTitle")}</span>,
    },
    {
      accessorKey: "description",
      header: "Detail",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground leading-relaxed">{row.getValue("description")}</span>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => <span className="text-xs font-mono text-muted-foreground">{row.getValue("ipAddress")}</span>,
    },
    {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const isExpanded = expandedRowId === row.original.id
        return isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
      },
    },
  ], [expandedRowId])

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between w-full border-b border-border/10 pb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">
          <SearchInput
            className="w-full sm:w-[260px]"
            defaultValue={search || ""}
            onSearch={(val) => setFilters({ search: val || null, page: 1 })}
            placeholder="Cari deskripsi atau target..."
          />

          <Select
            value={user || "all"}
            onValueChange={(val) => setFilters({ user: val === "all" ? null : val, page: 1 })}
          >
            <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-lg">
              <SelectValue placeholder="Pengguna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua User</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={action || "all"}
            onValueChange={(val) => setFilters({ action: val === "all" ? null : val, page: 1 })}
          >
            <SelectTrigger className="w-full sm:w-[140px] h-9 rounded-lg">
              <SelectValue placeholder="Aksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aksi</SelectItem>
              <SelectItem value="create">CREATE</SelectItem>
              <SelectItem value="update">UPDATE</SelectItem>
              <SelectItem value="delete">DELETE</SelectItem>
              <SelectItem value="login">LOGIN</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange date={dateRange} setDate={handleDateChange} className="w-full sm:w-auto" />
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
          {(search || user !== "all" || action !== "all" || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              onClick={() =>
                setFilters({ search: "", user: "all", action: "all", dateFrom: null, dateTo: null, page: 1 })
              }
              className="h-9 px-3 rounded-lg text-xs"
            >
              Reset
            </Button>
          )}
          <Button onClick={handleExportCSV} variant="outline" className="h-9 rounded-lg text-xs font-semibold">
            <Download className="h-4 w-4 mr-2" />
            Ekspor CSV
          </Button>
        </div>
      </div>

      {/* Table Data */}
      <div className="rounded-xl border border-border/30 overflow-hidden shadow-sm bg-card/60 backdrop-blur-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/40 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-xs py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Main Row */}
                  <TableRow
                    onClick={() => setExpandedRowId(expandedRowId === row.original.id ? null : row.original.id)}
                    className="border-border/40 hover:bg-muted/30 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRowId === row.original.id && (
                    <TableRow className="bg-muted/10 border-border/30">
                      <TableCell colSpan={columns.length} className="p-4 bg-zinc-950/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                              Sebelum Perubahan
                            </span>
                            <pre className="text-xs bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg overflow-x-auto max-h-48 text-zinc-400 font-mono">
                              {row.original.oldValue
                                ? JSON.stringify(row.original.oldValue, null, 2)
                                : "Tidak ada data (CREATE/LOGIN)"}
                            </pre>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                              Setelah Perubahan
                            </span>
                            <pre className="text-xs bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg overflow-x-auto max-h-48 text-zinc-400 font-mono">
                              {row.original.newValue
                                ? JSON.stringify(row.original.newValue, null, 2)
                                : "Tidak ada data (DELETE/LOGIN)"}
                            </pre>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Inbox className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <span>Tidak ada log aktivitas yang ditemukan.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="text-xs text-muted-foreground font-medium">
            Halaman {page} dari {totalPages} ({totalItems} item)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: page - 1 })}
              disabled={!hasPrevPage}
              className="h-8 rounded-lg text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: page + 1 })}
              disabled={!hasNextPage}
              className="h-8 rounded-lg text-xs"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
