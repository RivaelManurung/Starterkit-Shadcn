import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, Role } from "@/types"
import { mockUsers } from "@/constants/mock-data"

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  sessionStartedAt: Date | null
  loginHistory: Array<{ timestamp: Date; action: string }>
  
  // Actions
  login: (user: User) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  switchRole: (role: Role) => void // For demo purposes
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Default to the first user (superadmin) for demo purposes
      currentUser: mockUsers[0],
      isAuthenticated: true,
      sessionStartedAt: new Date(),
      loginHistory: [],
      
      login: (user) => set({ 
        currentUser: user, 
        isAuthenticated: true,
        sessionStartedAt: new Date()
      }),
      
      logout: () => set({ 
        currentUser: null, 
        isAuthenticated: false,
        sessionStartedAt: null
      }),
      
      updateProfile: (data) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
      })),
      
      switchRole: (role) => {
        const userWithRole = mockUsers.find(u => u.role === role) || mockUsers[0]
        set({ currentUser: userWithRole })
      }
    }),
    {
      name: "auth-store",
    }
  )
)
