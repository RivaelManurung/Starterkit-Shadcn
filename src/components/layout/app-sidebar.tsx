"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth-store"
import { useNotificationStore } from "@/stores/notification-store"
import { usePermission } from "@/lib/rbac"
import { mainNav, contentNav, systemNav, settingsNav, NavItem } from "@/config/nav"

export function AppSidebar() {
  const pathname = usePathname()
  const currentUser = useAuthStore(state => state.currentUser)
  const logout = useAuthStore(state => state.logout)
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const { state } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Permission checks
  const canReadUsers = usePermission("users:read")
  const canReadLogs = usePermission("logs:read")
  const canReadSettings = usePermission("settings:read")
  const canReadAnalytics = usePermission("analytics:read")

  if (!currentUser) return null

  const hasPermission = (key: any) => {
    if (key === true) return true
    if (key === "users:read") return canReadUsers
    if (key === "logs:read") return canReadLogs
    if (key === "settings:read") return canReadSettings
    if (key === "analytics:read") return canReadAnalytics
    return false
  }

  const getBadgeValue = (key?: string) => {
    if (key === "notifications") return unreadCount
    return null
  }

  const renderMenu = (items: NavItem[]) => (
    <SidebarMenu>
      {items
        .filter((i) => hasPermission(i.permissionKey))
        .map((item) => {
          const badgeVal = item.badgeKey ? getBadgeValue(item.badgeKey) : null
          const Icon = item.icon
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                render={<Link href={item.url} />}
                isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                tooltip={item.title}
              >
                <Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
              {mounted && badgeVal && badgeVal > 0 ? (
                <SidebarMenuBadge>{badgeVal > 99 ? "99+" : badgeVal}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          )
        })}
    </SidebarMenu>
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden w-full font-semibold">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xl">S</span>
          </div>
          {state === "expanded" && (
            <span className="truncate">StarterKit</span>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(mainNav)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Konten</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(contentNav)}
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Sistem</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(systemNav)}
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Akun</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(settingsNav)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar || ""} />
            <AvatarFallback>{currentUser.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex flex-col overflow-hidden text-sm">
              <span className="truncate font-medium">{currentUser.fullName}</span>
              <span className="truncate text-xs text-muted-foreground">{currentUser.role}</span>
            </div>
          )}
        </div>
        {state === "expanded" && (
          <SidebarMenuButton onClick={logout} className="mt-2 text-destructive">
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
