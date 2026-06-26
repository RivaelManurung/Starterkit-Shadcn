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
import dynamic from "next/dynamic"
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg w-full" />,
  }
)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { usePostStore } from "@/stores/post-store"
import { useCategoryStore } from "@/stores/category-store"
import { useTagStore } from "@/stores/tag-store"
import { useAuthStore } from "@/stores/auth-store"
import { Post, Category, Tag } from "@/types"
const generateSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

const formSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  content: z.string().min(10, "Konten minimal 10 karakter."),
  excerpt: z.string().max(200, "Excerpt maksimal 200 karakter.").optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
  tagIds: z.array(z.string()),
  status: z.enum(["published", "draft", "archived", "scheduled", "under_review"]),
})

interface PostFormProps {
  initialData?: Post
}

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const createPost = usePostStore(state => state.createPost)
  const updatePost = usePostStore(state => state.updatePost)
  const categories = useCategoryStore((state) => state.categories)
  const tags = useTagStore((state) => state.tags)
  const currentUser = useAuthStore(state => state.currentUser)

  const storageKey = initialData ? `post_draft_edit_${initialData.id}` : "post_draft_new"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          content: initialData.content,
          excerpt: stripHtml(initialData.excerpt || ""),
          categoryId: initialData.categoryId || "",
          tagIds: initialData.tags?.map(t => t.id) || [],
          status: initialData.status,
        }
      : {
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          categoryId: "",
          tagIds: [],
          status: "draft",
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

    localStorage.removeItem(storageKey)

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
    router.push("/dashboard/posts")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          storageKey={storageKey}
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
                render={({ field }) => {
                  const statusLabels: Record<string, string> = {
                    draft: "Draft",
                    published: "Published",
                    scheduled: "Scheduled",
                    archived: "Archived",
                    under_review: "Under Review",
                  }
                  const selectedStatusLabel = statusLabels[field.value] || field.value
                  return (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status">
                              {selectedStatusLabel}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

            </div>

            <div className="p-6 rounded-xl border bg-card space-y-4">
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Simpan Perubahan
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                  Batal
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
                render={({ field }) => {
                  const selectedCatName = categories.find((c: Category) => c.id === field.value)?.name || field.value
                  return (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori">
                              {selectedCatName || "Pilih kategori"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c: Category) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
                        {tags.map((tag: Tag) => (
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
                                  <Checkbox
                                    checked={field.value?.includes(tag.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tag.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tag.id
                                            )
                                          )
                                    }}
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
