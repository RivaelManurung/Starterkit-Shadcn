"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Calculator, 
  Settings, 
  User,
  FileText,
  FolderTree,
  Tags
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ketik perintah atau cari..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil yang ditemukan.</CommandEmpty>
        <CommandGroup heading="Navigasi Cepat">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/posts"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Artikel</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/categories"))}>
            <FolderTree className="mr-2 h-4 w-4" />
            <span>Kategori</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tags"))}>
            <Tags className="mr-2 h-4 w-4" />
            <span>Tag</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/users"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Pengguna</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pengaturan">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil Saya</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan Sistem</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
