import React from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Permission, Role, ROLE_PERMISSIONS } from "@/types"
import { useRouter } from "next/navigation"

export const usePermission = (permission: Permission): boolean => {
  const currentUser = useAuthStore(state => state.currentUser)
  if (!currentUser) return false
  
  // In a real app, permissions might be overridden per user,
  // but we'll use role-based permissions as the default fallback
  if (currentUser.permissions && currentUser.permissions.length > 0) {
    return currentUser.permissions.includes(permission)
  }
  
  const rolePermissions = ROLE_PERMISSIONS[currentUser.role] || []
  return rolePermissions.includes(permission)
}

export const useRole = (role: Role | Role[]): boolean => {
  const currentUser = useAuthStore(state => state.currentUser)
  if (!currentUser) return false
  
  if (Array.isArray(role)) {
    return role.includes(currentUser.role)
  }
  
  return currentUser.role === role
}

interface PermissionGateProps {
  permission: Permission
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  fallback = null, 
  children 
}) => {
  const hasPermission = usePermission(permission)
  
  if (!hasPermission) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface CanAccessProps {
  role: Role | Role[]
  redirect?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const CanAccess: React.FC<CanAccessProps> = ({ 
  role, 
  redirect, 
  fallback = null, 
  children 
}) => {
  const hasRole = useRole(role)
  const router = useRouter()
  
  React.useEffect(() => {
    if (!hasRole && redirect) {
      router.push(redirect)
    }
  }, [hasRole, redirect, router])
  
  if (!hasRole) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
