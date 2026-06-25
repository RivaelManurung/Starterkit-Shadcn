import { PostForm } from "@/components/posts/post-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Buat Artikel Baru</h1>
          <p className="text-sm text-muted-foreground">
            Tulis artikel baru dan atur metadata-nya di sini.
          </p>
        </div>
      </div>

      <PostForm />
    </div>
  )
}
