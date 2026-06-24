"use client"

import * as React from "react"
import { useTagStore } from "@/store/tag-store"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tag } from "@/types"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
})

export default function TagsPage() {
  const tags = useTagStore(state => state.tags)
  const createTag = useTagStore(state => state.createTag)
  const updateTag = useTagStore(state => state.updateTag)
  const deleteTag = useTagStore(state => state.deleteTag)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag)
      form.reset({
        name: tag.name,
      })
    } else {
      setEditingTag(null)
      form.reset({ name: "" })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingTag) {
      updateTag(editingTag.id, { ...values, color: editingTag.color })
      toast.success("Tag berhasil diperbarui")
    } else {
      createTag({ ...values, color: "var(--primary)" })
      toast.success("Tag berhasil dibuat")
    }
    setIsDialogOpen(false)
  }

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
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
      header: "Tanggal Dibuat",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tag = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleOpenDialog(tag)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Tag?"
                description={`Anda yakin ingin menghapus tag "${tag.name}"?`}
                onConfirm={() => {
                  deleteTag(tag.id)
                  toast.success("Tag dihapus")
                }}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
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
          <h1 className="text-2xl font-semibold tracking-tight">Tag</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tag untuk label artikel Anda.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tag
        </Button>
      </div>

      <DataTable columns={columns} data={tags} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Tambah Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag ? 'Ubah nama tag ini.' : 'Buat tag baru.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Next.js" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
