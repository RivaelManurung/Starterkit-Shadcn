import { PenggunaTable } from "@/features/pengguna/components/PenggunaTable"
import { UndangPenggunaModal } from "@/features/pengguna/components/UndangPenggunaModal"

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akses dan peran pengguna di dashboard Anda.
          </p>
        </div>
        <UndangPenggunaModal />
      </div>

      <PenggunaTable />
    </div>
  )
}
