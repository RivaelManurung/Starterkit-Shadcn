import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { usersData } from '@/lib/mock/data/users-data';
import { generateId } from '@/lib/mock/utils';
import { useActivityStore } from './activity-store';
import { useNotificationStore } from './notification-store';

interface UserState {
  users: User[];
  getUsers: () => User[];
  getUser: (id: string) => User | undefined;
  createUser: (data: Omit<User, 'id' | 'postCount' | 'createdAt' | 'updatedAt'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  deleteUser: (id: string) => void;
  incrementPostCount: (id: string) => void;
  decrementPostCount: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: usersData,

      getUsers: () => get().users,

      getUser: (id) => get().users.find((u) => u.id === id),

      createUser: (data) => {
        const newUser: User = {
          ...data,
          id: generateId(),
          postCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ users: [...state.users, newUser] }));

        useActivityStore.getState().addLog({
          action: 'USER_CREATED',
          userId: 'system',
          entityId: newUser.id,
          entityType: 'User',
          entityTitle: newUser.name,
        });

        useNotificationStore.getState().addNotification({
          type: 'SUCCESS',
          title: 'Pengguna Dibuat',
          message: `Pengguna "${newUser.name}" berhasil ditambahkan.`,
          link: '/users',
        });

        return newUser;
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u
          ),
        }));

        useActivityStore.getState().addLog({
          action: 'USER_UPDATED',
          userId: 'system',
          entityId: id,
          entityType: 'User',
          entityTitle: data.name || id,
        });
      },

      updateUserRole: (id, role) => {
        const user = get().users.find(u => u.id === id);
        if (!user || user.role === role) return;

        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, role, updatedAt: new Date().toISOString() } : u
          ),
        }));

        useActivityStore.getState().addLog({
          action: 'USER_ROLE_CHANGED',
          userId: 'system',
          entityId: id,
          entityType: 'User',
          entityTitle: user.name,
          meta: { before: user.role, after: role },
        });

        useNotificationStore.getState().addNotification({
          type: 'INFO',
          title: 'Role Pengguna Diperbarui',
          message: `Role "${user.name}" telah diubah menjadi ${role}.`,
        });
      },

      deleteUser: (id) => {
        const user = get().users.find(u => u.id === id);
        if (!user) return;

        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));

        useActivityStore.getState().addLog({
          action: 'USER_UPDATED', // Menggunakan USER_UPDATED sebagai fallback jika tidak ada USER_DELETED di enum
          userId: 'system',
          entityId: id,
          entityType: 'User',
          entityTitle: user.name,
        });
      },

      incrementPostCount: (id) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, postCount: u.postCount + 1 } : u
          ),
        }));
      },

      decrementPostCount: (id) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, postCount: Math.max(0, u.postCount - 1) } : u
          ),
        }));
      },
    }),
    {
      name: 'dsk-user-storage',
      skipHydration: true,
    }
  )
);
