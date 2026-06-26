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
import { MoreHorizontal, ArrowUpDown, ShieldAlert, Shield, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { usePenggunaStore, Pengguna } from "@/stores/usePenggunaStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/shared/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { usePenggunaFilters } from "../hooks/usePenggunaFilters"
import dynamic from "next/dynamic"

const EditRoleModal = dynamic(
  () => import("./EditRoleModal").then((mod) => mod.EditRoleModal),
  { ssr: false }
)
import { toast } from "sonner"

export function PenggunaTable() {
  const { users, toggleStatus, deleteUser } = usePenggunaStore()
  const [filters, setFilters] = usePenggunaFilters()
  const { search, role } = filters

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<Pengguna | null>(null)

  // 1. Filter data based on query states
  const filteredData = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = search
        ? u.nama.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true

      const matchesRole = role && role !== "all" ? u.role === role : true

      return matchesSearch && matchesRole
    })
  }, [users, search, role])

  const columns = React.useMemo<ColumnDef<Pengguna>[]>(() => [
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-xl border border-border/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {u.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm text-foreground">{u.nama}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "role",
      header: "Peran",
      cell: ({ row }) => {
        const roleVal = row.getValue("role") as string
        switch (roleVal) {
          case "superadmin":
            return (
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] rounded-lg font-bold capitalize hover:bg-red-500/20">
                Superadmin
              </Badge>
            )
          case "admin":
            return (
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] rounded-lg font-bold capitalize hover:bg-blue-500/20">
                Admin
              </Badge>
            )
          case "editor":
            return (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] rounded-lg font-bold capitalize hover:bg-emerald-500/20">
                Editor
              </Badge>
            )
          case "author":
          default:
            return (
              <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px] rounded-lg font-bold capitalize hover:bg-zinc-500/20">
                Author
              </Badge>
            )
        }
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusVal = row.getValue("status") as string
        return statusVal === "Aktif" ? (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] rounded-lg font-bold hover:bg-emerald-500/20">
            Aktif
          </Badge>
        ) : (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] rounded-lg font-bold hover:bg-red-500/20">
            Nonaktif
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal Bergabung",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        return (
          <span className="text-xs text-muted-foreground font-medium">
            {new Date(dateStr).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const u = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Kelola</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  toggleStatus(u.id)
                  toast.success(`Status ${u.nama} diubah menjadi ${u.status === "Aktif" ? "Nonaktif" : "Aktif"}`)
                }}
              >
                {u.status === "Aktif" ? (
                  <>
                    <ToggleLeft className="h-4 w-4 mr-2 text-zinc-400" />
                    Nonaktifkan
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4 mr-2 text-emerald-500" />
                    Aktifkan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(u)
                  setIsEditOpen(true)
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit Peran
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Pengguna?"
                description={`Apakah Anda yakin ingin menghapus pengguna "${u.nama}"?`}
                onConfirm={() => {
                  deleteUser(u.id)
                  toast.success("Pengguna berhasil dihapus")
                }}
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [toggleStatus, deleteUser])

  const table = useReactTable({
    data: filteredData,
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
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
        <SearchInput
          className="w-full sm:w-[300px]"
          defaultValue={search || ""}
          onSearch={(val) => setFilters({ search: val || null })}
          placeholder="Cari nama atau email..."
        />

        <Select
          value={role || "all"}
          onValueChange={(val) => setFilters({ role: val === "all" ? null : val })}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-lg">
            <SelectValue placeholder="Peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peran</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>

        {(search || (role && role !== "all")) && (
          <Button
            variant="ghost"
            onClick={() => setFilters({ search: "", role: "all" })}
            className="h-9 px-3 rounded-lg text-xs"
          >
            Reset
          </Button>
        )}
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
                <TableRow key={row.id} className="border-border/40 hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm">
                  Tidak ada pengguna yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Role Modal */}
      <EditRoleModal
        user={selectedUser}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  )
}
