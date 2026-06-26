"use client"

import * as React from "react"
import { useTheme } from "@/components/themes/ThemeProvider"
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  User as UserIcon,
  Settings,
  LogOut,
  HelpCircle,
  RefreshCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth-store"
import { useNotificationStore } from "@/stores/notification-store"
import { BreadcrumbNav } from "./breadcrumb-nav"
import Link from "next/link"

import { KBarTrigger } from "@/components/kbar/KBarTrigger"


export function AppHeader() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  const currentUser = useAuthStore(state => state.currentUser)
  const switchRole = useAuthStore(state => state.switchRole)
  const logout = useAuthStore(state => state.logout)
  
  const notifications = useNotificationStore(state => state.notifications)
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const markRead = useNotificationStore(state => state.markRead)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!currentUser) return null

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        
        <div className="mr-2 hidden md:flex">
          <BreadcrumbNav />
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search Button */}
          <KBarTrigger />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative h-9 w-9" />}>
              <Bell className="h-4 w-4" />
              {mounted && unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">{unreadCount} belum dibaca</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem 
                      key={notif.id} 
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notif.isRead ? 'bg-muted/50' : ''}`}
                      onClick={() => !notif.isRead && markRead(notif.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className={`text-sm ${!notif.isRead ? 'font-medium' : ''}`}>{notif.title}</span>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2">{notif.message}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/notifications" />} className="cursor-pointer justify-center text-center">
                Lihat Semua Notifikasi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.avatar || ""} alt={currentUser.fullName} />
                <AvatarFallback>{currentUser.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil Saya</span>
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/help" />}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Bantuan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* DEMO: Role Switcher */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  <span>Ganti Role (Demo)</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => switchRole("superadmin")}>Superadmin</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole("admin")}>Admin</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole("editor")}>Editor</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole("author")}>Author</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole("moderator")}>Moderator</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole("viewer")}>Viewer</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>


    </>
  )
}
