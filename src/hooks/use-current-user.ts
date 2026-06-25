import { useAuthStore } from "@/stores/auth-store"

export function useCurrentUser() {
  const currentUser = useAuthStore(state => state.currentUser)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const login = useAuthStore(state => state.login)
  const logout = useAuthStore(state => state.logout)
  const switchRole = useAuthStore(state => state.switchRole)

  return {
    user: currentUser,
    isAuthenticated,
    login,
    logout,
    switchRole
  }
}
