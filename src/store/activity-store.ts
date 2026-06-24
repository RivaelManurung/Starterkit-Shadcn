import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActivityLog } from '@/types';
import { activityData } from '@/lib/mock/data/activity-data';
import { generateId } from '@/lib/mock/utils';

interface ActivityState {
  logs: ActivityLog[];
  getLogs: (limit?: number, entityType?: string) => ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      logs: activityData,

      getLogs: (limit, entityType) => {
        let result = get().logs;
        if (entityType) {
          result = result.filter((log) => log.entityType === entityType);
        }
        // Logs are stored newest first in this implementation, so we just slice.
        // Let's sort to be safe:
        result = [...result].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (limit) {
          result = result.slice(0, limit);
        }
        return result;
      },

      addLog: (logData) => {
        const newLog: ActivityLog = {
          ...logData,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          logs: [newLog, ...state.logs], // prepend to keep newest first
        }));
      },

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'dsk-activity-storage',
      skipHydration: true,
    }
  )
);
