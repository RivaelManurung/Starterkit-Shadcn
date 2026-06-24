"use client"

import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts"
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
import { useMemo } from "react"

const chartConfig = {
  published: { label: "Published", color: "var(--chart-1)" },
  draft: { label: "Draft", color: "var(--chart-2)" },
  archived: { label: "Archived", color: "var(--chart-3)" },
  scheduled: { label: "Scheduled", color: "var(--chart-4)" },
} satisfies ChartConfig

export function StatusDonut() {
  const { posts } = useMockData()

  const data = useMemo(() => {
    let pub = 0, drf = 0, arc = 0, sch = 0
    posts.forEach(p => {
      if (p.status === "published") pub++
      else if (p.status === "draft") drf++
      else if (p.status === "archived") arc++
      else if (p.status === "scheduled") sch++
    })

    return [
      { name: 'Published', value: pub, fill: "var(--chart-1)" },
      { name: 'Draft', value: drf, fill: "var(--chart-2)" },
      { name: 'Archived', value: arc, fill: "var(--chart-3)" },
      { name: 'Scheduled', value: sch, fill: "var(--chart-4)" },
    ].filter(d => d.value > 0)
  }, [posts])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Komposisi Status</CardTitle>
        <CardDescription>Distribusi status semua artikel.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
