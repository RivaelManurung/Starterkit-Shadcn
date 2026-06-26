"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/themes/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { StoreHydrator } from "@/components/store-hydrator"
import { useRealtimeSimulator } from "@/lib/realtime-simulator"
import { KBarClientProvider } from "@/components/kbar/KBarClientProvider"
import { CommandPalette } from "@/components/kbar/CommandPalette"
import { queryClient } from "@/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"

// Separate component for simulator so it only runs on client
const Simulator = () => {
  useRealtimeSimulator()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Use state to prevent hydration mismatch for theme from settings
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider defaultTheme="system">
      <KBarClientProvider>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <TooltipProvider delay={0}>
              {children}
            </TooltipProvider>
            <CommandPalette />
            <StoreHydrator />
            <Toaster position="top-right" />
            {mounted && <Simulator />}
          </NuqsAdapter>
        </QueryClientProvider>
      </KBarClientProvider>
    </ThemeProvider>
  )
}
