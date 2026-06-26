import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PenggunaRole = "superadmin" | "admin" | "editor" | "author"
export type PenggunaStatus = "Aktif" | "Nonaktif"

export interface Pengguna {
  id: string
  nama: string
  email: string
  role: PenggunaRole
  status: PenggunaStatus
  avatar: string // initials e.g. "AU"
  createdAt: string
}

interface PenggunaState {
  users: Pengguna[]
  addUser: (nama: string, email: string, role: PenggunaRole) => void
  updateRole: (id: string, role: PenggunaRole) => void
  toggleStatus: (id: string) => void
  deleteUser: (id: string) => void
}

const seedPengguna: Pengguna[] = [
  { id: "usr_1", nama: "Admin Utama", email: "admin@example.com", role: "superadmin", status: "Aktif", avatar: "AU", createdAt: "2025-01-01" },
  { id: "usr_2", nama: "Budi Santoso", email: "budi@example.com", role: "admin", status: "Aktif", avatar: "BS", createdAt: "2025-02-15" },
  { id: "usr_3", nama: "Siti Rahma", email: "siti@example.com", role: "editor", status: "Aktif", avatar: "SR", createdAt: "2025-03-10" },
  { id: "usr_4", nama: "Hendra Wijaya", email: "hendra@example.com", role: "author", status: "Aktif", avatar: "HW", createdAt: "2025-04-05" },
  { id: "usr_5", nama: "Dewi Lestari", email: "dewi@example.com", role: "author", status: "Nonaktif", avatar: "DL", createdAt: "2025-04-20" },
  { id: "usr_6", nama: "Rian Hidayat", email: "rian@example.com", role: "editor", status: "Aktif", avatar: "RH", createdAt: "2025-05-01" },
  { id: "usr_7", nama: "Ahmad Fauzi", email: "ahmad@example.com", role: "author", status: "Aktif", avatar: "AF", createdAt: "2025-05-12" },
  { id: "usr_8", nama: "Siska Amelia", email: "siska@example.com", role: "admin", status: "Nonaktif", avatar: "SA", createdAt: "2025-05-18" },
  { id: "usr_9", nama: "Taufik Hidayat", email: "taufik@example.com", role: "author", status: "Aktif", avatar: "TH", createdAt: "2025-06-01" },
  { id: "usr_10", nama: "Yuni Kartika", email: "yuni@example.com", role: "editor", status: "Aktif", avatar: "YK", createdAt: "2025-06-15" },
]

export const usePenggunaStore = create<PenggunaState>()(
  persist(
    (set) => ({
      users: seedPengguna,

      addUser: (nama, email, role) =>
        set((state) => {
          const initials = nama
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()

          const newUser: Pengguna = {
            id: `usr_${Math.random().toString(36).substring(2, 9)}`,
            nama,
            email,
            role,
            status: "Aktif",
            avatar: initials || "US",
            createdAt: new Date().toISOString().split("T")[0],
          }
          return { users: [newUser, ...state.users] }
        }),

      updateRole: (id, role) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
        })),

      toggleStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "Aktif" ? "Nonaktif" : "Aktif" }
              : u
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
    }),
    {
      name: "pengguna-store",
    }
  )
)
