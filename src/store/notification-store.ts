import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/types';
import { notificationsData } from '@/lib/mock/data/notifications-data';
import { generateId } from '@/lib/mock/utils';

interface NotificationState {
  notifications: Notification[];
  getUnreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: notificationsData,

      getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => set({ notifications: [] }),

      addNotification: (data) => {
        const newNotif: Notification = {
          ...data,
          id: generateId(),
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },
    }),
    {
      name: 'dsk-notification-storage',
      skipHydration: true,
    }
  )
);
