import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, User } from '@/types';
import { useUserStore } from './user-store';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (data: Partial<AppSettings>) => void;
  resetSettings: () => void;
  getCurrentUser: () => User | undefined;
}

const defaultSettings: AppSettings = {
  siteName: 'StarterKit Dashboard',
  siteDescription: 'Platform manajemen konten modern.',
  defaultPostStatus: 'DRAFT',
  postsPerPage: 10,
  currentUserId: 'u1', // Default to ADMIN
  theme: 'system',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (data) => {
        set((state) => ({
          settings: { ...state.settings, ...data },
        }));
      },

      resetSettings: () => set({ settings: defaultSettings }),

      getCurrentUser: () => {
        const userId = get().settings.currentUserId;
        return useUserStore.getState().getUser(userId);
      },
    }),
    {
      name: 'dsk-settings-storage',
      skipHydration: true,
    }
  )
);
