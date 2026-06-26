"use client"

import * as React from "react"
import { usePenggunaStore, Pengguna, PenggunaRole } from "@/stores/usePenggunaStore"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface EditRoleModalProps {
  user: Pengguna | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRoleModal({ user, open, onOpenChange }: EditRoleModalProps) {
  const updateRole = usePenggunaStore((state) => state.updateRole)
  const [role, setRole] = React.useState<PenggunaRole>("author")

  React.useEffect(() => {
    if (user) {
      setRole(user.role)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    updateRole(user.id, role)
    toast.success(`Berhasil mengubah peran ${user.nama} menjadi ${role}`)
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Peran Pengguna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1 text-sm">
            <span className="text-xs font-semibold">Pengguna</span>
            <p className="font-medium">{user.nama}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-role" className="text-xs font-semibold">Pilih Peran Baru</Label>
            <Select
              value={role}
              onValueChange={(val: any) => setRole(val)}
            >
              <SelectTrigger id="edit-role" className="rounded-lg text-xs w-full">
                <SelectValue placeholder="Pilih peran">
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Pilih peran"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin" className="text-xs">Superadmin</SelectItem>
                <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                <SelectItem value="editor" className="text-xs">Editor</SelectItem>
                <SelectItem value="author" className="text-xs">Author</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold rounded-lg"
            >
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
