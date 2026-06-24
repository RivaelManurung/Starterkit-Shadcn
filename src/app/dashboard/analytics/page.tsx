"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMockData } from "@/hooks/use-mock-data"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Area, AreaChart, Pie, PieChart, Cell, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { useMemo } from "react"
import { TopPostsTable } from "@/components/dashboard/top-posts-table"

const areaConfig = {
  views: { label: "Views", color: "var(--chart-1)" },
  visitors: { label: "Visitors", color: "var(--chart-2)" },
} satisfies ChartConfig

const sourceConfig = {
  direct: { label: "Direct", color: "var(--chart-1)" },
  social: { label: "Social", color: "var(--chart-2)" },
  search: { label: "Search", color: "var(--chart-3)" },
  referral: { label: "Referral", color: "var(--chart-4)" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const { analytics } = useMockData()

  const data = useMemo(() => {
    return analytics.slice(-30).map(d => ({
      ...d,
      shortDate: format(new Date(d.date), "dd MMM", { locale: idLocale }),
      fullDate: format(new Date(d.date), "dd MMM yyyy", { locale: idLocale })
    }))
  }, [analytics])

  const sourceData = useMemo(() => {
    // Agregasi source
    let direct = 0, social = 0, search = 0, referral = 0
    data.forEach(d => {
      direct += d.sources.direct
      social += d.sources.social
      search += d.sources.search
      referral += d.sources.referral
    })
    return [
      { name: "Direct", value: direct, fill: "var(--chart-1)" },
      { name: "Social", value: social, fill: "var(--chart-2)" },
      { name: "Search", value: search, fill: "var(--chart-3)" },
      { name: "Referral", value: referral, fill: "var(--chart-4)" },
    ]
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analitik</h1>
        <p className="text-sm text-muted-foreground">
          Laporan terperinci mengenai trafik dan performa konten Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views vs Visitors (30 Hari)</CardTitle>
            <CardDescription>Perbandingan tayangan dan pengunjung unik.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaConfig} className="h-[300px] w-full">
              <AreaChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent labelKey="fullDate" />} />
                <Area type="monotone" dataKey="views" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} stackId="1" />
                <Area type="monotone" dataKey="visitors" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} stackId="2" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sumber Trafik</CardTitle>
            <CardDescription>Dari mana pengunjung Anda berasal.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ChartContainer config={sourceConfig} className="w-full h-full max-h-[300px]">
              <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopPostsTable />
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate (Daily)</CardTitle>
            <CardDescription>Rata-rata engagement rate per hari.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ rate: { label: "Rate (%)", color: "var(--chart-3)" } }} className="h-[300px] w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent labelKey="fullDate" />} />
                <Bar dataKey="engagementRate" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
