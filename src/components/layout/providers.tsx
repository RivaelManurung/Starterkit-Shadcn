"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { StoreHydrator } from "@/components/store-hydrator"
import { useRealtimeSimulator } from "@/lib/realtime-simulator"

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
      <TooltipProvider delay={0}>
        {children}
      </TooltipProvider>
      <StoreHydrator />
      <Toaster position="top-right" />
      {mounted && <Simulator />}
    </ThemeProvider>
  )
}
