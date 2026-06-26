import { User, Role, Category, Tag, Post, Notification, NotificationType, ActivityLog, ActivityAction, ActivityEntity, AnalyticsDataPoint, AnalyticsOverview, TopContent, TrafficSource } from "@/types"

// ==========================================
// 1. USERS MOCK DATA
// ==========================================

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

// ==========================================
// 2. CATEGORIES MOCK DATA
// ==========================================

export const mockCategories: Category[] = [
  {
    id: "cat_teknologi",
    name: "Teknologi",
    slug: "teknologi",
    description: "Semua hal tentang teknologi, gadget, dan software.",
    coverImage: null,
    parentId: null,
    parent: null,
    children: [],
    postCount: 15,
    order: 1,
    isVisible: true,
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null },
    color: "#3b82f6",
    icon: "laptop",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: "cat_bisnis",
    name: "Bisnis",
    slug: "bisnis",
    description: "Berita dan strategi bisnis terkini.",
    coverImage: null,
    parentId: null,
    parent: null,
    children: [],
    postCount: 8,
    order: 2,
    isVisible: true,
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null },
    color: "#10b981",
    icon: "briefcase",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: "cat_gaya_hidup",
    name: "Gaya Hidup",
    slug: "gaya-hidup",
    description: "Tips gaya hidup, kesehatan, dan hobi.",
    coverImage: null,
    parentId: null,
    parent: null,
    children: [],
    postCount: 12,
    order: 3,
    isVisible: true,
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null },
    color: "#f43f5e",
    icon: "coffee",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: "cat_programming",
    name: "Programming",
    slug: "programming",
    description: "Tutorial dan tips programming.",
    coverImage: null,
    parentId: "cat_teknologi",
    parent: null,
    children: [],
    postCount: 10,
    order: 1,
    isVisible: true,
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null },
    color: "#6366f1",
    icon: "code",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: "cat_ai_ml",
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    description: "Perkembangan AI terbaru.",
    coverImage: null,
    parentId: "cat_teknologi",
    parent: null,
    children: [],
    postCount: 5,
    order: 2,
    isVisible: true,
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null },
    color: "#8b5cf6",
    icon: "bot",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2026-06-01"),
  },
]

// ==========================================
// 3. TAGS MOCK DATA
// ==========================================

const TAG_NAMES = [
  "React", "Next.js", "Tailwind CSS", "TypeScript", "JavaScript",
  "Frontend", "Backend", "Fullstack", "Web Dev", "Mobile Dev",
  "UI/UX", "Design System", "Figma", "Startup", "Bisnis Online",
  "Marketing", "SEO", "Content Creator", "Produktivitas", "Kesehatan",
  "Olah Raga", "Kuliner", "Travel", "Finansial", "Investasi",
  "Crypto", "AI", "Machine Learning", "Data Science", "Python"
]

const TAG_POST_COUNTS = [
  12, 8, 25, 19, 30, 15, 10, 7, 22, 5,
  18, 3, 11, 6, 9, 20, 14, 4, 16, 2,
  13, 17, 8, 21, 7, 11, 28, 15, 9, 24
]

export const mockTags: Tag[] = TAG_NAMES.map((name, i) => ({
  id: `tag_${i + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  description: `Artikel terkait dengan ${name}`,
  color: `hsl(${i * 12}, 70%, 50%)`,
  postCount: TAG_POST_COUNTS[i],
  createdAt: new Date(`2024-0${(i % 9) + 1}-01`),
  updatedAt: new Date("2026-06-01"),
}))

// ==========================================
// 4. POSTS MOCK DATA
// ==========================================

const TITLES = [
  "Panduan Lengkap Next.js 15 App Router",
  "Mengapa Tailwind CSS Menjadi Standar Industri",
  "Tips Membangun Dashboard yang Interaktif",
  "Cara Menggunakan Zustand untuk State Management",
  "Mengenal React Server Components",
  "Integrasi Shadcn UI di Proyek Next.js",
  "10 Ekstensi VS Code Terbaik untuk Developer",
  "Membuat Animasi Smooth dengan Framer Motion",
  "Manajemen Form Mudah dengan React Hook Form & Zod",
  "Optimasi SEO di Aplikasi React",
  "Tren Desain UI/UX di Tahun Ini",
  "Mengamankan Aplikasi Web dari Serangan XSS",
  "Deploy Aplikasi Next.js ke Vercel",
  "Membangun API Cepat dengan Hono",
  "Belajar TypeScript dari Nol"
]

const STATUSES: Post["status"][] = [
  "published", "published", "published", "published", "published",
  "published", "draft", "scheduled", "archived", "published",
  "published", "draft", "published", "scheduled", "published",
  "published", "archived", "published", "draft", "published",
  "published", "published", "draft", "published", "scheduled",
  "published", "draft", "published", "archived", "published",
  "published", "draft", "published", "published", "scheduled",
  "published", "draft", "archived", "published", "published",
  "published", "draft", "scheduled", "published", "archived",
  "published", "published", "draft", "published", "scheduled",
]

const VIEW_COUNTS = [
  9834, 7210, 5623, 8450, 3120, 12300, 0, 0, 0, 6700,
  4510, 0, 9100, 0, 7800, 2340, 0, 5670, 0, 8900,
  11200, 3450, 0, 7600, 0, 4300, 0, 6780, 0, 9210,
  5430, 0, 8760, 2100, 0, 7890, 0, 0, 4560, 3210,
  6780, 0, 0, 9100, 0, 5430, 8760, 0, 7890, 0,
]

const AUTHORS = [1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2]

export const mockPosts: Post[] = Array.from({ length: 50 }).map((_, i) => {
  const title = TITLES[i % TITLES.length] + (i >= TITLES.length ? ` Bagian ${Math.floor(i / TITLES.length) + 1}` : "")
  const status = STATUSES[i]
  const authorIdx = AUTHORS[i]
  const author = mockUsers[authorIdx % mockUsers.length]
  const category = mockCategories[i % mockCategories.length]
  const numTags = (i % 4) + 1
  const tags = mockTags.slice(i % (mockTags.length - numTags), i % (mockTags.length - numTags) + numTags)
  const viewCount = status === "published" ? VIEW_COUNTS[i] : 0

  const month = String((i % 12) + 1).padStart(2, "0")
  const day = String((i % 28) + 1).padStart(2, "0")
  const createdAt = new Date(`2025-${month}-${day}`)
  const publishedAt = status === "published" ? new Date(`2025-${month}-${String(Math.min((i % 28) + 2, 28)).padStart(2, "0")}`) : null
  const scheduledAt = status === "scheduled" ? new Date("2026-07-15") : null

  return {
    id: `post_${i + 1}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: `Ini adalah ringkasan dari artikel ${title}. Artikel ini membahas berbagai aspek penting yang perlu Anda ketahui.`,
    content: `Ini adalah konten untuk **${title}**.\n\nDibuat menggunakan editor artikel.\n\nArtikle ini membahas topik-topik penting yang perlu diketahui oleh setiap developer modern.`,
    coverImage: `https://picsum.photos/seed/${i + 1}/800/400`,
    coverImageAlt: title,
    status,
    visibility: i % 10 === 0 ? "members_only" : "public",
    password: null,
    authorId: author.id,
    author,
    coAuthors: [],
    categoryId: category.id,
    category,
    tags,
    seo: {
      metaTitle: title,
      metaDescription: `Ringkasan SEO untuk ${title}`,
      focusKeyword: "nextjs, react",
      canonicalUrl: null,
      ogTitle: title,
      ogDescription: null,
      ogImage: null,
      twitterTitle: null,
      twitterDescription: null,
      twitterImage: null,
      noIndex: false,
      noFollow: false,
      schema: null,
    },
    readingTime: (i % 10) + 2,
    wordCount: ((i + 1) * 137) % 1000 + 300,
    viewCount,
    likeCount: status === "published" ? (i * 17) % 500 : 0,
    commentCount: status === "published" ? (i * 7) % 50 : 0,
    shareCount: status === "published" ? (i * 11) % 100 : 0,
    isFeatured: i % 10 === 0,
    isPinned: i % 20 === 0,
    allowComments: true,
    allowReactions: true,
    scheduledAt,
    publishedAt,
    archivedAt: status === "archived" ? new Date("2026-01-01") : null,
    createdAt,
    updatedAt: new Date("2026-06-01"),
    version: 1,
    revisions: [],
    customFields: {},
  }
})

// ==========================================
// 5. NOTIFICATIONS MOCK DATA
// ==========================================

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
  { type: "system_update", title: "Pembaluan Sistem", message: "Sistem telah diperbarui ke versi v2.0.", isRead: true, senderIdx: null, daysAgo: 2 },
  { type: "security_login", title: "Login Baru Dideteksi", message: "Login baru dari IP tidak dikenal.", isRead: true, senderIdx: null, daysAgo: 2 },
  { type: "post_published", title: "Artikel Dipublikasikan", message: "User admin 2 baru saja menerbitkan artikel baru.", isRead: true, senderIdx: 1, daysAgo: 3 },
  { type: "comment_new", title: "Komentar Baru", message: "Ada komentar baru di artikel Anda.", isRead: true, senderIdx: null, daysAgo: 3 },
  { type: "mention", title: "Anda Di-mention", message: "Seseorang menyebut Anda.", isRead: true, senderIdx: null, daysAgo: 4 },
  { type: "reaction", title: "Reaksi Baru", message: "User admin 2 menyukai artikel Anda.", isRead: true, senderIdx: 1, daysAgo: 4 },
  { type: "user_registered", title: "Pengguna Baru Mendaftar", message: "Pengguna baru telah mendaftar.", isRead: true, senderIdx: null, daysAgo: 5 },
  { type: "system_update", title: "Pembaluan Sistem", message: "Pembaluan keamanan telah diterapkan.", isRead: true, senderIdx: null, daysAgo: 6 },
  { type: "post_published", title: "Artikel Dipublikasikan", message: "Admin Utama menerbitkan artikel panduan.", isRead: true, senderIdx: 0, daysAgo: 7 },
  { type: "comment_new", title: "Komentar Baru", message: "User editor 3 mengomentari postingan terbaru.", isRead: true, senderIdx: 2, daysAgo: 8 },
  { type: "security_login", title: "Login Baru Dideteksi", message: "Ada percobaan login dari perangkat baru.", isRead: true, senderIdx: null, daysAgo: 9 },
  { type: "reaction", title: "Reaksi Baru", message: "Seseorang menyukai artikel Anda.", isRead: true, senderIdx: null, daysAgo: 10 },
  { type: "user_registered", title: "Pengguna Baru Mendaftar", message: "User author 5 bergabung.", isRead: true, senderIdx: 4, daysAgo: 11 },
  { type: "mention", title: "Anda Di-mention", message: "User admin 2 menyebut Anda.", isRead: true, senderIdx: 1, daysAgo: 12 },
  { type: "system_update", title: "Pembaluan Sistem", message: "Fitur baru sudah tersedia.", isRead: true, senderIdx: null, daysAgo: 14 },
]

const BASE_DATE = new Date("2026-06-24T12:00:00Z")

export const mockNotifications: Notification[] = NOTIFICATIONS_DATA.map((n, i) => {
  const sender = n.senderIdx !== null ? mockUsers[n.senderIdx % mockUsers.length] : null
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

// ==========================================
// 6. ACTIVITY LOGS MOCK DATA
// ==========================================

const LOG_ACTIONS: ActivityAction[] = ["create", "update", "delete", "login", "export", "publish", "suspend"]
const LOG_ENTITIES: ActivityEntity[] = ["post", "user", "category", "tag", "settings", "session"]

const USER_IDXS = [
  0, 1, 2, 3, 0, 1, 4, 2, 0, 3, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2,
  3, 0, 1, 2, 4, 0, 3, 1, 2, 0, 1, 3, 2, 4, 0, 1, 2, 3, 0, 1,
  2, 4, 0, 1, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 3, 1, 4, 2, 0,
  1, 3, 2, 0, 4, 1, 2, 3, 0, 1, 2, 4, 3, 0, 1, 2, 0, 3, 1, 2,
  4, 0, 1, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 1, 3, 4, 2, 0, 1
]

const LOG_STATUSES: ("success" | "failed")[] = Array.from({ length: 100 }, (_, i) => i % 10 === 3 ? "failed" : "success")

export const mockActivityLogs: ActivityLog[] = Array.from({ length: 100 }).map((_, i) => {
  const user = mockUsers[USER_IDXS[i] % mockUsers.length]
  const action = LOG_ACTIONS[i % LOG_ACTIONS.length]
  const entity = LOG_ENTITIES[i % LOG_ENTITIES.length]
  const hoursAgo = i * 2 + (i % 7)

  // Generate oldValue and newValue mock data for JSON representation
  const oldValue = action === "update" || action === "delete" ? { 
    title: `${entity} ${i + 1} Lama`, 
    status: i % 2 === 0 ? "draft" : "published",
    version: 1 
  } : null
  
  const newValue = action === "create" || action === "update" ? { 
    title: `${entity} ${i + 1} Baru`, 
    status: "published", 
    version: action === "create" ? 1 : 2
  } : null

  return {
    id: `log_${i + 1}`,
    action,
    entity,
    entityId: `id_${entity}_${i + 1}`,
    entityTitle: `${entity} ${i + 1}`,
    description: `User ${user.fullName} melakukan ${action} pada ${entity}.`,
    oldValue,
    newValue,
    userId: user.id,
    user,
    ipAddress: `192.168.1.${(i * 7 + 10) % 255}`,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    sessionId: `sess_${i + 1}`,
    duration: (i * 37) % 500 + 10,
    status: LOG_STATUSES[i],
    metadata: {},
    createdAt: new Date(new Date("2026-06-24T12:00:00Z").getTime() - hoursAgo * 3600000)
  }
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// ==========================================
// 7. ANALYTICS MOCK DATA
// ==========================================

export const generateAnalyticsData = (days: number = 90) => {
  const data = []
  let pageviews = 1000
  let uniqueVisitors = 800
  let sessions = 850
  
  const now = new Date("2026-06-25T12:00:00Z")
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    
    const pseudoRand1 = ((i * 13.51) % 100) / 100
    const pseudoRand2 = ((i * 7.33) % 100) / 100
    const pseudoRand3 = ((i * 19.87) % 100) / 100
    
    const noise = pseudoRand1 * 200 - 100
    pageviews = Math.floor(Math.max(500, pageviews + noise + 5))
    uniqueVisitors = Math.floor(pageviews * (0.6 + pseudoRand2 * 0.2))
    sessions = Math.floor(uniqueVisitors * (1.1 + pseudoRand3 * 0.2))
    
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const multiplier = isWeekend ? 0.7 : 1.1
    
    data.push({
      date: date.toISOString().split('T')[0],
      pageviews: Math.floor(pageviews * multiplier),
      uniqueVisitors: Math.floor(uniqueVisitors * multiplier),
      sessions: Math.floor(sessions * multiplier),
      bounceRate: 40 + (((i * 5.11) % 100) / 100) * 20,
      avgSessionDuration: 120 + (((i * 8.43) % 100) / 100) * 180,
    })
  }
  
  return data
}

export const mockAnalytics = {
  overview: {
    totalPageviews: 125430,
    pageviewsChange: 12.5,
    uniqueVisitors: 84210,
    uniqueVisitorsChange: 8.2,
    bounceRate: 45.2,
    bounceRateChange: -2.1,
    avgSessionDuration: 245,
    avgSessionDurationChange: 5.4,
  },
  traffic: generateAnalyticsData(90),
  topContent: Array.from({ length: 10 }).map((_, i) => ({
    id: `post_${i}`,
    title: `Artikel Populer ${i + 1}`,
    views: 10000 - i * 500 + Math.floor((((i * 3.1) % 100) / 100) * 200),
    uniqueVisitors: 8000 - i * 400 + Math.floor((((i * 4.2) % 100) / 100) * 150),
    avgTime: 180 + (((i * 5.3) % 100) / 100) * 100,
    bounceRate: 35 + (((i * 6.4) % 100) / 100) * 15,
    conversions: 2 + (((i * 7.5) % 100) / 100) * 5
  })),
  sources: {
    pie: [
      { name: "Organic Search", value: 45 },
      { name: "Direct", value: 25 },
      { name: "Referral", value: 15 },
      { name: "Social", value: 10 },
      { name: "Email", value: 5 }
    ],
    referrers: [
      { domain: "google.com", views: 45000 },
      { domain: "twitter.com", views: 8000 },
      { domain: "facebook.com", views: 5000 },
      { domain: "github.com", views: 3000 },
      { domain: "linkedin.com", views: 2500 }
    ]
  },
  audience: {
    countries: [
      { country: "Indonesia", value: 75 },
      { country: "Malaysia", value: 10 },
      { country: "Singapore", value: 5 },
      { country: "United States", value: 3 },
      { country: "Others", value: 7 }
    ],
    devices: [
      { name: "Mobile", value: 55 },
      { name: "Desktop", value: 40 },
      { name: "Tablet", value: 5 }
    ],
    browsers: [
      { name: "Chrome", value: 65 },
      { name: "Safari", value: 20 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 5 },
      { name: "Others", value: 2 }
    ]
  }
}
