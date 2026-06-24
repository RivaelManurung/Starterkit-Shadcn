import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/types';
import { categoriesData } from '@/lib/mock/data/categories-data';
import { generateId, generateSlug } from '@/lib/mock/utils';
import { useActivityStore } from './activity-store';
import { useNotificationStore } from './notification-store';

interface CategoryState {
  categories: Category[];
  getCategories: () => Category[];
  getCategory: (id: string) => Category | undefined;
  createCategory: (data: Omit<Category, 'id' | 'slug' | 'postCount' | 'createdAt' | 'updatedAt'>) => Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  incrementPostCount: (id: string) => void;
  decrementPostCount: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: categoriesData,

      getCategories: () => get().categories,

      getCategory: (id) => get().categories.find((c) => c.id === id),

      createCategory: (data) => {
        const newCategory: Category = {
          ...data,
          id: generateId(),
          slug: generateSlug(data.name),
          postCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ categories: [...state.categories, newCategory] }));

        useActivityStore.getState().addLog({
          action: 'CATEGORY_CREATED',
          userId: 'system', // Akan diganti jika ada useAuth/settings
          entityId: newCategory.id,
          entityType: 'Category',
          entityTitle: newCategory.name,
        });

        useNotificationStore.getState().addNotification({
          type: 'SUCCESS',
          title: 'Kategori Dibuat',
          message: `Kategori "${newCategory.name}" berhasil ditambahkan.`,
          link: '/categories',
        });

        return newCategory;
      },

      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        const cat = get().categories.find(c => c.id === id);
        if (!cat) return;

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));

        useActivityStore.getState().addLog({
          action: 'CATEGORY_DELETED',
          userId: 'system',
          entityId: id,
          entityType: 'Category',
          entityTitle: cat.name,
        });

        useNotificationStore.getState().addNotification({
          type: 'INFO',
          title: 'Kategori Dihapus',
          message: `Kategori "${cat.name}" telah dihapus.`,
        });
      },

      incrementPostCount: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, postCount: c.postCount + 1 } : c
          ),
        }));
      },

      decrementPostCount: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, postCount: Math.max(0, c.postCount - 1) } : c
          ),
        }));
      },
    }),
    {
      name: 'dsk-category-storage',
      skipHydration: true,
    }
  )
);
