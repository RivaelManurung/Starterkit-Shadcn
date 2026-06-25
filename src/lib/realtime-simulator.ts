"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useNotificationStore } from "@/stores/notification-store"
import { useActivityStore } from "@/stores/activity-store"
import { usePostStore } from "@/stores/post-store"
import { toast } from "sonner"
import { NotificationType, ActivityAction, ActivityEntity } from "@/types"

export const useRealtimeSimulator = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const addNotification = useNotificationStore(state => state.addNotification)
  const addLog = useActivityStore(state => state.addLog)
  const posts = usePostStore(state => state.posts)
  const updatePost = usePostStore(state => state.updatePost)
  
  const [onlineUsers, setOnlineUsers] = useState(15)

  useEffect(() => {
    if (!isAuthenticated) return

    // Every 10 seconds: Update online users
    const onlineInterval = setInterval(() => {
      // Random walk for online users (between 8 and 35)
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        const next = prev + change
        return Math.max(8, Math.min(35, next))
      })
    }, 10000)

    // Every 30 seconds: Random events
    const eventInterval = setInterval(() => {
      const eventType = Math.floor(Math.random() * 3)
      
      if (eventType === 0) {
        // Notification
        const types: NotificationType[] = ["comment_new", "post_published", "mention", "reaction"]
        const type = types[Math.floor(Math.random() * types.length)]
        
        let title = "Notifikasi Baru"
        let message = "Anda memiliki pesan baru."
        
        if (type === "comment_new") {
          title = "Komentar Baru"
          message = "Seseorang mengomentari artikel Anda."
        } else if (type === "post_published") {
          title = "Artikel Baru"
          message = "Penulis favorit Anda baru saja mempublikasikan artikel."
        } else if (type === "reaction") {
          title = "Reaksi Baru"
          message = "Seseorang menyukai postingan Anda."
        }
        
        addNotification({
          type,
          priority: "normal",
          title,
          message,
          actionLabel: "Lihat",
          actionUrl: "/dashboard/notifications",
          icon: null,
          imageUrl: null,
          recipientId: "current_user",
          senderId: null,
          sender: null,
          channel: "in_app",
          metadata: {},
        })
        
        toast(title, {
          description: message,
          action: {
            label: "Lihat",
            onClick: () => console.log("Navigate to notifications")
          }
        })
      } 
      else if (eventType === 1) {
        // View count update
        if (posts.length > 0) {
          const randomPost = posts[Math.floor(Math.random() * posts.length)]
          if (randomPost.status === "published") {
            const increment = Math.floor(Math.random() * 5) + 1
            updatePost(randomPost.id, { viewCount: randomPost.viewCount + increment })
          }
        }
      }
      else {
        // Activity Log
        const actions: ActivityAction[] = ["view", "export", "login", "create"]
        const entities: ActivityEntity[] = ["post", "category", "tag", "user"]
        
        addLog({
          action: actions[Math.floor(Math.random() * actions.length)],
          entity: entities[Math.floor(Math.random() * entities.length)],
          entityId: `id_${Math.random().toString(36).substring(2, 8)}`,
          entityTitle: `Entitas Simulasi`,
          description: `Aktivitas background tersimulasi dari user lain.`,
          oldValue: null,
          newValue: null,
          userId: `usr_random`,
          user: null,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: "Simulated Browser",
          sessionId: "sess_simulated",
          duration: 45,
          status: "success",
          metadata: {}
        })
      }
    }, 30000)

    return () => {
      clearInterval(onlineInterval)
      clearInterval(eventInterval)
    }
  }, [isAuthenticated, addNotification, addLog, posts, updatePost])

  return { onlineUsers }
}
