"use client"

import * as React from "react"
import { useCategoryStore } from "@/store/category-store"
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
import { Textarea } from "@/components/ui/textarea"
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
import { Category } from "@/types"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  description: z.string().optional(),
})

export default function CategoriesPage() {
  const categories = useCategoryStore(state => state.categories)
  const createCategory = useCategoryStore(state => state.createCategory)
  const updateCategory = useCategoryStore(state => state.updateCategory)
  const deleteCategory = useCategoryStore(state => state.deleteCategory)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      form.reset({
        name: category.name,
        description: category.description || "",
      })
    } else {
      setEditingCategory(null)
      form.reset({ name: "", description: "" })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { ...values, color: editingCategory.color })
      toast.success("Kategori berhasil diperbarui")
    } else {
      createCategory({ ...values, color: "var(--primary)" })
      toast.success("Kategori berhasil dibuat")
    }
    setIsDialogOpen(false)
  }

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const desc = row.getValue("description") as string
        return desc ? <span className="truncate max-w-[300px] inline-block">{desc}</span> : <span className="text-muted-foreground">-</span>
      }
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
        const category = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDelete
                title="Hapus Kategori?"
                description={`Anda yakin ingin menghapus kategori "${category.name}"?`}
                onConfirm={() => {
                  deleteCategory(category.id)
                  toast.success("Kategori dihapus")
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
          <h1 className="text-2xl font-semibold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengelompokkan artikel Anda.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <DataTable columns={columns} data={categories} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Ubah detail kategori ini.' : 'Buat kategori baru untuk mengorganisasi artikel Anda.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Teknologi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi opsional..." {...field} />
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
