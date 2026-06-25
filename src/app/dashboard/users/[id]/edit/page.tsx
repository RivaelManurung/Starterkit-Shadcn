"use client"

import * as React from "react"
import { useUserStore } from "@/stores/user-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, User as UserIcon, Shield, Settings, Link as LinkIcon, Briefcase, MapPin, Globe, Phone, Mail, UserCircle2 } from "lucide-react"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"

const formSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter."),
  username: z.string().min(3, "Username minimal 3 karakter."),
  email: z.string().email("Email tidak valid."),
  phone: z.string().optional(),
  
  bio: z.string().max(500, "Bio maksimal 500 karakter.").optional(),
  website: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  instagram: z.string().optional(),

  role: z.enum(["superadmin", "admin", "editor", "author", "viewer", "moderator"]),
  status: z.enum(["active", "suspended", "pending", "banned"]),
  twoFactorEnabled: z.boolean(),
  emailVerified: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  author: "Author",
  moderator: "Moderator",
  viewer: "Viewer",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  inactive: "Tidak Aktif",
  suspended: "Ditangguhkan",
  pending: "Menunggu Verifikasi",
  banned: "Diblokir",
}

export default function EditUserPage() {
  const params = useParams()
  const id = params.id as string
  const users = useUserStore(state => state.users)
  const updateUser = useUserStore(state => state.updateUser)
  const router = useRouter()

  const user = users.find(u => u.id === id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      
      bio: user?.profile?.bio || "",
      website: user?.profile?.website || "",
      company: user?.profile?.company || "",
      jobTitle: user?.profile?.jobTitle || "",
      location: user?.profile?.location || "",
      
      twitter: user?.profile?.socialLinks?.twitter || "",
      linkedin: user?.profile?.socialLinks?.linkedin || "",
      github: user?.profile?.socialLinks?.github || "",
      instagram: user?.profile?.socialLinks?.instagram || "",

      role: user?.role || "author",
      status: user?.status || "active",
      twoFactorEnabled: user?.twoFactorEnabled || false,
      emailVerified: user?.emailVerified || false,
    },
  })

  React.useEffect(() => {
    if (!user) {
      toast.error("Pengguna tidak ditemukan")
      router.push("/dashboard/users")
    }
  }, [user, router])

  if (!user) return null

  const onSubmit = (values: FormValues) => {
    // In a real app, you would send this to your API
    updateUser(user.id, {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      role: values.role,
      status: values.status,
      twoFactorEnabled: values.twoFactorEnabled,
      emailVerified: values.emailVerified,
      profile: {
        ...user.profile,
        bio: values.bio || null,
        phone: values.phone || null,
        website: values.website || null,
        company: values.company || null,
        jobTitle: values.jobTitle || null,
        location: values.location || null,
        socialLinks: {
          twitter: values.twitter || null,
          linkedin: values.linkedin || null,
          github: values.github || null,
          instagram: values.instagram || null,
        }
      }
    })
    toast.success("Profil pengguna berhasil diperbarui")
    router.push("/dashboard/users")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users" className={buttonVariants({ variant: "outline", size: "icon", className: "shrink-0" })}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Pengguna</h1>
            <p className="text-sm text-muted-foreground">
              Perbarui profil, akses, dan preferensi untuk <span className="font-medium text-foreground">{user.fullName}</span>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/users")}>
            Batal
          </Button>
          <Button type="submit" form="edit-user-form" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  <AvatarImage src={user.avatar || ""} alt={user.fullName} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-medium">Ubah Foto</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <Badge variant={user.status === "active" ? "default" : "destructive"} className="px-3 py-1 uppercase text-[10px] tracking-wider">
                {STATUS_LABELS[user.status] || user.status}
              </Badge>
            </CardContent>
            <div className="border-t px-6 py-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bergabung</span>
                <span className="font-medium">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Login Terakhir</span>
                <span className="font-medium">{user.lastLoginAt ? formatDate(user.lastLoginAt) : "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Peran</span>
                <span className="font-medium capitalize text-blue-600 dark:text-blue-400">{ROLE_LABELS[user.role]}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form Content */}
        <div className="lg:col-span-3">
          <Form {...form}>
            <form id="edit-user-form" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <UserCircle2 className="size-4" /> <span className="hidden sm:inline">Akun Dasar</span>
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <Briefcase className="size-4" /> <span className="hidden sm:inline">Profil Pribadi</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="size-4" /> <span className="hidden sm:inline">Keamanan & Akses</span>
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: AKUN */}
                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Akun Dasar</CardTitle>
                      <CardDescription>
                        Data utama kredensial dan identitas pengguna di dalam sistem.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="John Doe" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground font-medium">@</span>
                                  <Input className="pl-9" placeholder="johndoe" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alamat Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="john@example.com" type="email" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Telepon</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="+62 812..." {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* TAB 2: PROFIL */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profil Publik</CardTitle>
                      <CardDescription>
                        Informasi ini mungkin akan ditampilkan secara publik di halaman penulis/pengguna.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biodata Singkat</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Ceritakan sedikit tentang pengguna ini..." 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>Maksimal 500 karakter.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jabatan / Profesi</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="Software Engineer" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Perusahaan / Institusi</FormLabel>
                              <FormControl>
                                <Input placeholder="Tech Corp" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lokasi</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="Jakarta, Indonesia" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Situs Web Pribadi</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="https://johndoe.com" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tautan Sosial Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter (X)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/johndoe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/johndoe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram</FormLabel>
                              <FormControl>
                                <Input placeholder="https://instagram.com/johndoe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* TAB 3: KEAMANAN & AKSES */}
                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Peran & Izin Hak Akses</CardTitle>
                      <CardDescription>
                        Kontrol tingkat akses pengguna ini di dalam dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Peran Sistem</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih peran" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Peran menentukan batas akses menu dan fitur.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status Akun</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Mengubah status ke blokir akan menghentikan akses sesi pengguna ini.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Keamanan Lanjutan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="emailVerified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Terverifikasi</FormLabel>
                              <FormDescription>
                                Tandai alamat email pengguna sebagai sudah diverifikasi secara manual.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twoFactorEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Otentikasi Dua Faktor (2FA)</FormLabel>
                              <FormDescription>
                                Aktifkan lapisan keamanan tambahan wajib untuk akun ini.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
