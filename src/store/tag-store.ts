import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag } from '@/types';
import { tagsData } from '@/lib/mock/data/tags-data';
import { generateId, generateSlug } from '@/lib/mock/utils';
import { useActivityStore } from './activity-store';
import { useNotificationStore } from './notification-store';

interface TagState {
  tags: Tag[];
  getTags: () => Tag[];
  getTag: (id: string) => Tag | undefined;
  createTag: (data: Omit<Tag, 'id' | 'slug' | 'postCount' | 'createdAt'>) => Tag;
  updateTag: (id: string, data: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  incrementPostCount: (id: string) => void;
  decrementPostCount: (id: string) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: tagsData,

      getTags: () => get().tags,

      getTag: (id) => get().tags.find((t) => t.id === id),

      createTag: (data) => {
        const newTag: Tag = {
          ...data,
          id: generateId(),
          slug: generateSlug(data.name),
          postCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ tags: [...state.tags, newTag] }));

        useActivityStore.getState().addLog({
          action: 'TAG_CREATED',
          userId: 'system',
          entityId: newTag.id,
          entityType: 'Tag',
          entityTitle: newTag.name,
        });

        useNotificationStore.getState().addNotification({
          type: 'SUCCESS',
          title: 'Tag Dibuat',
          message: `Tag "${newTag.name}" berhasil ditambahkan.`,
          link: '/tags',
        });

        return newTag;
      },

      updateTag: (id, data) => {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteTag: (id) => {
        const tag = get().tags.find(t => t.id === id);
        if (!tag) return;

        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        }));

        useActivityStore.getState().addLog({
          action: 'TAG_DELETED',
          userId: 'system',
          entityId: id,
          entityType: 'Tag',
          entityTitle: tag.name,
        });

        useNotificationStore.getState().addNotification({
          type: 'INFO',
          title: 'Tag Dihapus',
          message: `Tag "${tag.name}" telah dihapus.`,
        });
      },

      incrementPostCount: (id) => {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, postCount: t.postCount + 1 } : t
          ),
        }));
      },

      decrementPostCount: (id) => {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, postCount: Math.max(0, t.postCount - 1) } : t
          ),
        }));
      },
    }),
    {
      name: 'dsk-tag-storage',
      skipHydration: true,
    }
  )
);
