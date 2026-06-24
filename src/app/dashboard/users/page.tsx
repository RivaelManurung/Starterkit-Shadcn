"use client"

import * as React from "react"
import { useUserStore } from "@/stores/user-store"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDelete } from "@/components/shared/confirm-delete"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { User, Role } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const users = useUserStore(state => state.users)
  const deleteUser = useUserStore(state => state.deleteUser)
  const router = useRouter()

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "superadmin":
      case "admin": return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/80">Admin</Badge>
      case "editor": return <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">Editor</Badge>
      case "author": return <Badge variant="secondary">Author</Badge>
      case "viewer": return <Badge variant="outline">Viewer</Badge>
      default: return <Badge>{role}</Badge>
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Pengguna",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.fullName}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Peran",
      cell: ({ row }) => getRoleBadge(row.getValue("role")),
    },
    {
      accessorKey: "postCount",
      header: () => <div className="text-right">Artikel</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("postCount")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Bergabung Pada",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Pengguna?"
                description={`Anda yakin ingin menghapus pengguna "${user.fullName}"?`}
                onConfirm={() => {
                  deleteUser(user.id)
                  toast.success("Pengguna dihapus")
                }}
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    Hapus
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akses dan peran pengguna di dashboard Anda.
          </p>
        </div>
        <Link href="/dashboard/users/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Link>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
