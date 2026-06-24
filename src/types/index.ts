// ─── Enums ───────────────────────────────────────────────

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';
export type UserRole   = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';
export type NotifType  = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
export type ActivityAction =
  | 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED' | 'POST_PUBLISHED'
  | 'CATEGORY_CREATED' | 'CATEGORY_DELETED'
  | 'TAG_CREATED' | 'TAG_DELETED'
  | 'USER_CREATED' | 'USER_UPDATED' | 'USER_ROLE_CHANGED'
  | 'SETTINGS_UPDATED' | 'LOGIN' | 'LOGOUT';

// ─── Core Entities ───────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  postCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;          // oklch hex untuk warna badge
  icon?: string;          // nama ikon dari lucide-react
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: PostStatus;
  publishedAt?: string;
  scheduledAt?: string;  // untuk status SCHEDULED
  categoryId: string;
  category?: Category;
  tagIds: string[];
  tags?: Tag[];
  authorId: string;
  author?: User;
  viewCount: number;
  readingTimeMin: number; // estimasi waktu baca (menit)
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;          // route yang dituju saat notif diklik
  relatedEntityId?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  userId: string;
  user?: User;
  entityId: string;
  entityType: 'Post' | 'Category' | 'Tag' | 'User' | 'Settings';
  entityTitle: string;
  meta?: Record<string, unknown>; // perubahan sebelum/sesudah
  timestamp: string;
}

export interface DailyAnalytics {
  date: string;          // ISO date string
  views: number;
  visitors: number;
  newPosts: number;
  engagementRate: number;
  sources: {
    direct: number;
    social: number;
    search: number;
    referral: number;
  };
}

// ─── Store / Filter Types ─────────────────────────────────

export interface PostFilters {
  search: string;
  status: PostStatus | 'ALL';
  categoryId: string | null;
  tagIds: string[];
  authorId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  sort: 'newest' | 'oldest' | 'most-viewed' | 'alphabetical';
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  defaultPostStatus: PostStatus;
  postsPerPage: number;
  currentUserId: string;  // user yang sedang "login"
  theme: 'light' | 'dark' | 'system';
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  scheduledPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
  totalUsers: number;
  viewsTrend: number;      // persentase perubahan vs 7 hari lalu
  postsTrend: number;
  recentPosts: Post[];
  topPosts: Post[];         // top 5 by viewCount
}
