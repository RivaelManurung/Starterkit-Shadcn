import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Notification } from "@/types"
import { mockNotifications } from "@/lib/mock-data"

interface NotificationPreferences {
  email: boolean
  inApp: boolean
  push: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  
  // Actions
  markRead: (id: string) => void
  markAllRead: () => void
  deleteNotification: (id: string) => void
  deleteAll: () => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead" | "isArchived" | "isPinned" | "readAt" | "expiresAt">) => void
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.isRead).length,
      preferences: {
        email: true,
        inApp: true,
        push: false
      },
      
      markRead: (id) => set((state) => {
        const notifications = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
        )
        return {
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }
      }),
      
      markAllRead: () => set((state) => {
        const notifications = state.notifications.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date()
        }))
        return {
          notifications,
          unreadCount: 0
        }
      }),
      
      deleteNotification: (id) => set((state) => {
        const notifications = state.notifications.filter(n => n.id !== id)
        return {
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }
      }),
      
      deleteAll: () => set({ notifications: [], unreadCount: 0 }),
      
      addNotification: (notificationData) => set((state) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Math.random().toString(36).substring(2, 11)}`,
          isRead: false,
          isArchived: false,
          isPinned: false,
          createdAt: new Date(),
          readAt: null,
          expiresAt: null
        }
        
        const notifications = [newNotification, ...state.notifications]
        return {
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }
      }),
      
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      }))
    }),
    {
      name: "notification-store",
      version: 2,
      partialize: (state) => ({ preferences: state.preferences }),
      migrate: (persistedState: any, version: number) => {
        // Reset to initial state on version change
        return { preferences: { email: true, inApp: true, push: false } }
      },
    }
  )
)
