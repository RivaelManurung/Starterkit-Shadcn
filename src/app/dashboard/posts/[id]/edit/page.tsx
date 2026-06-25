"use client"

import { PostForm } from "@/components/posts/post-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { usePostStore } from "@/stores/post-store"
import { useEffect, useState } from "react"
import { Post } from "@/types"

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const getPost = usePostStore(state => state.getPost)
  const [post, setPost] = useState<Post | null>(null)
  
  useEffect(() => {
    const data = getPost(id)
    if (data) {
      setPost(data)
    } else {
      router.push("/dashboard/posts")
    }
  }, [id, getPost, router])

  if (!post) return null // or a loading spinner

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Artikel</h1>
          <p className="text-sm text-muted-foreground">
            Ubah konten dan metadata artikel Anda.
          </p>
        </div>
      </div>

      <PostForm initialData={post} />
    </div>
  )
}
