import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Tag } from "@/types"
import { mockTags } from "@/lib/mock-data"

interface TagState {
  tags: Tag[]
  
  // Actions
  createTag: (tag: Partial<Tag>) => void
  updateTag: (id: string, data: Partial<Tag>) => void
  deleteTag: (id: string) => void
  
  // Specific Actions
  mergeTags: (sourceId: string, targetId: string) => void
  bulkDeleteTags: (ids: string[]) => void
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: mockTags,
      
      createTag: (tagData) => set((state) => {
        const newTag: Tag = {
          ...tagData,
          id: `tag_${Math.random().toString(36).substring(2, 11)}`,
          postCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Tag
        return { tags: [...state.tags, newTag] }
      }),
      
      updateTag: (id, data) => set((state) => ({
        tags: state.tags.map(t => 
          t.id === id ? { ...t, ...data, updatedAt: new Date() } : t
        )
      })),
      
      deleteTag: (id) => set((state) => ({
        tags: state.tags.filter(t => t.id !== id)
      })),
      
      mergeTags: (sourceId, targetId) => set((state) => {
        const sourceTag = state.tags.find(t => t.id === sourceId)
        if (!sourceTag) return state
        
        return {
          tags: state.tags.map(t => 
            t.id === targetId 
              ? { ...t, postCount: t.postCount + sourceTag.postCount, updatedAt: new Date() } 
              : t
          ).filter(t => t.id !== sourceId)
        }
      }),
      
      bulkDeleteTags: (ids) => set((state) => ({
        tags: state.tags.filter(t => !ids.includes(t.id))
      }))
    }),
    {
      name: "tag-store",
      version: 2,
      partialize: () => ({}),
    }
  )
)
