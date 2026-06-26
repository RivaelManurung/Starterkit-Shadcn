import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Post, PostStatus } from "@/types"
import { mockPosts } from "@/constants/mock-data"

interface PostFilters {
  search: string
  statuses: PostStatus[]
  categories: string[]
  tags: string[]
  authorId: string | null
  visibility: Post["visibility"][]
  featured: boolean | null
  dateFrom?: string | null
  dateTo?: string | null
  page?: number
  status?: string
  categoryId?: string | null
}

interface PostState {
  posts: Post[]
  filters: PostFilters
  viewMode: "table" | "grid"
  
  // Actions
  setFilters: (filters: Partial<PostFilters>) => void
  resetFilters: () => void
  setViewMode: (mode: "table" | "grid") => void
  
  // CRUD
  createPost: (post: Partial<Post>) => void
  updatePost: (id: string, data: Partial<Post>) => void
  bulkUpdateStatus: (ids: string[], status: string) => void
  bulkDeletePosts: (ids: string[]) => void
  deletePost: (id: string) => void
  
  getStats: () => { totalPosts: number, totalViews: number, publishedPosts: number, totalUsers: number, postsTrend: number, viewsTrend: number }
  getPost: (id: string) => Post | undefined
  incrementView: (id: string) => void
  
  // Specific Actions
  publishPost: (id: string) => void
  unpublishPost: (id: string) => void
  schedulePost: (id: string, date: Date) => void
  archivePost: (id: string) => void
  duplicatePost: (id: string, newAuthorId: string) => void
}

const defaultFilters: PostFilters = {
  search: "",
  statuses: [],
  categories: [],
  tags: [],
  authorId: null,
  visibility: [],
  featured: null
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: mockPosts.slice(0, 10),
      filters: defaultFilters,
      viewMode: "table",
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      resetFilters: () => set({ filters: defaultFilters }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      getStats: () => {
        const posts = get().posts
        return {
          totalPosts: posts.length,
          totalViews: posts.reduce((acc, p) => acc + p.viewCount, 0),
          publishedPosts: posts.filter(p => p.status === 'published').length,
          totalUsers: 15,
          postsTrend: 12,
          viewsTrend: 8
        }
      },
      
      getPost: (id) => get().posts.find(p => p.id === id),
      
      incrementView: (id) => set(state => ({
        posts: state.posts.map(p => p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p)
      })),
      
      createPost: (postData) => set((state) => {
        const newPost = {
          ...postData,
          id: `post_${Math.random().toString(36).substring(2, 11)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          revisions: [],
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          shareCount: 0,
        }
        return { posts: [newPost as Post, ...state.posts] }
      }),
      
      updatePost: (id, data) => set((state) => ({
        posts: state.posts.map(p => {
          if (p.id === id) {
            // Save revision? Could be done here or in component
            const newVersion = p.version + 1
            return { ...p, ...data, updatedAt: new Date(), version: newVersion }
          }
          return p
        })
      })),
      
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      })),
      
      publishPost: (id) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, status: "published", publishedAt: new Date(), updatedAt: new Date() } : p
        )
      })),
      
      unpublishPost: (id) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, status: "draft", publishedAt: null, updatedAt: new Date() } : p
        )
      })),
      
      schedulePost: (id, date) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, status: "scheduled", scheduledAt: date, updatedAt: new Date() } : p
        )
      })),
      
      archivePost: (id) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, status: "archived", archivedAt: new Date(), updatedAt: new Date() } : p
        )
      })),
      
      bulkUpdateStatus: (ids, status) => set(state => ({
        posts: state.posts.map(p => ids.includes(p.id) ? { ...p, status } as Post : p)
      })),
      bulkDeletePosts: (ids) => set(state => ({
        posts: state.posts.filter(p => !ids.includes(p.id))
      })),
duplicatePost: (id, newAuthorId) => set((state) => {
        const postToDuplicate = state.posts.find(p => p.id === id)
        if (!postToDuplicate) return state
        
        const duplicatedPost: Post = {
          ...postToDuplicate,
          id: `post_${Math.random().toString(36).substring(2, 11)}`,
          title: `${postToDuplicate.title} (Copy)`,
          slug: `${postToDuplicate.slug}-copy-${Math.random().toString(36).substring(2, 6)}`,
          status: "draft",
          authorId: newAuthorId,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
          scheduledAt: null,
          archivedAt: null,
          version: 1,
          revisions: [],
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          shareCount: 0
        }
        return { posts: [duplicatedPost, ...state.posts] }
      })
    }),
    {
      name: "post-store",
      version: 2,
      partialize: (state) => ({ filters: state.filters, viewMode: state.viewMode }),
      migrate: () => ({ filters: { search: "", statuses: [], categories: [], tags: [], authorId: null, visibility: [], featured: null }, viewMode: "table" }),
    }
  )
)
