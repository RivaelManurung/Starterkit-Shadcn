"use client"

import * as React from "react"
import { FileText, Eye, Users, Activity, DollarSign } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { StatusDonut } from "@/components/dashboard/status-donut"
import { TopPostsTable } from "@/components/dashboard/top-posts-table"
import { CategoryBar } from "@/components/dashboard/category-bar"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed"
import { TopUsersTable } from "@/components/dashboard/top-users-table"
import { NotificationsPreview } from "@/components/dashboard/notifications-preview"
import { DatePickerWithRange } from "@/components/shared/date-range-picker"
import { usePostStore } from "@/stores/post-store"
import { formatNumber } from "@/lib/utils"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

export default function OverviewPage() {
  const getStats = usePostStore(state => state.getStats)
  const stats = getStats()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan performa dan aktivitas dashboard Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Total Pengguna"
          value={formatNumber(stats.totalUsers)}
          icon={Users}
          trend={12}
          trendLabel="Bulan ini"
        />
        <KPICard
          title="Total Artikel"
          value={formatNumber(stats.totalPosts)}
          icon={FileText}
          trend={stats.postsTrend}
        />
        <KPICard
          title="Revenue (Mock)"
          value="Rp 12.5M"
          icon={DollarSign}
          trend={5}
          trendLabel="Bulan ini"
        />
        <KPICard
          title="Aktivitas"
          value="1,234"
          icon={Activity}
          trend={-2}
          trendLabel="Minggu ini"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <OverviewChart />
        </div>
        <div className="xl:col-span-4">
          <NotificationsPreview />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <CategoryBar />
        </div>
        <div className="xl:col-span-4">
          <TopUsersTable />
        </div>
        <div className="xl:col-span-4">
          <RecentActivityFeed />
        </div>
      </div>

      <div className="pb-8">
        <QuickActions />
      </div>
    </div>
  )
}
