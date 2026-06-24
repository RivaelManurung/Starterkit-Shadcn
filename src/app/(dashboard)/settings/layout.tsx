"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/settings/profile",
  },
  {
    title: "Tampilan",
    href: "/settings/appearance",
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola preferensi akun dan tampilan dashboard Anda.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                  pathname === item.href
                    ? "bg-muted"
                    : "transparent"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
