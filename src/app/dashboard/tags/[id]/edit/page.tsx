"use client"

import * as React from "react"
import { useTagStore } from "@/stores/tag-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
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
  FormDescription,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  slug: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
})

export default function EditTagPage() {
  const params = useParams()
  const id = params.id as string
  const tags = useTagStore(state => state.tags)
  const updateTag = useTagStore(state => state.updateTag)
  const router = useRouter()

  const tag = tags.find(t => t.id === id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tag?.name || "",
      slug: tag?.slug || "",
      description: tag?.description || "",
      color: tag?.color || "#6366f1",
    },
  })

  React.useEffect(() => {
    if (!tag) {
      toast.error("Tag tidak ditemukan")
      router.push("/dashboard/tags")
    }
  }, [tag, router])

  if (!tag) return null

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateTag(tag.id, {
      name: values.name,
      slug: values.slug || tag.slug,
      description: values.description || "",
      color: values.color || tag.color,
    })
    toast.success("Tag berhasil diperbarui")
    router.push("/dashboard/tags")
  }

  const watchedColor = form.watch("color")
  const watchedName = form.watch("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tags" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Tag</h1>
          <p className="text-sm text-muted-foreground">
            Ubah nama tag <span className="font-medium">{tag.name}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tag</CardTitle>
              <CardDescription>Perbarui nama dan detail tag.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="next-js" {...field} />
                        </FormControl>
                        <FormDescription>Digunakan di URL artikel.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Deskripsi singkat tentang tag ini..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/tags")}>
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
              <CardTitle>Warna Tag</CardTitle>
              <CardDescription>Warna yang muncul pada badge tag.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={field.value || "#6366f1"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10 w-10 rounded-md border cursor-pointer"
                        />
                        <Input
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="#6366f1"
                          className="font-mono"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <Badge
                  style={{
                    backgroundColor: watchedColor ? `${watchedColor}20` : undefined,
                    color: watchedColor || undefined,
                    borderColor: watchedColor ? `${watchedColor}50` : undefined,
                  }}
                  variant="outline"
                >
                  {watchedName || tag.name}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{tag.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Artikel</span>
                <span className="font-medium">{tag.postCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
