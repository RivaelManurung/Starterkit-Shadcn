import { ActivityLog, ActivityAction, ActivityEntity } from "@/types"
import { mockUsers } from "./users"

const ACTIONS: ActivityAction[] = ["create", "update", "delete", "login", "export", "publish", "suspend"]
const ENTITIES: ActivityEntity[] = ["post", "user", "category", "tag", "settings", "session"]

const USER_IDXS = [0, 1, 2, 3, 0, 1, 4, 2, 0, 3, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2,
  3, 0, 1, 2, 4, 0, 3, 1, 2, 0, 1, 3, 2, 4, 0, 1, 2, 3, 0, 1,
  2, 4, 0, 1, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 3, 1, 4, 2, 0,
  1, 3, 2, 0, 4, 1, 2, 3, 0, 1, 2, 4, 3, 0, 1, 2, 0, 3, 1, 2,
  4, 0, 1, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 1, 3, 4, 2, 0, 1]

const STATUSES: ("success" | "failed")[] = Array.from({ length: 100 }, (_, i) => i % 10 === 3 ? "failed" : "success")

export const mockActivityLogs: ActivityLog[] = Array.from({ length: 100 }).map((_, i) => {
  const user = mockUsers[USER_IDXS[i] % mockUsers.length]
  const action = ACTIONS[i % ACTIONS.length]
  const entity = ENTITIES[i % ENTITIES.length]
  const hoursAgo = i * 2 + (i % 7)

  return {
    id: `log_${i + 1}`,
    action,
    entity,
    entityId: `id_${entity}_${i + 1}`,
    entityTitle: `${entity} ${i + 1}`,
    description: `User ${user.fullName} melakukan ${action} pada ${entity}.`,
    oldValue: null,
    newValue: null,
    userId: user.id,
    user,
    ipAddress: `192.168.1.${(i * 7 + 10) % 255}`,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    sessionId: `sess_${i + 1}`,
    duration: (i * 37) % 500 + 10,
    status: STATUSES[i],
    metadata: {},
    createdAt: new Date(new Date("2026-06-24T12:00:00Z").getTime() - hoursAgo * 3600000)
  }
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
