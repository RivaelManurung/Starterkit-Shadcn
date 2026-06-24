"use client"

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMockData } from "@/hooks/use-mock-data"
import { formatNumber } from "@/lib/utils"
import { useMemo } from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function OverviewChart() {
  const { analytics } = useMockData()
  
  const data = useMemo(() => {
    // Get last 30 days
    return analytics.slice(-30).map(d => ({
      ...d,
      formattedDate: format(new Date(d.date), "dd MMM yyyy", { locale: idLocale }),
      shortDate: format(new Date(d.date), "dd MMM", { locale: idLocale })
    }))
  }, [analytics])

  const totalViews = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.views, 0)
  }, [data])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Views 30 Hari Terakhir</CardTitle>
        <CardDescription>Total {formatNumber(totalViews)} tayangan pada periode ini.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="shortDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              content={<ChartTooltipContent labelKey="formattedDate" />}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
