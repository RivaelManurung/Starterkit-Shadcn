"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, FileText, TrendingUp, Calendar, Sparkles } from "lucide-react"

interface AnalitikOverviewProps {
  isLoading: boolean
  totalViews: number
  totalPosts: number
  averageViews: number
  newPostsThisMonth: number
  currentMonthName: string
  subtextConfig: {
    views: string
    articles: string
    average: string
  }
}

export function AnalitikOverview({
  isLoading,
  totalViews,
  totalPosts,
  averageViews,
  newPostsThisMonth,
  currentMonthName,
  subtextConfig,
}: AnalitikOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
      {/* Card 1: Total Views */}
      <Card className="relative overflow-hidden border-border/30 hover:border-border/60 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          <div className="p-2 rounded-xl bg-chart-1/10 text-chart-1">
            <Eye className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {totalViews.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold">{subtextConfig.views.split(" ")[0]}</span>
            <span className="text-muted-foreground/80">
              {subtextConfig.views.substring(subtextConfig.views.indexOf(" ") + 1)}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Total Artikel */}
      <Card className="relative overflow-hidden border-border/30 hover:border-border/60 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Artikel</CardTitle>
          <div className="p-2 rounded-xl bg-chart-2/10 text-chart-2">
            <FileText className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{totalPosts}</div>
          <p className="text-xs text-muted-foreground mt-1">{subtextConfig.articles}</p>
        </CardContent>
      </Card>

      {/* Card 3: Rata-rata Views/Artikel */}
      <Card className="relative overflow-hidden border-border/30 hover:border-border/60 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Views/Artikel</CardTitle>
          <div className="p-2 rounded-xl bg-chart-3/10 text-chart-3">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {averageViews.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold">{subtextConfig.average.split(" ")[0]}</span>
            <span className="text-muted-foreground/80">
              {subtextConfig.average.substring(subtextConfig.average.indexOf(" ") + 1)}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Artikel Baru Bulan Ini */}
      <Card className="relative overflow-hidden border-border/30 hover:border-border/60 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Artikel Baru Bulan Ini</CardTitle>
          <div className="p-2 rounded-xl bg-chart-4/10 text-chart-4">
            <Calendar className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight flex items-center gap-1.5">
            {newPostsThisMonth}
            {newPostsThisMonth > 0 && <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Bulan {currentMonthName}</p>
        </CardContent>
      </Card>
    </div>
  )
}
