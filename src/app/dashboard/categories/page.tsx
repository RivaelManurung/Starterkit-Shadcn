"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useCategoryStore } from "@/stores/category-store"
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
import { Category } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

const DataTable = dynamic(
  () => import("@/components/shared/data-table").then((mod) => mod.DataTable),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
) as any

function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

function CategoriesPageContent() {
  const categories = useCategoryStore(state => state.categories)
  const deleteCategory = useCategoryStore(state => state.deleteCategory)
  const router = useRouter()

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const desc = row.getValue("description") as string
        return desc ? <span className="truncate max-w-[300px] inline-block">{desc}</span> : <span className="text-muted-foreground">-</span>
      }
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
        const category = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Kategori?"
                description={`Anda yakin ingin menghapus kategori "${category.name}"?`}
                onConfirm={() => {
                  deleteCategory(category.id)
                  toast.success("Kategori dihapus")
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengelompokkan artikel Anda.
          </p>
        </div>
        <Link href="/dashboard/categories/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Link>
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <React.Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesPageContent />
    </React.Suspense>
  )
}

