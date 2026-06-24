"use client"

import * as React from "react"
import { useTagStore } from "@/stores/tag-store"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { Tag } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TagsPage() {
  const tags = useTagStore(state => state.tags)
  const deleteTag = useTagStore(state => state.deleteTag)
  const router = useRouter()

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "postCount",
      header: () => <div className="text-right">Artikel</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("postCount")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal Dibuat",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tag = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/tags/${tag.id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Tag?"
                description={`Anda yakin ingin menghapus tag "${tag.name}"?`}
                onConfirm={() => {
                  deleteTag(tag.id)
                  toast.success("Tag dihapus")
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tag</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tag untuk label artikel Anda.
          </p>
        </div>
        <Link href="/dashboard/tags/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tag
        </Link>
      </div>

      <DataTable columns={columns} data={tags} />
    </div>
  )
}
