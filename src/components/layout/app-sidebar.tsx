"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tags, 
  Users, 
  Bell, 
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react"
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

export function AppSidebar() {
  const pathname = usePathname()
  const currentUser = useAuthStore(state => state.currentUser)
  const logout = useAuthStore(state => state.logout)
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const { state, isMobile } = useSidebar()
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

  const mainNav: { title: string, url: string, icon: any, permission: boolean, badge?: number | null }[] = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard, permission: true },
    { title: "Analitik", url: "/dashboard/analytics", icon: BarChart3, permission: canReadAnalytics },
  ]
  
  const contentNav: { title: string, url: string, icon: any, permission: boolean, badge?: number | null }[] = [
    { title: "Artikel", url: "/dashboard/posts", icon: FileText, permission: true },
    { title: "Kategori", url: "/dashboard/categories", icon: FolderTree, permission: true },
    { title: "Tag", url: "/dashboard/tags", icon: Tags, permission: true },
  ]
  
  const systemNav: { title: string, url: string, icon: any, permission: boolean, badge?: number | null }[] = [
    { title: "Pengguna", url: "/dashboard/users", icon: Users, permission: canReadUsers },
    { title: "Notifikasi", url: "/dashboard/notifications", icon: Bell, permission: true, badge: mounted && unreadCount > 0 ? unreadCount : null },
    { title: "Log Aktivitas", url: "/dashboard/activity", icon: Activity, permission: canReadLogs },
  ]
  
  const settingsNav: { title: string, url: string, icon: any, permission: boolean, badge?: number | null }[] = [
    { title: "Pengaturan", url: "/dashboard/settings", icon: Settings, permission: canReadSettings },
    { title: "Bantuan", url: "/dashboard/help", icon: HelpCircle, permission: true },
  ]

  const renderMenu = (items: { title: string, url: string, icon: any, permission: boolean, badge?: number | null }[]) => (
    <SidebarMenu>
      {items.filter(i => i.permission).map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            render={<Link href={item.url} />}
            isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
            tooltip={item.title}
          >
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>
          {item.badge ? (
            <SidebarMenuBadge>{item.badge > 99 ? "99+" : item.badge}</SidebarMenuBadge>
          ) : null}
        </SidebarMenuItem>
      ))}
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
