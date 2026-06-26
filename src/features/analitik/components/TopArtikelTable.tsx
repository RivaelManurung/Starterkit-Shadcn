"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { truncate } from "@/lib/utils"
import { Post } from "@/types"

interface TopArtikelTableProps {
  isLoading: boolean
  data: (Post & { periodViews: number })[]
}

export function TopArtikelTable({ isLoading, data }: TopArtikelTableProps) {
  if (isLoading) {
    return (
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/30 shadow-sm bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Top 10 Artikel Terpopuler</CardTitle>
        <CardDescription>Artikel dengan performa tayangan terbaik pada periode ini.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[80px] font-semibold">Peringkat</TableHead>
              <TableHead className="font-semibold">Judul</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold text-right">Tayangan</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((post, index) => (
                <TableRow key={post.id} className="border-border/40">
                  <TableCell className="font-bold text-muted-foreground text-sm pl-4">
                    #{index + 1}
                  </TableCell>
                  <TableCell className="font-medium max-w-[280px] sm:max-w-[400px]">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="hover:underline hover:text-primary transition-colors text-sm font-semibold truncate block"
                    >
                      {truncate(post.title, 60)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground font-medium">
                      {post.category?.name || "Lainnya"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-sm tabular-nums">
                    {post.periodViews.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "draft"
                          ? "secondary"
                          : post.status === "archived"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-[10px] capitalize font-semibold tracking-wide"
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Tidak ada artikel populer yang ditemukan untuk periode ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
