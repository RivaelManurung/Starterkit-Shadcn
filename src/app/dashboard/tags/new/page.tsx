"use client"

import * as React from "react"
import { useTagStore } from "@/stores/tag-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
})

export default function NewTagPage() {
  const createTag = useTagStore(state => state.createTag)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTag({ ...values, color: "var(--primary)" })
    toast.success("Tag berhasil dibuat")
    router.push("/dashboard/tags")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tags" className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Tag Baru</h1>
          <p className="text-sm text-muted-foreground">
            Buat tag baru.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Tag</CardTitle>
          <CardDescription>Masukkan nama tag.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/tags")}>
                  Batal
                </Button>
                <Button type="submit">
                  Simpan Tag
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
