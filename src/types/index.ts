export interface User {
  id: string
  email: string
  username: string
  fullName: string
  avatar: string | null
  role: Role
  permissions: Permission[]
  status: "active" | "suspended" | "pending" | "banned"
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLoginAt: Date | null
  lastLoginIp: string | null
  loginCount: number
  createdAt: Date
  updatedAt: Date
  profile: UserProfile
  preferences: UserPreferences
  metadata: Record<string, unknown>
}

export interface UserProfile {
  bio: string | null
  website: string | null
  phone: string | null
  location: string | null
  company: string | null
  jobTitle: string | null
  timezone: string
  language: "id" | "en"
  socialLinks: SocialLinks
}

export interface SocialLinks {
  twitter: string | null
  linkedin: string | null
  github: string | null
  instagram: string | null
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean
  compactMode: boolean
  dateFormat: string
  currency: string
  emailDigest: "daily" | "weekly" | "never"
}

export type Role = "superadmin" | "admin" | "editor" | "author" | "moderator" | "viewer"

export type Permission =
  // Posts
  | "posts:read" | "posts:create" | "posts:update" | "posts:delete"
  | "posts:publish" | "posts:unpublish" | "posts:schedule" | "posts:archive"
  // Categories
  | "categories:read" | "categories:create" | "categories:update" | "categories:delete"
  // Tags
  | "tags:read" | "tags:create" | "tags:update" | "tags:delete"
  // Users
  | "users:read" | "users:create" | "users:update" | "users:delete"
  | "users:suspend" | "users:restore" | "users:impersonate"
  // Roles
  | "roles:read" | "roles:assign" | "roles:manage"
  // Settings
  | "settings:read" | "settings:update"
  // Analytics
  | "analytics:read" | "analytics:export"
  // Activity Logs
  | "logs:read" | "logs:export" | "logs:delete"
  // Notifications
  | "notifications:read" | "notifications:send" | "notifications:manage"
  // API Keys
  | "apikeys:read" | "apikeys:create" | "apikeys:delete"

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: [
    "posts:read", "posts:create", "posts:update", "posts:delete", "posts:publish", "posts:unpublish", "posts:schedule", "posts:archive",
    "categories:read", "categories:create", "categories:update", "categories:delete",
    "tags:read", "tags:create", "tags:update", "tags:delete",
    "users:read", "users:create", "users:update", "users:delete", "users:suspend", "users:restore", "users:impersonate",
    "roles:read", "roles:assign", "roles:manage",
    "settings:read", "settings:update",
    "analytics:read", "analytics:export",
    "logs:read", "logs:export", "logs:delete",
    "notifications:read", "notifications:send", "notifications:manage",
    "apikeys:read", "apikeys:create", "apikeys:delete"
  ],
  admin: [
    "posts:read", "posts:create", "posts:update", "posts:delete", "posts:publish", "posts:unpublish", "posts:schedule", "posts:archive",
    "categories:read", "categories:create", "categories:update", "categories:delete",
    "tags:read", "tags:create", "tags:update", "tags:delete",
    "users:read", "users:create", "users:update", "users:suspend", "users:restore",
    "roles:read", "roles:assign",
    "settings:read", "settings:update",
    "analytics:read", "analytics:export",
    "logs:read", "logs:export",
    "notifications:read", "notifications:send", "notifications:manage",
    "apikeys:read", "apikeys:create", "apikeys:delete"
  ],
  editor: [
    "posts:read", "posts:create", "posts:update", "posts:delete", "posts:publish", "posts:unpublish", "posts:schedule", "posts:archive",
    "categories:read", "categories:create", "categories:update", "categories:delete",
    "tags:read", "tags:create", "tags:update", "tags:delete",
    "analytics:read",
    "settings:read",
    "notifications:read"
  ],
  author: [
    "posts:read", "posts:create", "posts:update", "posts:delete",
    "categories:read",
    "tags:read", "tags:create",
    "settings:read",
    "notifications:read"
  ],
  moderator: [
    "posts:read", "posts:update",
    "users:read",
    "logs:read",
    "settings:read",
    "notifications:read"
  ],
  viewer: [
    "posts:read",
    "categories:read",
    "tags:read",
    "users:read",
    "settings:read",
    "analytics:read",
    "notifications:read"
  ],
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string  // HTML dari Tiptap
  coverImage: string | null
  coverImageAlt: string | null
  status: "draft" | "published" | "scheduled" | "archived" | "under_review"
  visibility: "public" | "private" | "password_protected" | "members_only"
  password: string | null
  authorId: string
  author: User
  coAuthors: User[]
  categoryId: string | null
  category: Category | null
  tags: Tag[]
  seo: PostSEO
  readingTime: number  // dalam menit
  wordCount: number
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  isFeatured: boolean
  isPinned: boolean
  allowComments: boolean
  allowReactions: boolean
  scheduledAt: Date | null
  publishedAt: Date | null
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
  version: number
  revisions: PostRevision[]
  customFields: Record<string, string>
}

export interface PostSEO {
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  noIndex: boolean
  noFollow: boolean
  schema: string | null
}

export interface PostRevision {
  id: string
  postId: string
  title: string
  content: string
  savedBy: User
  savedAt: Date
  changeNote: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  coverImage: string | null
  parentId: string | null
  parent: Category | null
  children: Category[]
  postCount: number
  order: number
  isVisible: boolean
  seo: CategorySEO
  color: string | null
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CategorySEO {
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  type: NotificationType
  priority: "low" | "normal" | "high" | "critical"
  title: string
  message: string
  actionLabel: string | null
  actionUrl: string | null
  icon: string | null
  imageUrl: string | null
  isRead: boolean
  isArchived: boolean
  isPinned: boolean
  recipientId: string
  senderId: string | null
  sender: User | null
  channel: "in_app" | "email" | "push"
  metadata: Record<string, unknown>
  readAt: Date | null
  createdAt: Date
  expiresAt: Date | null
}

export type NotificationType =
  | "post_published" | "post_scheduled" | "post_under_review"
  | "comment_new" | "comment_reply" | "comment_approved" | "comment_rejected"
  | "user_registered" | "user_suspended" | "user_role_changed"
  | "system_update" | "system_maintenance" | "system_error" | "system_warning"
  | "security_login" | "security_password_changed" | "security_2fa_enabled"
  | "mention" | "reaction" | "share"
  | "analytics_milestone" | "analytics_anomaly"

export interface ActivityLog {
  id: string
  action: ActivityAction
  entity: ActivityEntity
  entityId: string
  entityTitle: string
  description: string
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  userId: string
  user: User
  ipAddress: string
  userAgent: string
  sessionId: string
  duration: number | null  // ms
  status: "success" | "failed" | "partial"
  metadata: Record<string, unknown>
  createdAt: Date
}

export type ActivityAction =
  | "create" | "update" | "delete" | "view" | "export" | "import"
  | "publish" | "unpublish" | "archive" | "restore" | "duplicate"
  | "login" | "logout" | "login_failed"
  | "password_change" | "email_change" | "role_change"
  | "suspend" | "unsuspend" | "ban"
  | "settings_update" | "apikey_create" | "apikey_delete"
  | "bulk_delete" | "bulk_update" | "bulk_export"

export type ActivityEntity =
  | "post" | "category" | "tag" | "user" | "role"
  | "settings" | "apikey" | "notification" | "comment"
  | "session" | "system"

export type PostStatus = Post["status"];
export interface PaginatedResult<T> { data: T[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }

export interface AnalyticsDataPoint {
  date: string
  pageviews: number
  uniqueVisitors: number
  sessions: number
  bounceRate: number
  avgSessionDuration: number
  engagementRate?: number
}

export interface AnalyticsOverview {
  totalPageviews: number
  pageviewsChange: number
  uniqueVisitors: number
  uniqueVisitorsChange: number
  bounceRate: number
  bounceRateChange: number
  avgSessionDuration: number
  avgSessionDurationChange: number
}

export interface TopContent {
  id: string
  title: string
  views: number
  uniqueVisitors: number
  avgTime: number
  bounceRate: number
  conversions: number
}

export interface TrafficSource {
  name: string
  value: number
  fill: string
}

export interface AnalyticsSummary {
  overview: AnalyticsOverview
  traffic: AnalyticsDataPoint[]
  topContent: TopContent[]
  sources: {
    pie: TrafficSource[]
    direct: number
    social: number
    search: number
    referral: number
  }
}
