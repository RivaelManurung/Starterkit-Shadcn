"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map route paths to readable names
const routeMap: Record<string, string> = {
  dashboard: "Overview",
  posts: "Artikel",
  categories: "Kategori",
  tags: "Tag",
  users: "Pengguna",
  notifications: "Notifikasi",
  "activity-logs": "Log Aktivitas",
  analytics: "Analitik",
  settings: "Pengaturan",
  help: "Bantuan",
  new: "Tambah Baru",
  edit: "Edit",
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  
  // Don't render on root or just /dashboard if you want it cleaner
  if (pathname === "/" || pathname === "/dashboard") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const paths = pathname.split("/").filter(Boolean)
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard" />}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {paths.map((path, index) => {
          if (path === "dashboard") return null // Already added above
          
          const isLast = index === paths.length - 1
          
          // Try to get a readable name, fallback to capitalized path
          const readableName = routeMap[path] || 
            (path.length > 15 ? `${path.substring(0, 8)}...` : path.charAt(0).toUpperCase() + path.slice(1))
            
          const href = `/${paths.slice(0, index + 1).join("/")}`

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{readableName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {readableName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
