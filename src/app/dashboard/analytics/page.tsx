"use client"

import * as React from "react"
import { usePostStore } from "@/stores/post-store"
import { useAnalitikPeriod } from "@/features/analitik/hooks/useAnalitikPeriod"
import { AnalitikOverview } from "@/features/analitik/components/AnalitikOverview"
import { ViewsTrendChart } from "@/features/analitik/components/ViewsTrendChart"
import { ViewsPerKategoriChart } from "@/features/analitik/components/ViewsPerKategoriChart"
import { TopArtikelTable } from "@/features/analitik/components/TopArtikelTable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Post } from "@/types"

// Seed-based random generator to ensure stable, deterministic variation
function pseudoRand(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

export default function AnalyticsPage() {
  const posts = usePostStore((state) => state.posts)
  const [period, setPeriod] = useAnalitikPeriod()
  
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Trigger loading state for 500ms when period changes
  const handlePeriodChange = (val: string) => {
    setIsLoading(true)
    setPeriod(val)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }

  // Spreading the posts from Zustand over 365 days virtual dates
  const virtualPosts = React.useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.id.localeCompare(a.id))
    return sorted.map((p, index) => {
      const daysAgo = index * 7.3 // 50 posts spread over 365 days
      const virtualCreatedAt = new Date(new Date().getTime() - daysAgo * 24 * 60 * 60 * 1000)
      return {
        ...p,
        virtualCreatedAt,
      }
    })
  }, [posts])

  const periodStats = React.useMemo(() => {
    let daysLimit = 30
    let factor = 0.25
    if (period === "7d") {
      daysLimit = 7
      factor = 0.07
    } else if (period === "30d") {
      daysLimit = 30
      factor = 0.25
    } else if (period === "3m") {
      daysLimit = 90
      factor = 0.60
    } else if (period === "1y") {
      daysLimit = 365
      factor = 1.0
    }

    const now = new Date()
    const limitDate = new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000)

    // Compute scaled views and filter
    const postsWithPeriodViews = virtualPosts.map((p) => {
      let periodViews = 0
      if (p.status === "published") {
        const totalViews = p.viewCount || 0
        const randVal = pseudoRand(p.id)
        
        // Scale by period and age
        const ageInDays = (now.getTime() - p.virtualCreatedAt.getTime()) / (24 * 60 * 60 * 1000)
        const timeFraction = Math.min(factor, ageInDays / 365)
        const variance = 0.85 + randVal * 0.3 // +/- 15% variation
        
        periodViews = Math.floor(totalViews * timeFraction * variance)
        
        if (periodViews > totalViews) periodViews = totalViews
        if (periodViews < 0) periodViews = 0
      }
      return {
        ...p,
        periodViews,
      }
    })

    // Calculate total views
    const totalViews = postsWithPeriodViews.reduce((sum, p) => sum + p.periodViews, 0)

    // Count new posts created in this period
    const newPostsCount = virtualPosts.filter((p) => p.virtualCreatedAt >= limitDate).length

    // Rata-rata views per artikel yang diterbitkan
    const publishedCount = postsWithPeriodViews.filter((p) => p.status === "published").length
    const averageViews = publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0

    // New posts this month
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const newPostsThisMonth = virtualPosts.filter((p) => {
      const date = p.virtualCreatedAt
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    // Top 10 posts by views in period
    const topPosts = [...postsWithPeriodViews]
      .sort((a, b) => b.periodViews - a.periodViews)
      .slice(0, 10) as (Post & { periodViews: number })[]

    // Views per Category
    const categoryViewsMap: Record<string, number> = {}
    postsWithPeriodViews.forEach((p) => {
      const catName = p.category?.name || "Lainnya"
      categoryViewsMap[catName] = (categoryViewsMap[catName] || 0) + p.periodViews
    })

    const categoryData = Object.entries(categoryViewsMap)
      .map(([name, views], idx) => ({
        category: name,
        views,
        fill: `var(--chart-${(idx % 5) + 1})`,
      }))
      .sort((a, b) => b.views - a.views)

    return {
      totalViews,
      newPostsCount,
      averageViews,
      newPostsThisMonth,
      topPosts,
      categoryData,
      daysLimit,
    }
  }, [virtualPosts, period])

  const trendData = React.useMemo(() => {
    const points: { label: string; fullDate: string; views: number }[] = []
    const now = new Date()
    const { totalViews } = periodStats

    if (period === "7d") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const label = format(date, "eee", { locale: idLocale })
        const fullDate = format(date, "dd MMMM yyyy", { locale: idLocale })
        points.push({ label, fullDate, views: 0 })
      }
    } else if (period === "30d") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const label = format(date, "dd MMM", { locale: idLocale })
        const fullDate = format(date, "dd MMMM yyyy", { locale: idLocale })
        points.push({ label, fullDate, views: 0 })
      }
    } else if (period === "3m") {
      for (let i = 89; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const label = format(date, "dd MMM", { locale: idLocale })
        const fullDate = format(date, "dd MMMM yyyy", { locale: idLocale })
        points.push({ label, fullDate, views: 0 })
      }
    } else if (period === "1y") {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = format(date, "MMM yy", { locale: idLocale })
        const fullDate = format(date, "MMMM yyyy", { locale: idLocale })
        points.push({ label, fullDate, views: 0 })
      }
    }

    const rawWeights = points.map((p, idx) => {
      const wave = Math.sin(idx * 0.5) * 0.3 + 1.0
      let weekendFactor = 1.0
      if (period !== "1y") {
        let dateObj: Date
        if (period === "7d") dateObj = new Date(now.getTime() - (6 - idx) * 24 * 60 * 60 * 1000)
        else if (period === "30d") dateObj = new Date(now.getTime() - (29 - idx) * 24 * 60 * 60 * 1000)
        else dateObj = new Date(now.getTime() - (89 - idx) * 24 * 60 * 60 * 1000)
        
        const day = dateObj.getDay()
        if (day === 0 || day === 6) {
          weekendFactor = 0.65
        }
      }
      const pseudoNoise = 0.95 + (((idx * 17.31) % 100) / 100) * 0.1
      return wave * weekendFactor * pseudoNoise
    })

    const totalWeight = rawWeights.reduce((s, w) => s + w, 0)
    points.forEach((p, idx) => {
      p.views = Math.round((rawWeights[idx] / totalWeight) * totalViews)
    })

    return points
  }, [period, periodStats])

  const subtextConfig = React.useMemo(() => {
    switch (period) {
      case "7d":
        return {
          views: "+4.3% dibanding minggu lalu",
          articles: `+${periodStats.newPostsCount} artikel baru minggu ini`,
          average: "+1.8% dibanding minggu lalu",
        }
      case "30d":
        return {
          views: "+12.5% dibanding bulan lalu",
          articles: `+${periodStats.newPostsCount} artikel baru bulan ini`,
          average: "+3.1% dibanding bulan lalu",
        }
      case "3m":
        return {
          views: "+18.2% dibanding 3 bulan lalu",
          articles: `+${periodStats.newPostsCount} artikel baru 3 bulan ini`,
          average: "+5.4% dibanding 3 bulan lalu",
        }
      case "1y":
      default:
        return {
          views: "+24.7% dibanding tahun lalu",
          articles: `+${periodStats.newPostsCount} artikel baru tahun ini`,
          average: "+8.2% dibanding tahun lalu",
        }
    }
  }, [period, periodStats.newPostsCount])

  const currentMonthName = React.useMemo(() => {
    return format(new Date(), "MMMM yyyy", { locale: idLocale })
  }, [])

  const showLoader = !mounted || isLoading

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Segmented Period Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Analitik
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Laporan terperinci mengenai trafik dan performa konten Anda.
          </p>
        </div>

        <Tabs value={period || "30d"} onValueChange={handlePeriodChange} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-[360px] bg-muted/60 backdrop-blur-sm border border-border/20 rounded-xl p-1">
            <TabsTrigger value="7d" className="rounded-lg text-xs font-semibold py-2">7 Hari</TabsTrigger>
            <TabsTrigger value="30d" className="rounded-lg text-xs font-semibold py-2">30 Hari</TabsTrigger>
            <TabsTrigger value="3m" className="rounded-lg text-xs font-semibold py-2">3 Bulan</TabsTrigger>
            <TabsTrigger value="1y" className="rounded-lg text-xs font-semibold py-2">1 Tahun</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <AnalitikOverview
        isLoading={showLoader}
        totalViews={periodStats.totalViews}
        totalPosts={posts.length}
        averageViews={periodStats.averageViews}
        newPostsThisMonth={periodStats.newPostsThisMonth}
        currentMonthName={currentMonthName}
        subtextConfig={subtextConfig}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewsTrendChart isLoading={showLoader} data={trendData} period={period || "30d"} />
        <ViewsPerKategoriChart isLoading={showLoader} data={periodStats.categoryData} />
      </div>

      {/* Top 10 Articles Table */}
      <TopArtikelTable isLoading={showLoader} data={periodStats.topPosts} />
    </div>
  )
}
