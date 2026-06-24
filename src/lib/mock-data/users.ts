import { User, Role } from "@/types"

// Use deterministic IDs (no nanoid/Math.random) to prevent SSR hydration mismatch
const generateMockUser = (
  idx: number,
  role: Role,
  status: User["status"] = "active"
): User => {
  const isSuperadmin = role === "superadmin"
  const name = isSuperadmin ? "Admin Utama" : `User ${role} ${idx}`
  const username = name.toLowerCase().replace(/ /g, "_")
  const id = `usr_${role}_${idx}`

  return {
    id,
    email: `${username}@example.com`,
    username,
    fullName: name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    role,
    permissions: [],
    status,
    emailVerified: status !== "pending",
    twoFactorEnabled: isSuperadmin || idx % 3 === 0,
    lastLoginAt: new Date(`2026-0${(idx % 9) + 1}-${(idx % 28) + 1}`),
    lastLoginIp: `192.168.1.${(idx * 7) % 255}`,
    loginCount: (idx * 13) % 100 + 1,
    createdAt: new Date(`2025-0${(idx % 9) + 1}-${(idx % 28) + 1}`),
    updatedAt: new Date("2026-06-01"),
    profile: {
      bio: `Saya adalah seorang ${role} di platform ini.`,
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
        instagram: null,
      }
    },
    preferences: {
      theme: "system",
      sidebarCollapsed: false,
      compactMode: false,
      dateFormat: "DD/MM/YYYY",
      currency: "IDR",
      emailDigest: "weekly",
    },
    metadata: {}
  }
}

export const mockUsers: User[] = [
  generateMockUser(1, "superadmin", "active"),
  generateMockUser(2, "admin", "active"),
  generateMockUser(3, "editor", "active"),
  ...Array.from({ length: 5 }).map((_, i) => generateMockUser(i + 4, "author", "active")),
  ...Array.from({ length: 15 }).map((_, i) => generateMockUser(i + 9, "viewer", i % 5 === 0 ? "suspended" : (i % 4 === 0 ? "pending" : "active"))),
  generateMockUser(25, "moderator", "active"),
]
