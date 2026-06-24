"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
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
import { useCategoryStore } from "@/store/category-store"
import { useMemo } from "react"

const chartConfig = {
  posts: {
    label: "Artikel",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CategoryBar() {
  const getCategories = useCategoryStore(state => state.getCategories)
  
  const data = useMemo(() => {
    const categories = getCategories()
    return categories
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 6)
      .map(c => ({
        name: c.name,
        posts: c.postCount,
      }))
  }, [getCategories])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Artikel per Kategori</CardTitle>
        <CardDescription>Top 6 kategori dengan artikel terbanyak.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center min-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="posts"
              fill="var(--chart-1)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
