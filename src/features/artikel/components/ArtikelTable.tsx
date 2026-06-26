"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Settings2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePostStore } from "@/stores/post-store"
import { formatDate, truncate } from "@/lib/utils"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { Post } from "@/types"
import { useArtikelFilters } from "../hooks/useArtikelFilters"
import { PostStatusBadge } from "@/components/posts/post-status-badge"

export function ArtikelTable() {
  const posts = usePostStore(state => state.posts)
  const deletePost = usePostStore(state => state.deletePost)
  const bulkDeletePosts = usePostStore(state => state.bulkDeletePosts)
  const bulkUpdateStatus = usePostStore(state => state.bulkUpdateStatus)

  const [filters, setFilters] = useArtikelFilters()
  const { search, status, kategori, page, perPage } = filters

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    excerpt: false, // Hidden by default if wanted, or all visible
  })

  // 1. Filter posts based on URL query state
  const filteredData = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = search
        ? post.title.toLowerCase().includes(search.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()))
        : true

      const matchesStatus =
        status && status !== "all"
          ? post.status.toLowerCase() === status.toLowerCase()
          : true

      const matchesCategory =
        kategori && kategori !== "all"
          ? post.categoryId === kategori
          : true

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [posts, search, status, kategori])

  // 2. Paginate filtered posts
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / perPage)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * perPage
    const end = start + perPage
    return filteredData.slice(start, end)
  }, [filteredData, page, perPage])

  const columns = React.useMemo<ColumnDef<Post>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Judul
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="flex flex-col">
            <Link href={`/dashboard/posts/${post.id}`} className="font-medium hover:underline">
              {truncate(post.title, 50)}
            </Link>
            <span className="text-xs text-muted-foreground mt-1">
              {truncate(post.excerpt || "", 60)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PostStatusBadge status={row.getValue("status")} />,
    },
    {
      id: "category",
      header: "Kategori",
      cell: ({ row }) => {
        const cat = row.original.category
        return cat ? <span className="text-sm">{cat.name}</span> : <span className="text-sm text-muted-foreground">-</span>
      },
    },
    {
      id: "author",
      header: "Penulis",
      cell: ({ row }) => {
        const author = row.original.author
        return author ? <span className="text-sm">{author.fullName}</span> : <span className="text-sm text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "viewCount",
      header: "Views",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("viewCount") || "0")
        return <div className="font-medium">{amount.toLocaleString("id-ID")}</div>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={`/dashboard/posts/${post.id}`} className="w-full" />}>
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/dashboard/posts/${post.id}/edit`} className="w-full" />}>
                Edit Artikel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Artikel?"
                description={`Apakah Anda yakin ingin menghapus artikel "${post.title}"? Aksi ini tidak dapat dibatalkan.`}
                onConfirm={() => {
                  deletePost(post.id)
                  toast.success("Artikel berhasil dihapus")
                }}
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    Hapus
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [deletePost])

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedIds = selectedRows.map((r) => r.original.id)

  const handleBulkUpdateStatus = (statusVal: string) => {
    bulkUpdateStatus(selectedIds, statusVal)
    toast.success(`${selectedIds.length} artikel diubah ke ${statusVal}`)
    setRowSelection({})
  }

  const handleBulkDelete = () => {
    bulkDeletePosts(selectedIds)
    toast.success(`${selectedIds.length} artikel berhasil dihapus`)
    setRowSelection({})
  }

  return (
    <div className="space-y-4">
      {/* Column Visibility and Bulk Actions */}
      <div className="flex items-center justify-between gap-4">
        {selectedIds.length > 0 ? (
          <div className="bg-muted/80 backdrop-blur-md p-2 rounded-xl flex items-center gap-2 border border-border/20 shadow-sm animate-in slide-in-from-top-1 duration-200">
            <span className="text-xs font-semibold px-2 text-muted-foreground">
              {selectedIds.length} dipilih
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkUpdateStatus("draft")}
              className="h-8 rounded-lg text-xs"
            >
              Jadikan Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkUpdateStatus("published")}
              className="h-8 rounded-lg text-xs"
            >
              Publikasikan
            </Button>
            <ConfirmDelete
              title="Hapus Banyak Artikel?"
              description={`Apakah Anda yakin ingin menghapus ${selectedIds.length} artikel terpilih?`}
              onConfirm={handleBulkDelete}
              trigger={
                <Button variant="destructive" size="sm" className="h-8 rounded-lg text-xs">
                  Hapus
                </Button>
              }
            />
          </div>
        ) : (
          <div />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="ml-auto h-8 rounded-lg text-xs" />}>
            <Settings2 className="h-4 w-4 mr-2" />
            Kolom
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "viewCount" ? "Views" : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border/40 hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground text-sm">
                  Tidak ada artikel yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 animate-in fade-in duration-300">
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
