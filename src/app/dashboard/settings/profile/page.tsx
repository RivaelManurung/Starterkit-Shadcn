"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { toast } from "sonner"
import { useSettingsStore } from "@/stores/settings-store"
import { useUserStore } from "@/stores/user-store"
import { useAuthStore } from "@/stores/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsProfilePage() {
  const currentUser = useAuthStore(state => state.currentUser)
  const updateUser = useUserStore((state) => state.updateUser)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.fullName || "",
      email: currentUser?.email || "",
      bio: "Saya adalah seorang pengguna di StarterKit Dashboard.",
    },
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    if (currentUser) {
      updateUser(currentUser.id, {
        fullName: data.name,
        email: data.email,
      })
      toast.success("Profil berhasil diperbarui")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Informasi publik mengenai akun Anda.
        </p>
      </div>
      
      <div className="flex items-center gap-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentUser?.avatar || undefined} alt="Avatar" />
          <AvatarFallback className="text-xl">
            {currentUser?.fullName?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline">Ubah Avatar</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Anda" {...field} />
                </FormControl>
                <FormDescription>
                  Nama yang akan ditampilkan di seluruh sistem.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@contoh.com" {...field} />
                </FormControl>
                <FormDescription>
                  Gunakan email aktif agar tidak tertinggal pemberitahuan.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ceritakan sedikit tentang Anda"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Deskripsi singkat tentang diri Anda. Opsional.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profil</Button>
        </form>
      </Form>
    </div>
  )
}
