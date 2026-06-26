import * as React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="w-full p-6">
            <React.Suspense fallback={<div className="flex items-center justify-center min-h-[200px] text-sm text-muted-foreground">Loading...</div>}>
              {children}
            </React.Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
