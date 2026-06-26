"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface ViewsPerKategoriChartProps {
  isLoading: boolean
  data: { category: string; views: number; fill: string }[]
}

export function ViewsPerKategoriChart({ isLoading, data }: ViewsPerKategoriChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border/40 shadow-sm">
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

  return (
    <Card className="border-border/30 shadow-sm bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Views Per Kategori</CardTitle>
        <CardDescription>Distribusikan total tayangan artikel berdasarkan kategori utama.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 25, right: 10, top: 5, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="views" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
