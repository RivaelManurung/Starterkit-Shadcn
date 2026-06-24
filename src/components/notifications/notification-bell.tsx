"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotificationStore } from "@/stores/notification-store"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { relativeTime } from "@/lib/utils"
import Link from "next/link"

export function NotificationBell() {
  const notifications = useNotificationStore(state => state.notifications)
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const markRead = useNotificationStore(state => state.markRead)
  const markAllRead = useNotificationStore(state => state.markAllRead)
  const clearNotifications = useNotificationStore(state => state.markAllRead)

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <SheetTitle>Notifikasi</SheetTitle>
            <SheetDescription>
              Pemberitahuan aktivitas terbaru.
            </SheetDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>
              Tandai Semua Dibaca
            </Button>
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-destructive">
              Hapus Semua
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 mt-4">
          <div className="flex flex-col gap-4 pr-4">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Belum ada notifikasi.</p>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-lg border ${!notif.isRead ? 'bg-muted/50 border-primary/20' : 'bg-card'} transition-colors cursor-pointer`}
                  onClick={() => {
                    markRead(notif.id)
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium leading-none ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {relativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  {notif.actionUrl && (
                    <div className="mt-3">
                      <Link href={notif.actionUrl} className="text-xs text-primary hover:underline font-medium">
                        Lihat Detail →
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
