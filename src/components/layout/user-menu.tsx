"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActivityStore } from "@/stores/activity-store"

import { useAuthStore } from "@/stores/auth-store"

export function UserMenu() {
  const user = useAuthStore(state => state.currentUser)
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    useActivityStore.getState().addLog({
      action: "logout",
      userId: user.id,
      entityId: user.id,
      entity: "user",
      entityTitle: user.fullName,
      description: "User logged out",
      oldValue: null,
      newValue: null,
      user: user as unknown as import("@/types").ActivityLog["user"],
      ipAddress: "127.0.0.1",
      userAgent: "browser",
      sessionId: "session",
      duration: 0,
      status: "success",
      metadata: {},
      createdAt: new Date()
    } as Omit<import("@/types").ActivityLog, "id" | "createdAt">)
    router.push('/login')
  }

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-full ring-ring focus-visible:ring-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link href="/dashboard/settings/profile" className="cursor-pointer flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link href="/dashboard/settings/appearance" className="cursor-pointer flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center" variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
