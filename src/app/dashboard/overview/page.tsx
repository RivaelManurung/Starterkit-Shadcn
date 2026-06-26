"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { FileText, Eye, Users, Activity, DollarSign } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { TopUsersTable } from "@/components/dashboard/top-users-table"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed"
import { NotificationsPreview } from "@/components/dashboard/notifications-preview"
import { DatePickerWithRange } from "@/components/shared/date-range-picker"
import { usePostStore } from "@/stores/post-store"
import { formatNumber } from "@/lib/utils"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

// Dynamically import chart components with ssr: false
const OverviewChart = dynamic(
  () => import("@/components/dashboard/overview-chart").then((m) => m.OverviewChart),
  {
    ssr: false,
    loading: () => <div className="h-[350px] bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
)

const CategoryBar = dynamic(
  () => import("@/components/dashboard/category-bar").then((m) => m.CategoryBar),
  {
    ssr: false,
    loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-xl w-full" />,
  }
)

const QuickActions = dynamic(
  () => import("@/components/dashboard/quick-actions").then((m) => m.QuickActions),
  {
    ssr: false,
  }
)

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted/40 animate-pulse rounded w-48" />
          <div className="h-4 bg-muted/40 animate-pulse rounded w-80" />
        </div>
        <div className="h-10 bg-muted/40 animate-pulse rounded w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/20 animate-pulse rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 h-[350px] bg-muted/20 animate-pulse rounded-xl" />
        <div className="xl:col-span-4 h-[350px] bg-muted/20 animate-pulse rounded-xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 h-80 bg-muted/20 animate-pulse rounded-xl" />
        <div className="xl:col-span-4 h-80 bg-muted/20 animate-pulse rounded-xl" />
        <div className="xl:col-span-4 h-80 bg-muted/20 animate-pulse rounded-xl" />
      </div>
    </div>
  )
}

function OverviewPageContent() {
  const getStats = usePostStore(state => state.getStats)
  const stats = getStats()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

export default function OverviewPage() {
  return (
    <React.Suspense fallback={<OverviewSkeleton />}>
      <OverviewPageContent />
    </React.Suspense>
  )
}

