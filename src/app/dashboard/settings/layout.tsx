"use client"

import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarNavItems = [
  {
    title: "Akun",
    value: "account",
    href: "/dashboard/settings/account",
  },
  {
    title: "Peran & Izin",
    value: "roles",
    href: "/dashboard/settings/roles",
  },
  {
    title: "Notifikasi",
    value: "notifications",
    href: "/dashboard/settings/notifications",
  },
  {
    title: "Tampilan",
    value: "appearance",
    href: "/dashboard/settings/appearance",
  },
  {
    title: "Keamanan",
    value: "security",
    href: "/dashboard/settings/security",
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = sidebarNavItems.find((item) => pathname.startsWith(item.href))?.value || "account"

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola preferensi akun dan tampilan dashboard Anda.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8">
        <Tabs value={currentTab} onValueChange={(value) => {
          const item = sidebarNavItems.find((i) => i.value === value)
          if (item) router.push(item.href)
        }} className="w-full">
          <TabsList className="flex flex-wrap h-auto w-full justify-start">
            {sidebarNavItems.map((item) => (
              <TabsTrigger 
                key={item.value} 
                value={item.value} 
                className="flex-1 sm:flex-none"
              >
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  )
}
