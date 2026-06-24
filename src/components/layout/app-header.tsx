"use client"

import { BreadcrumbNav } from "./breadcrumb-nav"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "./user-menu"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="-ml-2" />
      <div className="flex-1">
        <BreadcrumbNav />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <div className="mx-2 h-6 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  )
}
