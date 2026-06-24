import { Notification, NotificationType } from "@/types"
import { mockUsers } from "./users"

type NotificationData = {
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  senderIdx: number | null
  daysAgo: number
}

const NOTIFICATIONS_DATA: NotificationData[] = [
  { type: "post_published", title: "Artikel Dipublikasikan", message: "Admin Utama baru saja menerbitkan artikel baru.", isRead: false, senderIdx: 0, daysAgo: 0 },
  { type: "comment_new", title: "Komentar Baru", message: "User editor 3 mengomentari artikel Anda.", isRead: false, senderIdx: 2, daysAgo: 0 },
  { type: "user_registered", title: "Pengguna Baru Mendaftar", message: "User author 4 telah bergabung dengan platform.", isRead: false, senderIdx: 3, daysAgo: 1 },
  { type: "mention", title: "Anda Di-mention", message: "Admin Utama menyebut Anda dalam sebuah komentar.", isRead: false, senderIdx: 0, daysAgo: 1 },
  { type: "reaction", title: "Reaksi Baru", message: "User editor 3 menyukai artikel Anda.", isRead: false, senderIdx: 2, daysAgo: 1 },
  { type: "system_update", title: "Pembaruan Sistem", message: "Sistem telah diperbarui ke versi v2.0.", isRead: true, senderIdx: null, daysAgo: 2 },
  { type: "security_login", title: "Login Baru Dideteksi", message: "Login baru dari IP tidak dikenal.", isRead: true, senderIdx: null, daysAgo: 2 },
  { type: "post_published", title: "Artikel Dipublikasikan", message: "User admin 2 baru saja menerbitkan artikel baru.", isRead: true, senderIdx: 1, daysAgo: 3 },
  { type: "comment_new", title: "Komentar Baru", message: "Ada komentar baru di artikel Anda.", isRead: true, senderIdx: null, daysAgo: 3 },
  { type: "mention", title: "Anda Di-mention", message: "Seseorang menyebut Anda.", isRead: true, senderIdx: null, daysAgo: 4 },
  { type: "reaction", title: "Reaksi Baru", message: "User admin 2 menyukai artikel Anda.", isRead: true, senderIdx: 1, daysAgo: 4 },
  { type: "user_registered", title: "Pengguna Baru Mendaftar", message: "Pengguna baru telah mendaftar.", isRead: true, senderIdx: null, daysAgo: 5 },
  { type: "system_update", title: "Pembaruan Sistem", message: "Pembaruan keamanan telah diterapkan.", isRead: true, senderIdx: null, daysAgo: 6 },
  { type: "post_published", title: "Artikel Dipublikasikan", message: "Admin Utama menerbitkan artikel panduan.", isRead: true, senderIdx: 0, daysAgo: 7 },
  { type: "comment_new", title: "Komentar Baru", message: "User editor 3 mengomentari postingan terbaru.", isRead: true, senderIdx: 2, daysAgo: 8 },
  { type: "security_login", title: "Login Baru Dideteksi", message: "Ada percobaan login dari perangkat baru.", isRead: true, senderIdx: null, daysAgo: 9 },
  { type: "reaction", title: "Reaksi Baru", message: "Seseorang menyukai artikel Anda.", isRead: true, senderIdx: null, daysAgo: 10 },
  { type: "user_registered", title: "Pengguna Baru Mendaftar", message: "User author 5 bergabung.", isRead: true, senderIdx: 4, daysAgo: 11 },
  { type: "mention", title: "Anda Di-mention", message: "User admin 2 menyebut Anda.", isRead: true, senderIdx: 1, daysAgo: 12 },
  { type: "system_update", title: "Pembaruan Sistem", message: "Fitur baru sudah tersedia.", isRead: true, senderIdx: null, daysAgo: 14 },
]

const BASE_DATE = new Date("2026-06-24T12:00:00Z")

export const mockNotifications: Notification[] = NOTIFICATIONS_DATA.map((n, i) => {
  const sender = n.senderIdx !== null ? mockUsers[n.senderIdx] : null
  const createdAt = new Date(BASE_DATE.getTime() - n.daysAgo * 86400000 - i * 3600000)

  return {
    id: `notif_${i + 1}`,
    type: n.type,
    priority: n.type === "system_update" || n.type === "security_login" ? "high" : "normal",
    title: n.title,
    message: n.message,
    actionLabel: "Lihat Detail",
    actionUrl: "/dashboard/overview",
    icon: null,
    imageUrl: null,
    isRead: n.isRead,
    isArchived: false,
    isPinned: false,
    recipientId: mockUsers[0].id,
    senderId: sender?.id || null,
    sender,
    channel: "in_app",
    metadata: {},
    readAt: n.isRead ? new Date(createdAt.getTime() + 3600000) : null,
    createdAt,
    expiresAt: null
  }
})
