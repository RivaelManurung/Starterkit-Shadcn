import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Notification } from "@/types"
import { mockNotifications } from "@/constants/mock-data"

interface NotifikasiState {
  notifications: Notification[]
  unreadCount: number
  
  // New Actions
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotif: (id: string) => void
  addNotif: (notification: Omit<Notification, "id" | "createdAt" | "isRead" | "isArchived" | "isPinned" | "readAt" | "expiresAt">) => void
  deleteAll: () => void

  // Backward Compatibility Aliases
  markRead: (id: string) => void
  markAllRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead" | "isArchived" | "isPinned" | "readAt" | "expiresAt">) => void
}

export const useNotifikasiStore = create<NotifikasiState>()(
  persist(
    (set) => ({
      // Take the first 15 notifications from mockNotifications for the store seed
      notifications: mockNotifications.slice(0, 15),
      unreadCount: mockNotifications.slice(0, 15).filter(n => !n.isRead).length,
      
      markAsRead: (id) => set((state) => {
        const notifications = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
        )
        return {
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }
      }),
      
      markAllAsRead: () => set((state) => {
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
      
      deleteNotif: (id) => set((state) => {
        const notifications = state.notifications.filter(n => n.id !== id)
        return {
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }
      }),
      
      addNotif: (notificationData) => set((state) => {
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

      deleteAll: () => set({ notifications: [], unreadCount: 0 }),

      // Aliases
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
    }),
    {
      name: "notifikasi-store",
    }
  )
)

export const useNotificationStore = useNotifikasiStore
