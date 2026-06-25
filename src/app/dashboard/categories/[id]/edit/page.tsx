"use client"

import * as React from "react"
import { useCategoryStore } from "@/stores/category-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  slug: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  isVisible: z.boolean(),
})

export default function EditCategoryPage() {
  const params = useParams()
  const id = params.id as string
  const categories = useCategoryStore(state => state.categories)
  const updateCategory = useCategoryStore(state => state.updateCategory)
  const router = useRouter()

  const category = categories.find(c => c.id === id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      color: category?.color || "#3b82f6",
      isVisible: category?.isVisible ?? true,
    },
  })

  React.useEffect(() => {
    if (!category) {
      toast.error("Kategori tidak ditemukan")
      router.push("/dashboard/categories")
    }
  }, [category, router])

  if (!category) return null

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCategory(category.id, {
      name: values.name,
      slug: values.slug || category.slug,
      description: values.description || "",
      color: values.color || category.color,
      isVisible: values.isVisible,
    })
    toast.success("Kategori berhasil diperbarui")
    router.push("/dashboard/categories")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Ubah detail kategori <span className="font-medium">{category.name}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>Perbarui nama dan deskripsi kategori.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="teknologi" {...field} />
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
                          <Textarea placeholder="Deskripsi opsional..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/categories")}>
                      Batal
                    </Button>
                    <Button type="submit">
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>Warna dan visibilitas kategori.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warna</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={field.value || "#3b82f6"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10 w-10 rounded-md border cursor-pointer"
                        />
                        <Input
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="#3b82f6"
                          className="font-mono"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Tampilkan Kategori</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">Kategori dapat dilihat publik</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{category.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Artikel</span>
                <span className="font-medium">{category.postCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
