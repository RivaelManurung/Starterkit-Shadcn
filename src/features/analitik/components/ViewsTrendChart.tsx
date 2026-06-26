"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"

interface ViewsTrendChartProps {
  isLoading: boolean
  data: { label: string; fullDate: string; views: number }[]
  period: string
}

export function ViewsTrendChart({ isLoading, data, period }: ViewsTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border/30 shadow-sm bg-card/50 backdrop-blur-md">
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const periodLabel = 
    period === "7d" ? "7 Hari" : 
    period === "30d" ? "30 Hari" : 
    period === "3m" ? "3 Bulan" : "1 Tahun"

  return (
    <Card className="border-border/30 shadow-sm bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Tren Views Per Hari</CardTitle>
        <CardDescription>
          Grafik performa total views dalam periode {periodLabel}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ views: { label: "Views", color: "var(--chart-1)" } }}
          className="h-[300px] w-full"
        >
          <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={period === "3m" ? 9 : period === "30d" ? 2 : 0}
            />
            <Tooltip content={<ChartTooltipContent labelKey="fullDate" />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
