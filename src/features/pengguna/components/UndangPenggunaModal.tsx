"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { usePenggunaStore, PenggunaRole } from "@/stores/usePenggunaStore"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function UndangPenggunaModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const addUser = usePenggunaStore((state) => state.addUser)

  const [nama, setNama] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<PenggunaRole>("author")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim() || !email.trim()) {
      return
    }

    addUser(nama, email, role)
    toast.success(`Berhasil mengundang ${nama} sebagai ${role}`)
    setIsOpen(false)
    setNama("")
    setEmail("")
    setRole("author")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button className="rounded-xl font-semibold h-9 text-xs" />}>
        <Plus className="h-4 w-4 mr-2" />
        Undang Pengguna
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Undang Pengguna Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="nama" className="text-xs font-semibold">Nama Lengkap</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="rounded-lg text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
              className="rounded-lg text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold">Peran / Role</Label>
            <Select
              value={role}
              onValueChange={(val: any) => setRole(val)}
            >
              <SelectTrigger className="rounded-lg text-xs w-full">
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
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold rounded-lg"
            >
              Kirim Undangan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
