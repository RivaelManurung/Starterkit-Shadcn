"use client"

import * as React from "react"
import { useCategoryStore } from "@/stores/category-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  description: z.string().optional(),
})

export default function NewCategoryPage() {
  const createCategory = useCategoryStore(state => state.createCategory)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCategory({ ...values, color: "var(--primary)" })
    toast.success("Kategori berhasil dibuat")
    router.push("/dashboard/categories")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Kategori Baru</h1>
          <p className="text-sm text-muted-foreground">
            Buat kategori baru untuk mengorganisasi artikel Anda.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Kategori</CardTitle>
          <CardDescription>Masukkan detail informasi kategori.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
                  Simpan Kategori
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
