import { useNotificationStore } from "@/stores/notification-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, ShieldAlert, Settings, MessageSquare, Plus } from "lucide-react"

export function NotificationsPreview() {
  const notifications = useNotificationStore(state => state.notifications).slice(0, 5)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  const getIcon = (type: string) => {
    switch(type) {
      case "security_login": return <ShieldAlert className="h-4 w-4 text-destructive" />
      case "system_update": return <Settings className="h-4 w-4 text-primary" />
      case "comment_new": return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "post_published": return <Plus className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Notifikasi</CardTitle>
          <CardDescription>Pemberitahuan sistem terbaru.</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {unreadCount} Baru
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] mt-4 pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada notifikasi.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-4">
                  <div className="mt-1 bg-muted p-2 rounded-full">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm leading-none ${!notif.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
