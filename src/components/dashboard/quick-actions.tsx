import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { FileText, Users, Activity, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/posts/new" className={buttonVariants({ variant: "outline", className: "h-24 flex flex-col items-center justify-center gap-2" })}>
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium">Tulis Artikel</span>
        </Link>

        <Link href="/users" className={buttonVariants({ variant: "outline", className: "h-24 flex flex-col items-center justify-center gap-2" })}>
          <Users className="h-6 w-6 text-blue-500" />
          <span className="font-medium">Tambah Pengguna</span>
        </Link>

        <Link href="/settings/appearance" className={buttonVariants({ variant: "outline", className: "h-24 flex flex-col items-center justify-center gap-2" })}>
          <Settings className="h-6 w-6 text-gray-500" />
          <span className="font-medium">Pengaturan</span>
        </Link>

        <Link href="/analytics" className={buttonVariants({ variant: "outline", className: "h-24 flex flex-col items-center justify-center gap-2" })}>
          <Activity className="h-6 w-6 text-green-500" />
          <span className="font-medium">Lihat Analitik</span>
        </Link>
        </div>
      </CardContent>
    </Card>
  )
}
