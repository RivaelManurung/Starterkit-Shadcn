import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tags, 
  Users, 
  Bell, 
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  Kanban
} from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: any
  permissionKey: "users:read" | "logs:read" | "settings:read" | "analytics:read" | boolean
  badgeKey?: "notifications"
}

export const mainNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, permissionKey: true },
  { title: "Analitik", url: "/dashboard/analytics", icon: BarChart3, permissionKey: "analytics:read" },
  { title: "Kanban", url: "/dashboard/kanban", icon: Kanban, permissionKey: true },
]

export const contentNav: NavItem[] = [
  { title: "Artikel", url: "/dashboard/posts", icon: FileText, permissionKey: true },
  { title: "Kategori", url: "/dashboard/categories", icon: FolderTree, permissionKey: true },
  { title: "Tag", url: "/dashboard/tags", icon: Tags, permissionKey: true },
]

export const systemNav: NavItem[] = [
  { title: "Pengguna", url: "/dashboard/users", icon: Users, permissionKey: "users:read" },
  { title: "Notifikasi", url: "/dashboard/notifications", icon: Bell, permissionKey: true, badgeKey: "notifications" },
  { title: "Log Aktivitas", url: "/dashboard/activity", icon: Activity, permissionKey: "logs:read" },
]

export const settingsNav: NavItem[] = [
  { title: "Pengaturan", url: "/dashboard/settings", icon: Settings, permissionKey: "settings:read" },
  { title: "Bantuan", url: "/dashboard/help", icon: HelpCircle, permissionKey: true },
]
