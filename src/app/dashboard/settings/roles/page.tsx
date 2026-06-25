"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ROLE_PERMISSIONS, Role, Permission } from "@/types"
import { InfoIcon, SaveIcon, ChevronDown, ChevronRight, Folder, Tag, Users, ShieldAlert, Settings, Bell, Activity, ShieldCheck } from "lucide-react"

// Define the roles and their labels with badges
const ROLES: { id: Role; label: string; badge: string; badgeColor: string }[] = [
  { id: "superadmin", label: "Super Admin", badge: "Penuh", badgeColor: "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800" },
  { id: "admin", label: "Admin", badge: "Tinggi", badgeColor: "text-blue-700 bg-blue-50 border-blue-100 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900" },
  { id: "editor", label: "Editor", badge: "Menengah", badgeColor: "text-blue-600 bg-blue-50/50 border-blue-100 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900" },
  { id: "author", label: "Author", badge: "Terbatas", badgeColor: "text-blue-500 bg-transparent border-blue-100 dark:text-blue-400 dark:border-blue-900" },
  { id: "moderator", label: "Moderator", badge: "Terbatas", badgeColor: "text-blue-500 bg-transparent border-blue-100 dark:text-blue-400 dark:border-blue-900" },
  { id: "viewer", label: "Viewer", badge: "Hanya Baca", badgeColor: "text-slate-500 bg-transparent border-slate-200 dark:text-slate-400 dark:border-slate-800" },
]

// Define detailed descriptions for permissions
const PERMISSION_DETAILS: Record<Permission, string> = {
  "posts:read": "Melihat daftar dan detail posts",
  "posts:create": "Membuat posts baru",
  "posts:update": "Mengubah posts yang ada",
  "posts:delete": "Menghapus posts",
  "posts:publish": "Mempublikasikan posts",
  "posts:unpublish": "Membatalkan publikasi posts",
  "posts:schedule": "Menjadwalkan posts",
  "posts:archive": "Mengarsipkan posts",
  
  "categories:read": "Melihat daftar dan detail kategori",
  "categories:create": "Membuat kategori baru",
  "categories:update": "Mengubah kategori",
  "categories:delete": "Menghapus kategori",
  
  "tags:read": "Melihat daftar tag",
  "tags:create": "Membuat tag baru",
  "tags:update": "Mengubah tag",
  "tags:delete": "Menghapus tag",
  
  "users:read": "Melihat daftar pengguna",
  "users:create": "Menambahkan pengguna baru",
  "users:update": "Mengubah data pengguna",
  "users:delete": "Menghapus pengguna",
  "users:suspend": "Menangguhkan pengguna",
  "users:restore": "Memulihkan pengguna",
  "users:impersonate": "Login sebagai pengguna lain",
  
  "roles:read": "Melihat daftar peran & izin",
  "roles:assign": "Menetapkan peran ke pengguna",
  "roles:manage": "Mengelola izin untuk setiap peran",
  
  "settings:read": "Melihat pengaturan sistem",
  "settings:update": "Mengubah pengaturan sistem",
  
  "analytics:read": "Melihat dasbor analitik",
  "analytics:export": "Mengekspor data analitik",
  "logs:read": "Melihat log aktivitas",
  "logs:export": "Mengekspor log aktivitas",
  "logs:delete": "Menghapus log aktivitas",
  
  "notifications:read": "Melihat notifikasi",
  "notifications:send": "Mengirim notifikasi manual",
  "notifications:manage": "Mengelola template notifikasi",
  "apikeys:read": "Melihat daftar API Keys",
  "apikeys:create": "Membuat API Keys baru",
  "apikeys:delete": "Menghapus API Keys"
}

// Group permissions by category for a better UI
const PERMISSION_GROUPS: { id: string; title: string; icon: React.ElementType; permissions: Permission[] }[] = [
  {
    id: "posts",
    title: "Posts",
    icon: Folder,
    permissions: [
      "posts:read", "posts:create", "posts:update", "posts:delete", 
      "posts:publish", "posts:unpublish", "posts:schedule", "posts:archive"
    ]
  },
  {
    id: "categories",
    title: "Categories",
    icon: Folder,
    permissions: ["categories:read", "categories:create", "categories:update", "categories:delete"]
  },
  {
    id: "tags",
    title: "Tags",
    icon: Tag,
    permissions: ["tags:read", "tags:create", "tags:update", "tags:delete"]
  },
  {
    id: "users",
    title: "Users",
    icon: Users,
    permissions: [
      "users:read", "users:create", "users:update", "users:delete", 
      "users:suspend", "users:restore", "users:impersonate"
    ]
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    icon: ShieldAlert,
    permissions: ["roles:read", "roles:assign", "roles:manage"]
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    permissions: ["settings:read", "settings:update"]
  },
  {
    id: "analytics",
    title: "Analytics & Logs",
    icon: Activity,
    permissions: ["analytics:read", "analytics:export", "logs:read", "logs:export", "logs:delete"]
  },
  {
    id: "notifications",
    title: "Notifications & API",
    icon: Bell,
    permissions: [
      "notifications:read", "notifications:send", "notifications:manage",
      "apikeys:read", "apikeys:create", "apikeys:delete"
    ]
  }
]

export default function RolesSettingsPage() {
  const [permissions, setPermissions] = useState<Record<Role, Permission[]>>(ROLE_PERMISSIONS)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["posts", "categories"]))
  const [isSaving, setIsSaving] = useState(false)

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const handleTogglePermission = (role: Role, permission: Permission) => {
    if (role === "superadmin") {
      toast.error("Tidak dapat mengubah izin untuk Super Admin")
      return
    }

    setPermissions(prev => {
      const rolePerms = prev[role] || []
      const hasPerm = rolePerms.includes(permission)
      
      return {
        ...prev,
        [role]: hasPerm 
          ? rolePerms.filter(p => p !== permission)
          : [...rolePerms, permission]
      }
    })
  }

  const handleToggleGroup = (role: Role, groupPerms: Permission[], isAllEnabled: boolean) => {
    if (role === "superadmin") {
      toast.error("Tidak dapat mengubah izin untuk Super Admin")
      return
    }

    setPermissions(prev => {
      const rolePerms = new Set(prev[role] || [])
      
      if (isAllEnabled) {
        // Disable all in group
        groupPerms.forEach(p => rolePerms.delete(p))
      } else {
        // Enable all in group
        groupPerms.forEach(p => rolePerms.add(p))
      }
      
      return {
        ...prev,
        [role]: Array.from(rolePerms) as Permission[]
      }
    })
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Pengaturan Peran & Izin berhasil disimpan!")
      // In a real app, you would make an API call here to update the DB
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Manajemen Peran & Izin (RBAC)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Atur hak akses untuk masing-masing peran (role) dalam sistem.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <SaveIcon className="size-4" />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg flex gap-3 text-sm border border-amber-200 dark:border-amber-900">
        <InfoIcon className="size-5 shrink-0" />
        <div>
          <p className="font-semibold mb-1">Catatan Demonstrasi</p>
          <p>
            Ini adalah simulasi UI untuk manajemen peran. Super Admin memiliki akses penuh dan tidak dapat dimodifikasi. Perubahan yang Anda lakukan di sini tidak akan disimpan ke database secara permanen pada versi starter kit ini.
          </p>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px] sticky left-0 z-20 bg-muted/30 border-r min-w-[300px] font-bold text-foreground">
                  Modul & Izin
                </TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role.id} className="text-center min-w-[140px] py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold text-foreground">{role.label}</span>
                      <Badge variant="outline" className={`font-normal ${role.badgeColor}`}>
                        {role.id === "superadmin" && <ShieldCheck className="size-3 mr-1" />}
                        {role.badge}
                      </Badge>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_GROUPS.map((group) => {
                const isExpanded = expandedGroups.has(group.id)
                
                return (
                  <React.Fragment key={group.id}>
                    {/* Group Header */}
                    <TableRow 
                      className="bg-blue-50/40 hover:bg-blue-50/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 cursor-pointer group"
                      onClick={() => toggleGroupExpand(group.id)}
                    >
                      <TableCell className="font-medium text-blue-700 dark:text-blue-400 sticky left-0 z-10 bg-blue-50/40 group-hover:bg-blue-50/60 dark:bg-slate-900/40 dark:group-hover:bg-slate-900/60 border-r border-t border-b font-semibold">
                        <div className="flex items-center gap-2">
                          <group.icon className="size-4" />
                          <span>{group.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="size-4 ml-auto text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-4 ml-auto text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      {ROLES.map((role) => {
                        const rolePerms = permissions[role.id] || []
                        const groupActivePerms = group.permissions.filter(p => rolePerms.includes(p))
                        const isAllEnabled = groupActivePerms.length === group.permissions.length
                        const isSuperAdmin = role.id === "superadmin"
                        
                        return (
                          <TableCell 
                            key={`${role.id}-${group.id}-master`} 
                            className="text-center border-t border-b" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-center">
                              <Switch
                                checked={isAllEnabled}
                                disabled={isSuperAdmin}
                                onCheckedChange={() => handleToggleGroup(role.id, group.permissions, isAllEnabled)}
                                aria-label={`Toggle all ${group.title} for ${role.label}`}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    
                    {/* Group Permissions */}
                    {isExpanded && group.permissions.map((permission) => (
                      <TableRow key={permission}>
                        <TableCell className="sticky left-0 z-10 bg-card border-r align-top">
                          <div className="flex flex-col gap-1 pr-4">
                            <span className="font-medium text-sm text-foreground">{permission}</span>
                            <span className="text-xs text-muted-foreground leading-snug">
                              {PERMISSION_DETAILS[permission] || "Izin khusus sistem"}
                            </span>
                          </div>
                        </TableCell>
                        {ROLES.map((role) => {
                          const hasPerm = permissions[role.id]?.includes(permission)
                          const isSuperAdmin = role.id === "superadmin"
                          
                          return (
                            <TableCell key={`${role.id}-${permission}`} className="text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={hasPerm}
                                  disabled={isSuperAdmin}
                                  onCheckedChange={() => handleTogglePermission(role.id, permission)}
                                  aria-label={`Toggle ${permission} for ${role.label}`}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
