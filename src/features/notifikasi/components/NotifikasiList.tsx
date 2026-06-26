"use client"

import * as React from "react"
import { useNotifikasiStore } from "@/stores/useNotifikasiStore"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Bell, 
  Check, 
  X, 
  MessageSquare, 
  UserPlus, 
  FileText, 
  Settings, 
  Shield,
  ThumbsUp,
  Inbox
} from "lucide-react"
import { relativeTime } from "@/lib/utils"
import { Notification } from "@/types"

export function NotifikasiList() {
  const { notifications, markAsRead, markAllAsRead, deleteNotif } = useNotifikasiStore()
  const [activeTab, setActiveTab] = React.useState("semua")

  const getFilteredNotifications = React.useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.isRead)
      case "sistem":
        return notifications.filter((n) => n.type === "system_update" || n.type === "security_login" || n.type === "system_error")
      case "aktivitas":
        return notifications.filter((n) => n.type !== "system_update" && n.type !== "security_login" && n.type !== "system_error")
      case "semua":
      default:
        return notifications
    }
  }, [notifications, activeTab])

  const getNotifIcon = (type: Notification["type"]) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "comment_new":
      case "comment_reply":
        return <MessageSquare className={`${iconClass} text-blue-500`} />
      case "user_registered":
        return <UserPlus className={`${iconClass} text-green-500`} />
      case "post_published":
        return <FileText className={`${iconClass} text-purple-500`} />
      case "system_update":
        return <Settings className={`${iconClass} text-amber-500`} />
      case "security_login":
        return <Shield className={`${iconClass} text-red-500`} />
      case "reaction":
        return <ThumbsUp className={`${iconClass} text-pink-500`} />
      default:
        return <Bell className={`${iconClass} text-zinc-400`} />
    }
  }

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-md shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          {/* Tab Header with Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/20 pb-4">
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px] bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="semua" className="rounded-lg text-xs py-2 font-semibold">Semua</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg text-xs py-2 font-semibold">Belum Dibaca</TabsTrigger>
              <TabsTrigger value="sistem" className="rounded-lg text-xs py-2 font-semibold">Sistem</TabsTrigger>
              <TabsTrigger value="aktivitas" className="rounded-lg text-xs py-2 font-semibold">Aktivitas</TabsTrigger>
            </TabsList>

            {notifications.some(n => !n.isRead) && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 rounded-lg text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground border-border/30"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Tandai Semua Dibaca
              </Button>
            )}
          </div>

          {/* List Content */}
          <TabsContent value={activeTab} className="focus-visible:outline-none mt-0">
            <div className="divide-y divide-border/10">
              {getFilteredNotifications.length > 0 ? (
                getFilteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`group relative flex items-start gap-4 p-4 transition-all duration-300 cursor-pointer rounded-xl my-1 border border-transparent hover:border-border/10 ${
                      notif.isRead 
                        ? "bg-transparent text-muted-foreground" 
                        : "bg-zinc-800/30 dark:bg-zinc-850/50 text-foreground font-medium"
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 border border-border/20">
                      {getNotifIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{notif.title}</span>
                        {!notif.isRead && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Baru
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 block pt-1 font-medium">
                        {relativeTime(notif.createdAt)}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotif(notif.id)
                      }}
                      className="absolute right-4 top-4 h-6 w-6 opacity-0 group-hover:opacity-100 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 border border-border/10 text-muted-foreground/60 mb-4">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Tidak Ada Notifikasi</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Semua notifikasi di tab ini sudah bersih. Kami akan memberitahu Anda jika ada aktivitas baru.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
