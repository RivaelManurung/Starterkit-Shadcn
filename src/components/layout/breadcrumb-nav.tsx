"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import Link from "next/link"

const routeMap: Record<string, string> = {
  overview: "Overview",
  posts: "Artikel",
  new: "Buat Artikel",
  edit: "Edit",
  categories: "Kategori",
  tags: "Tag",
  users: "Pengguna",
  notifications: "Notifikasi",
  activity: "Log Aktivitas",
  settings: "Pengaturan",
  profile: "Profil",
  appearance: "Tampilan",
  danger: "Zona Bahaya",
  analytics: "Analitik",
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = `/${segments.slice(0, index + 1).join('/')}`
          
          // Try to map segment, if not mapped, it might be an ID so we display "Detail" or something
          let label = routeMap[segment]
          if (!label) {
            // Assume it's a dynamic ID
            label = "Detail"
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
