"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { KBarProvider } from "kbar"
import { useTheme } from "@/components/themes/ThemeProvider"

export function KBarClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const actions = React.useMemo(() => [
    {
      id: "dashboard",
      name: "Dashboard Overview",
      shortcut: ["g", "d"],
      keywords: "overview home dashboard",
      perform: () => router.push("/dashboard"),
    },
    {
      id: "posts",
      name: "Artikel / Posts",
      shortcut: ["g", "p"],
      keywords: "posts artikel tulisan",
      perform: () => router.push("/dashboard/posts"),
    },
    {
      id: "categories",
      name: "Kategori",
      shortcut: ["g", "c"],
      keywords: "categories kategori",
      perform: () => router.push("/dashboard/categories"),
    },
    {
      id: "tags",
      name: "Tag",
      shortcut: ["g", "t"],
      keywords: "tags tag",
      perform: () => router.push("/dashboard/tags"),
    },
    {
      id: "users",
      name: "Pengguna / Users",
      shortcut: ["g", "u"],
      keywords: "users pengguna anggota",
      perform: () => router.push("/dashboard/users"),
    },
    {
      id: "analytics",
      name: "Analitik",
      shortcut: ["g", "a"],
      keywords: "analytics analitik statistik",
      perform: () => router.push("/dashboard/analytics"),
    },
    {
      id: "kanban",
      name: "Kanban Board",
      shortcut: ["g", "k"],
      keywords: "kanban board task project",
      perform: () => router.push("/dashboard/kanban"),
    },
    {
      id: "activity",
      name: "Log Aktivitas",
      shortcut: ["g", "l"],
      keywords: "logs aktivitas log activity",
      perform: () => router.push("/dashboard/activity"),
    },
    {
      id: "notifications",
      name: "Notifikasi",
      shortcut: ["g", "n"],
      keywords: "notifications notifikasi bell",
      perform: () => router.push("/dashboard/notifications"),
    },
    {
      id: "new-post",
      name: "Buat Artikel Baru",
      shortcut: ["c", "p"],
      keywords: "create write post new artikel baru",
      perform: () => router.push("/dashboard/posts/new"),
    },
    {
      id: "toggle-theme",
      name: "Toggle Dark Mode",
      shortcut: ["t", "t"],
      keywords: "theme dark light mode toggle",
      perform: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    }
  ], [router, theme, setTheme, resolvedTheme])

  return (
    <KBarProvider actions={actions}>
      {children}
    </KBarProvider>
  )
}
