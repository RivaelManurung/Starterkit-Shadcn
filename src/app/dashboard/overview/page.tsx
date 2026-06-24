"use client"

import { FileText, Eye, CheckCircle, Users } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { StatusDonut } from "@/components/dashboard/status-donut"
import { TopPostsTable } from "@/components/dashboard/top-posts-table"
import { CategoryBar } from "@/components/dashboard/category-bar"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { usePostStore } from "@/stores/post-store"
import { formatNumber } from "@/lib/utils"

export default function OverviewPage() {
  const getStats = usePostStore(state => state.getStats)
  const stats = getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa dan aktivitas dashboard Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Total Artikel"
          value={formatNumber(stats.totalPosts)}
          icon={FileText}
          trend={stats.postsTrend}
        />
        <KPICard
          title="Total Dilihat"
          value={formatNumber(stats.totalViews)}
          icon={Eye}
          trend={stats.viewsTrend}
        />
        <KPICard
          title="Dipublikasikan"
          value={formatNumber(stats.publishedPosts)}
          icon={CheckCircle}
          trendLabel="total aktif"
        />
        <KPICard
          title="Total Pengguna"
          value={formatNumber(stats.totalUsers)}
          icon={Users}
          trendLabel="terdaftar"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <OverviewChart />
        </div>
        <div className="xl:col-span-4">
          <StatusDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <TopPostsTable />
        </div>
        <div className="xl:col-span-5">
          <CategoryBar />
        </div>
      </div>

      <div className="pb-8">
        <QuickActions />
      </div>
    </div>
  )
}
