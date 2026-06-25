import { ActivityLog } from "@/types"
import { useActivityStore } from "@/stores/activity-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export function RecentActivityFeed() {
  const logs = useActivityStore(state => state.logs).slice(0, 10)

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "create": return "default"
      case "update": return "secondary"
      case "delete": return "destructive"
      default: return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Log aktivitas pengguna di dalam sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {logs.map((log: ActivityLog) => (
              <div key={log.id} className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={log.user?.avatar || ""} />
                  <AvatarFallback>{(log.user?.fullName || log.userId || "System").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {log.user?.fullName || log.userId || "System"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={getActionBadgeColor(log.action) as any} className="text-[10px] px-1 py-0 h-4">
                      {log.action}
                    </Badge>
                    <span className="truncate max-w-[200px]">{log.entityTitle}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(log.createdAt, { addSuffix: true, locale: id })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
