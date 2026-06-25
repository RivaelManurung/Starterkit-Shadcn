import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ApiKey {
  id: string
  name: string
  key: string // In a real app this would be hashed or not fully stored
  permissions: string[]
  lastUsedAt: Date | null
  expiresAt: Date | null
  status: "active" | "expired" | "revoked"
  createdAt: Date
}

interface ProfileSettings {
  avatar: string | null
  fullName: string
  username: string
  email: string
  bio: string
  website: string
  phone: string
  location: string
  company: string
  jobTitle: string
  timezone: string
  language: "id" | "en"
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
    instagram: string
  }
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  compactMode: boolean
  sidebarCollapsed: boolean
  fontSize: "normal" | "large"
  dateFormat: string
  numberFormat: string
  currency: string
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  trustedDevices: Array<{ id: string; name: string; lastUsedAt: Date | null }>
  loginHistory: Array<{ timestamp: Date; action: string; ipAddress: string }>
  activeSessions: Array<{ id: string; startedAt: Date; ipAddress: string }>
}

interface NotificationSettings {
  email: {
    postPublished: boolean
    newComment: boolean
    mention: boolean
    security: boolean
    systemUpdate: boolean
    weeklyDigest: boolean
  }
  inApp: Record<string, boolean>
  push: boolean
  emailDigestFrequency: "daily" | "weekly" | "never"
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

interface SettingsState {
  profile: ProfileSettings
  appearance: AppearanceSettings
  security: SecuritySettings
  notifications: NotificationSettings
  apiKeys: ApiKey[]
  
  // Actions
  updateProfile: (data: Partial<ProfileSettings>) => void
  updateAppearance: (data: Partial<AppearanceSettings>) => void
  updateSecurity: (data: Partial<SecuritySettings>) => void
  updateNotifications: (data: Partial<NotificationSettings>) => void
  
  // API Key Actions
  createApiKey: (key: Omit<ApiKey, "id" | "key" | "createdAt" | "status" | "lastUsedAt">) => { key: string }
  revokeApiKey: (id: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profile: {
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        fullName: "Admin Utama",
        username: "admin_utama",
        email: "admin@example.com",
        bio: "Senior Developer",
        website: "https://example.com",
        phone: "+6281234567890",
        location: "Jakarta, Indonesia",
        company: "Tech Co",
        jobTitle: "Software Engineer",
        timezone: "Asia/Jakarta",
        language: "id",
        socialLinks: {
          twitter: "https://twitter.com",
          linkedin: "https://linkedin.com",
          github: "https://github.com",
          instagram: ""
        }
      },
      appearance: {
        theme: "system",
        compactMode: false,
        sidebarCollapsed: false,
        fontSize: "normal",
        dateFormat: "DD/MM/YYYY",
        numberFormat: "1.000,00",
        currency: "IDR"
      },
      security: {
        twoFactorEnabled: false,
        trustedDevices: [],
        loginHistory: [],
        activeSessions: []
      },
      notifications: {
        email: {
          postPublished: true,
          newComment: true,
          mention: true,
          security: true,
          systemUpdate: true,
          weeklyDigest: true
        },
        inApp: {
          all: true
        },
        push: false,
        emailDigestFrequency: "weekly",
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "06:00"
        }
      },
      apiKeys: [
        {
          id: "key_1",
          name: "Production API",
          key: "sk-prod-****1234",
          permissions: ["posts:read", "categories:read"],
          lastUsedAt: new Date(Date.now() - 86400000),
          expiresAt: null,
          status: "active",
          createdAt: new Date("2023-01-01")
        }
      ],
      
      updateProfile: (data) => set((state) => ({
        profile: { ...state.profile, ...data }
      })),
      
      updateAppearance: (data) => set((state) => ({
        appearance: { ...state.appearance, ...data }
      })),
      
      updateSecurity: (data) => set((state) => ({
        security: { ...state.security, ...data }
      })),
      
      updateNotifications: (data) => set((state) => ({
        notifications: { ...state.notifications, ...data }
      })),
      
      createApiKey: (keyData) => {
        const newId = `key_${Math.random().toString(36).substring(2, 11)}`
        const rawKey = `sk-${Math.random().toString(36).substring(2, 16)}`
        const maskedKey = `sk-****${rawKey.slice(-4)}`
        
        const newKey: ApiKey = {
          ...keyData,
          id: newId,
          key: maskedKey,
          status: "active",
          lastUsedAt: null,
          createdAt: new Date()
        }
        
        set((state) => ({
          apiKeys: [newKey, ...state.apiKeys]
        }))
        
        return { key: rawKey } // Return raw key only once
      },
      
      revokeApiKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.map(k => 
          k.id === id ? { ...k, status: "revoked" } : k
        )
      }))
    }),
    {
      name: "settings-store",
    }
  )
)
