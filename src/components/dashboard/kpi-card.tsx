"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
}

export function KPICard({ title, value, icon: Icon, trend, trendLabel }: KPICardProps) {
  // Suppress hydration mismatch: only render dynamic value on client
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-mono font-bold" suppressHydrationWarning>
          {mounted ? value : "—"}
        </div>
        {mounted && trend !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend >= 0 ? "text-green-500" : "text-destructive"}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>{" "}
            {trendLabel || "vs bulan lalu"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
