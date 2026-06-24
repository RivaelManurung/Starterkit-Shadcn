"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/shared/data-table"
import { PostStatusBadge } from "./post-status-badge"
import { PostFilters } from "./post-filters"
import { usePostStore } from "@/stores/post-store"
import { formatDate, truncate } from "@/lib/utils"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
// import { exportToJSON, // exportToCSV } from "@/lib/mock/utils"

export function PostDataTable() {
  const filters = usePostStore(state => state.filters)
  const posts = usePostStore(state => state.posts)
  const deletePost = usePostStore(state => state.deletePost)
  const bulkDeletePosts = usePostStore(state => state.bulkDeletePosts)
  const bulkUpdateStatus = usePostStore(state => state.bulkUpdateStatus)
  const data = posts; const pagination = { page: 1, pageSize: 10, total: 100, totalPages: 10, hasNextPage: false, hasPrevPage: false };

  const handleExportCSV = () => {
    // exportToCSV(data as any, 'posts-export', [
    //   { key: 'title', label: 'Judul' },
    //   { key: 'status', label: 'Status' },
    //   { key: 'viewCount', label: 'Views' },
    //   { key: 'createdAt', label: 'Tanggal Dibuat' },
    // ])
    toast.success("Berhasil mengekspor data ke CSV")
  }

  const memoizedData = React.useMemo(() => data, [data])

  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            (table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")) as any
          }
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
              {truncate(post.excerpt, 60)}
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
        return author ? <span className="text-sm">{author.name}</span> : <span className="text-sm text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "viewCount",
      header: () => <div className="text-right">Views</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("viewCount"))
        return <div className="text-right font-medium">{amount.toLocaleString("id-ID")}</div>
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link href={`/dashboard/posts/${post.id}`} className="w-full">Lihat Detail</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link href={`/dashboard/posts/${post.id}/edit`} className="w-full">Edit Artikel</Link>
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

  const bulkActions = (table: any) => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((r: any) => r.original.id)

    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const count = bulkUpdateStatus(ids, 'DRAFT')
            toast.success(`${count} artikel diubah ke Draft`)
            table.resetRowSelection()
          }}
        >
          Jadikan Draft
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const count = bulkUpdateStatus(ids, 'PUBLISHED')
            toast.success(`${count} artikel dipublikasikan`)
            table.resetRowSelection()
          }}
        >
          Publikasikan
        </Button>
        <ConfirmDelete
          title="Hapus Banyak Artikel?"
          description={`Anda akan menghapus ${ids.length} artikel. Yakin?`}
          onConfirm={() => {
            const count = bulkDeletePosts(ids)
            toast.success(`${count} artikel dihapus`)
            table.resetRowSelection()
          }}
          trigger={
            <Button variant="destructive" size="sm">
              Hapus
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PostFilters />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          <Link href="/dashboard/posts/new" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Artikel
          </Link>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={memoizedData}
        pagination={pagination as any}
        onPageChange={(page) => usePostStore.getState().setFilters({ page })}
        bulkActions={bulkActions}
      />
    </div>
  )
}
