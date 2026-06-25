import { usePermission, useRole } from "@/lib/rbac"
import { useCurrentUser } from "./use-current-user"

export function useRBAC() {
  const { user } = useCurrentUser()
  const role = user?.role

  return {
    role,
    can: usePermission,
    hasRole: useRole
  }
}
