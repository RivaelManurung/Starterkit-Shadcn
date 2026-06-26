"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Plus, Download } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "sonner"
import { usePostStore } from "@/stores/post-store"

// Lazy load heavy components
const ArtikelFilters = dynamic(
  () => import("@/features/artikel/components/ArtikelFilters").then((mod) => mod.ArtikelFilters),
  {
    ssr: false,
    loading: () => <div className="h-10 bg-muted/40 animate-pulse rounded-lg w-full" />,
  }
)

const ArtikelTable = dynamic(
  () => import("@/features/artikel/components/ArtikelTable").then((mod) => mod.ArtikelTable),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
)

function PostsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 animate-pulse rounded w-48" />
          <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-9 bg-muted/40 animate-pulse rounded w-28" />
          <div className="h-9 bg-muted/40 animate-pulse rounded w-28" />
        </div>
      </div>
      <div className="h-10 bg-muted/40 animate-pulse rounded-lg w-full" />
      <div className="h-96 bg-muted/20 animate-pulse rounded-xl w-full" />
    </div>
  )
}

function PostsPageContent() {
  const posts = usePostStore((state) => state.posts)

  const handleExportCSV = () => {
    // Generate simple CSV content
    const headers = "ID,Judul,Status,Views,Tanggal Dibuat\n"
    const rows = posts
      .map(
        (p) =>
          `"${p.id}","${p.title.replace(/"/g, '""')}","${p.status}",${p.viewCount},"${new Date(
            p.createdAt
          ).toLocaleDateString("id-ID")}"`
      )
      .join("\n")
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `artikel-export-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Berhasil mengekspor data ke CSV")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Artikel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola semua artikel Anda. Gunakan filter untuk mempermudah pencarian.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV} className="rounded-xl font-semibold h-9 text-xs">
            <Download className="h-4 w-4 mr-2" />
            Ekspor CSV
          </Button>
          <Link href="/dashboard/posts/new" className={buttonVariants({ className: "rounded-xl font-semibold shadow-sm h-9 text-xs" })}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Artikel
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <ArtikelFilters />
        <ArtikelTable />
      </div>
    </div>
  )
}

export default function PostsPage() {
  return (
    <React.Suspense fallback={<PostsSkeleton />}>
      <PostsPageContent />
    </React.Suspense>
  )
}
