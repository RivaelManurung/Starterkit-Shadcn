import { useNotificationStore } from "@/stores/notification-store"

export function useNotifications() {
  const notifications = useNotificationStore(state => state.notifications)
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const addNotification = useNotificationStore(state => state.addNotification)
  const markRead = useNotificationStore(state => state.markRead)
  const markAllRead = useNotificationStore(state => state.markAllRead)

  return {
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead
  }
}
