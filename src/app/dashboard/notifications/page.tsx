"use client"

import * as React from "react"
import { useNotificationStore } from "@/stores/notification-store"
import { Button } from "@/components/ui/button"
import { relativeTime } from "@/lib/utils"
import Link from "next/link"
import { Check, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const notifications = useNotificationStore(state => state.notifications)
  const markAsRead = useNotificationStore(state => state.markRead)
  const markAllAsRead = useNotificationStore(state => state.markAllRead)
  const deleteNotification = useNotificationStore(state => state.deleteNotification)
  const clearAll = useNotificationStore(state => state.deleteAll)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            Semua pemberitahuan sistem dan aktivitas untuk Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            {/* Using text because lucide-react CheckAll might not exist in all versions, fallback to check */}
            Tandai Semua Dibaca
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            Hapus Semua
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
            Belum ada notifikasi.
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-lg border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${!notif.isRead ? 'bg-muted/50 border-primary/20' : 'bg-card'} transition-colors`}
            >
              <div className="flex items-start gap-4 flex-1">
                {!notif.isRead && (
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                )}
                <div className={`space-y-1 ${notif.isRead ? 'ml-6' : ''}`}>
                  <p className={`text-base font-medium leading-none ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">
                    {relativeTime(notif.createdAt)}
                  </p>
                  {notif.actionUrl && (
                    <div className="pt-2">
                      <Link href={notif.actionUrl} className="text-sm text-primary hover:underline font-medium">
                        Lihat Detail →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {!notif.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Tandai Dibaca
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteNotification(notif.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
