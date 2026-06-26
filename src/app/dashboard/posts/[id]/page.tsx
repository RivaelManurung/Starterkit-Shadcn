"use client"

import { ChevronLeft, Edit, CalendarIcon, Eye, Clock, User, Tag } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { usePostStore } from "@/stores/post-store"
import { useEffect, useState } from "react"
import { Post, Tag as TagType } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostStatusBadge } from "@/components/posts/post-status-badge"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const getPost = usePostStore(state => state.getPost)
  const incrementView = usePostStore(state => state.incrementView)
  const [post, setPost] = useState<Post | null>(null)
  
  useEffect(() => {
    const data = getPost(id)
    if (data) {
      setPost(data)
      // Simulasi view increment
      incrementView(id)
    } else {
      router.push("/dashboard/posts")
    }
  }, [id, getPost, incrementView, router])

  if (!post) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Detail Artikel</h1>
          </div>
        </div>
        <Link href={`/dashboard/posts/${post.id}/edit`} className={buttonVariants()}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Artikel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl font-bold leading-tight">
                  {post.title}
                </CardTitle>
                <PostStatusBadge status={post.status} />
              </div>
              <p className="text-muted-foreground text-lg">
                {post.excerpt}
              </p>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Penulis</p>
                  <p className="text-muted-foreground">{post.author?.fullName || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dibuat Pada</p>
                  <p className="text-muted-foreground">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Dipublikasikan Pada</p>
                    <p className="text-muted-foreground">{formatDate(post.publishedAt)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Tayangan</p>
                  <p className="text-muted-foreground">{post.viewCount} views</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Estimasi Waktu Baca</p>
                  <p className="text-muted-foreground">{post.readingTime} min read</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taksonomi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Kategori</p>
                {post.category ? (
                  <Badge variant="outline">{post.category.name}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Tidak ada kategori</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Tag</p>
                {post.tags && post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: TagType) => (
                      <Badge key={tag.id} variant="secondary" className="font-normal">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Tidak ada tag</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
