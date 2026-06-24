import { PostDataTable } from "@/components/posts/post-data-table"

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Artikel</h1>
        <p className="text-sm text-muted-foreground">
          Kelola semua artikel Anda. Gunakan filter untuk mempermudah pencarian.
        </p>
      </div>

      <PostDataTable />
    </div>
  )
}
