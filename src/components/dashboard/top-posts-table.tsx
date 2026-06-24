"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePostStore } from "@/store/post-store"
import { truncate, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function TopPostsTable() {
  const getStats = usePostStore(state => state.getStats)
  const { recentPosts } = getStats()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Artikel Terbaru</CardTitle>
        <CardDescription>5 artikel yang baru saja dibuat.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {truncate(post.title, 40)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    Belum ada artikel.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
