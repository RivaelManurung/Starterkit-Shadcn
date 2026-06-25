import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Category } from "@/types"
import { mockCategories } from "@/lib/mock-data"

interface CategoryState {
  categories: Category[]
  
  // Actions
  createCategory: (category: Partial<Category>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Specific Actions
  reorderCategories: (orderedIds: string[]) => void
  moveToParent: (id: string, newParentId: string | null) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: mockCategories,
      
      createCategory: (categoryData) => set((state) => {
        const newCategory: Category = {
          ...categoryData,
          id: `cat_${Math.random().toString(36).substring(2, 11)}`,
          postCount: 0,
          children: [],
          createdAt: new Date(),
          updatedAt: new Date()
        } as Category
        return { categories: [...state.categories, newCategory] }
      }),
      
      updateCategory: (id, data) => set((state) => ({
        categories: state.categories.map((c) => 
          c.id === id ? { ...c, ...data, updatedAt: new Date() } : c
        )
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id && c.parentId !== id) // simplified cascade
      })),
      
      reorderCategories: (orderedIds) => set((state) => {
        const newCategories = [...state.categories]
        orderedIds.forEach((id, index) => {
          const catIndex = newCategories.findIndex(c => c.id === id)
          if (catIndex !== -1) {
            newCategories[catIndex] = { ...newCategories[catIndex], order: index + 1, updatedAt: new Date() }
          }
        })
        return { categories: newCategories }
      }),
      
      moveToParent: (id, newParentId) => set((state) => ({
        categories: state.categories.map((c) => 
          c.id === id ? { ...c, parentId: newParentId, updatedAt: new Date() } : c
        )
      }))
    }),
    {
      name: "category-store",
      version: 2,
      partialize: () => ({}),
    }
  )
)
