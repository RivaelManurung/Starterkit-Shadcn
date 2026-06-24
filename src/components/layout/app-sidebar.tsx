"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  FolderOpen,
  Tag,
  Users,
  Bell,
  Activity,
  Settings,
  HelpCircle,
  LogOut,
  Command,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { usePostStore } from "@/store/post-store"
import { useNotificationStore } from "@/store/notification-store"
import { useSettingsStore } from "@/store/settings-store"
import { useActivityStore } from "@/store/activity-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const draftPosts = usePostStore(state => state.posts.filter(p => p.status === 'DRAFT').length)
  const unreadNotifs = useNotificationStore(state => state.getUnreadCount())
  const currentUser = useSettingsStore(state => state.getCurrentUser())

  const handleLogout = () => {
    if (currentUser) {
      useActivityStore.getState().addLog({
        action: 'LOGOUT',
        userId: currentUser.id,
        entityId: currentUser.id,
        entityType: 'User',
        entityTitle: currentUser.name,
      })
    }
    router.push('/sign-in')
  }

  const navGroups = [
    {
      label: "Menu Utama",
      items: [
        { title: "Overview", icon: LayoutDashboard, url: "/overview" },
        { title: "Analitik", icon: BarChart2, url: "/analytics" },
      ],
    },
    {
      label: "Konten",
      items: [
        { title: "Artikel", icon: FileText, url: "/posts", badge: draftPosts > 0 ? draftPosts : undefined },
        { title: "Kategori", icon: FolderOpen, url: "/categories" },
        { title: "Tag", icon: Tag, url: "/tags" },
      ],
    },
    {
      label: "Manajemen",
      items: [
        { title: "Pengguna", icon: Users, url: "/users" },
        { title: "Notifikasi", icon: Bell, url: "/notifications", badge: unreadNotifs > 0 ? unreadNotifs : undefined },
        { title: "Log Aktivitas", icon: Activity, url: "/activity" },
      ],
    },
    {
      label: "Sistem",
      items: [
        { title: "Pengaturan", icon: Settings, url: "/settings/profile" },
        { title: "Bantuan", icon: HelpCircle, url: "#", disabled: true },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/overview" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">StarterKit</span>
                <span className="text-xs text-muted-foreground">Dashboard v1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.url) && item.url !== "#"
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        tooltip={item.title}
                        disabled={(item as any).disabled}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {(item as any).badge !== undefined && (
                        <SidebarMenuBadge>{(item as any).badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
                <AvatarFallback className="rounded-lg">
                  {currentUser?.name.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser?.name || 'Guest'}</span>
                <span className="truncate text-xs text-muted-foreground">{currentUser?.role || ''}</span>
              </div>
              <LogOut className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
