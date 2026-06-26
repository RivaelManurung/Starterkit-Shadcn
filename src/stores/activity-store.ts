import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ActivityLog, User } from "@/types"
import { mockActivityLogs } from "@/constants/mock-data"

interface ActivityState {
  logs: ActivityLog[]
  
  // Actions
  addLog: (log: Omit<ActivityLog, "id" | "createdAt">) => void
  clearOldLogs: (daysToKeep: number) => void
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      logs: mockActivityLogs,
      
      addLog: (logData) => set((state) => {
        const newLog: ActivityLog = {
          ...logData,
          id: `log_${Math.random().toString(36).substring(2, 11)}`,
          createdAt: new Date()
        }
        return { logs: [newLog, ...state.logs] }
      }),
      
      clearOldLogs: (daysToKeep) => set((state) => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
        
        return {
          logs: state.logs.filter(log => new Date(log.createdAt) >= cutoffDate)
        }
      })
    }),
    {
      name: "activity-store",
    }
  )
)

// Helper function to be used across the app without importing the whole store hook
export const logActivity = (
  action: ActivityLog["action"],
  entity: ActivityLog["entity"],
  entityId: string,
  entityTitle: string,
  description: string,
  user: User | null,
  details?: {
    oldValue?: Record<string, unknown> | null,
    newValue?: Record<string, unknown> | null,
    status?: "success" | "failed" | "partial",
    metadata?: Record<string, unknown>
  }
) => {
  useActivityStore.getState().addLog({
    action,
    entity,
    entityId,
    entityTitle,
    description,
    oldValue: details?.oldValue || null,
    newValue: details?.newValue || null,
    userId: user.id,
    user,
    ipAddress: "192.168.1.100", // In a real app this would come from request/headers
    userAgent: navigator.userAgent,
    sessionId: "sess_current",
    duration: Math.floor(Math.random() * 200) + 10,
    status: details?.status || "success",
    metadata: details?.metadata || {}
  })
}
