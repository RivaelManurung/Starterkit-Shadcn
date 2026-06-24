import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, Role } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface UserFilters {
  search: string
  roles: Role[]
  statuses: User["status"][]
  isVerified: boolean | null
  has2FA: boolean | null
}

interface UserState {
  users: User[]
  filters: UserFilters
  
  // Computed values getters (in a real app, this might be selected in components, 
  // but Zustand lets us keep the state simple)
  
  // Actions
  setFilters: (filters: Partial<UserFilters>) => void
  resetFilters: () => void
  createUser: (user: Partial<User>) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  suspendUser: (id: string, reason?: string) => void
  restoreUser: (id: string) => void
}

const defaultFilters: UserFilters = {
  search: "",
  roles: [],
  statuses: [],
  isVerified: null,
  has2FA: null
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      filters: defaultFilters,
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      resetFilters: () => set({ filters: defaultFilters }),
      
      createUser: (userData) => set((state) => {
        const newUser: User = {
          ...userData,
          id: `usr_${Math.random().toString(36).substring(2, 11)}`,
          loginCount: 0,
          lastLoginAt: null,
          lastLoginIp: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: userData.profile || {
            bio: null, website: null, phone: null, location: null, company: null,
            jobTitle: null, timezone: "Asia/Jakarta", language: "id",
            socialLinks: { twitter: null, linkedin: null, github: null, instagram: null }
          },
          preferences: userData.preferences || {
            theme: "system", sidebarCollapsed: false, compactMode: false,
            dateFormat: "DD/MM/YYYY", currency: "IDR", emailDigest: "weekly"
          },
          metadata: userData.metadata || {}
        } as User
        return { users: [newUser, ...state.users] }
      }),
      
      updateUser: (id, data) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...data, updatedAt: new Date() } : u)
      })),
      
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),
      
      suspendUser: (id, reason) => set((state) => ({
        users: state.users.map(u => 
          u.id === id 
            ? { ...u, status: "suspended", metadata: { ...u.metadata, suspendReason: reason }, updatedAt: new Date() } 
            : u
        )
      })),
      
      restoreUser: (id) => set((state) => ({
        users: state.users.map(u => 
          u.id === id ? { ...u, status: "active", updatedAt: new Date() } : u
        )
      }))
    }),
    {
      name: "user-store",
      version: 2,
      partialize: (state) => ({ filters: state.filters }),
      migrate: () => ({ filters: { search: "", roles: [], statuses: [], isVerified: null, has2FA: null } }),
    }
  )
)
