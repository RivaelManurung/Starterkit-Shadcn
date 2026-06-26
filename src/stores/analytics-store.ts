import { create } from "zustand"
import { mockAnalytics } from "@/constants/mock-data"

// Analytics store is mostly read-only, but could have date range filters
interface AnalyticsState {
  data: typeof mockAnalytics
  dateRange: {
    from: Date | null
    to: Date | null
  }
  
  // Actions
  setDateRange: (range: { from: Date | null; to: Date | null }) => void
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: mockAnalytics,
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  },
  
  setDateRange: (range) => set({ dateRange: range })
}))
