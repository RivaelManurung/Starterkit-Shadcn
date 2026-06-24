import * as React from "react"
import { LucideIcon, FileX2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = FileX2,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50", className)}>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        <p className="mt-2 mb-8 text-center text-sm font-normal leading-6 text-muted-foreground">
          {description}
        </p>
        {action}
      </div>
    </div>
  )
}
