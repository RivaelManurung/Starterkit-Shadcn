"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePostStore } from "@/store/post-store"
import { useCategoryStore } from "@/store/category-store"
import { useTagStore } from "@/store/tag-store"
import { Post } from "@/types"
import { useSettingsStore } from "@/store/settings-store"
import { generateSlug } from "@/lib/mock/utils"

const formSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  content: z.string().min(10, "Konten minimal 10 karakter."),
  excerpt: z.string().max(200, "Excerpt maksimal 200 karakter.").optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
  tagIds: z.array(z.string()),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED", "SCHEDULED"]),
})

interface PostFormProps {
  initialData?: Post
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const createPost = usePostStore(state => state.createPost)
  const updatePost = usePostStore(state => state.updatePost)
  const categories = useCategoryStore((state) => state.getCategories())
  const tags = useTagStore((state) => state.getTags())
  const currentUser = useSettingsStore((state) => state.getCurrentUser())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          content: initialData.content,
          excerpt: initialData.excerpt || "",
          categoryId: initialData.categoryId,
          tagIds: initialData.tagIds,
          status: initialData.status,
        }
      : {
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          categoryId: "",
          tagIds: [],
          status: "DRAFT",
        },
  })

  // Auto-generate slug from title if not editing
  const title = form.watch("title")
  React.useEffect(() => {
    if (!initialData && title && !form.formState.dirtyFields.slug) {
      form.setValue("slug", generateSlug(title), { shouldValidate: true })
    }
  }, [title, initialData, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast.error("Anda harus login untuk membuat artikel.")
      return
    }

    if (initialData) {
      updatePost(initialData.id, values)
      toast.success("Artikel berhasil diperbarui.")
    } else {
      createPost({
        ...values,
        excerpt: values.excerpt || "",
        authorId: currentUser.id,
      })
      toast.success("Artikel berhasil dibuat.")
    }
    router.push("/posts")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border bg-card">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Artikel</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul artikel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konten</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tulis konten Anda di sini..." 
                          className="min-h-[400px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="p-6 rounded-xl border bg-card">
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt / Ringkasan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ringkasan singkat artikel..." 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Opsional. Maksimal 200 karakter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex gap-2">
                <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                  Batal
                </Button>
                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="judul-artikel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* For simplicity, Tags is handled via simple select or list, let's just use checkboxes or multi-select. 
                  Since Shadcn doesn't have a multi-select out of the box, we can use a group of checkboxes. */}
              <FormField
                control={form.control}
                name="tagIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Tags</FormLabel>
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {tags.map((tag) => (
                        <FormField
                          key={tag.id}
                          control={form.control}
                          name="tagIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tag.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value?.includes(tag.id)}
                                    onChange={(checked) => {
                                      return checked.target.checked
                                        ? field.onChange([...field.value, tag.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tag.id
                                            )
                                          )
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {tag.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
