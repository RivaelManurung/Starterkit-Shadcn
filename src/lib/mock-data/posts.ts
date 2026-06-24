import { Post } from "@/types"
import { mockUsers } from "./users"
import { mockCategories } from "./categories"
import { mockTags } from "./tags"

const TITLES = [
  "Panduan Lengkap Next.js 15 App Router",
  "Mengapa Tailwind CSS Menjadi Standar Industri",
  "Tips Membangun Dashboard yang Interaktif",
  "Cara Menggunakan Zustand untuk State Management",
  "Mengenal React Server Components",
  "Integrasi Shadcn UI di Proyek Next.js",
  "10 Ekstensi VS Code Terbaik untuk Developer",
  "Membuat Animasi Smooth dengan Framer Motion",
  "Manajemen Form Mudah dengan React Hook Form & Zod",
  "Optimasi SEO di Aplikasi React",
  "Tren Desain UI/UX di Tahun Ini",
  "Mengamankan Aplikasi Web dari Serangan XSS",
  "Deploy Aplikasi Next.js ke Vercel",
  "Membangun API Cepat dengan Hono",
  "Belajar TypeScript dari Nol"
]

const STATUSES: Post["status"][] = [
  "published", "published", "published", "published", "published",
  "published", "draft", "scheduled", "archived", "published",
  "published", "draft", "published", "scheduled", "published",
  "published", "archived", "published", "draft", "published",
  "published", "published", "draft", "published", "scheduled",
  "published", "draft", "published", "archived", "published",
  "published", "draft", "published", "published", "scheduled",
  "published", "draft", "archived", "published", "published",
  "published", "draft", "scheduled", "published", "archived",
  "published", "published", "draft", "published", "scheduled",
]

const VIEW_COUNTS = [
  9834, 7210, 5623, 8450, 3120, 12300, 0, 0, 0, 6700,
  4510, 0, 9100, 0, 7800, 2340, 0, 5670, 0, 8900,
  11200, 3450, 0, 7600, 0, 4300, 0, 6780, 0, 9210,
  5430, 0, 8760, 2100, 0, 7890, 0, 0, 4560, 3210,
  6780, 0, 0, 9100, 0, 5430, 8760, 0, 7890, 0,
]

const AUTHORS = [1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2]

export const mockPosts: Post[] = Array.from({ length: 50 }).map((_, i) => {
  const title = TITLES[i % TITLES.length] + (i >= TITLES.length ? ` Bagian ${Math.floor(i / TITLES.length) + 1}` : "")
  const status = STATUSES[i]
  const authorIdx = AUTHORS[i]
  const author = mockUsers[authorIdx]
  const category = mockCategories[i % mockCategories.length]
  const numTags = (i % 4) + 1
  const tags = mockTags.slice(i % (mockTags.length - numTags), i % (mockTags.length - numTags) + numTags)
  const viewCount = status === "published" ? VIEW_COUNTS[i] : 0

  // Deterministic dates
  const month = String((i % 12) + 1).padStart(2, "0")
  const day = String((i % 28) + 1).padStart(2, "0")
  const createdAt = new Date(`2025-${month}-${day}`)
  const publishedAt = status === "published" ? new Date(`2025-${month}-${String(Math.min((i % 28) + 2, 28)).padStart(2, "0")}`) : null
  const scheduledAt = status === "scheduled" ? new Date("2026-07-15") : null

  return {
    id: `post_${i + 1}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: `Ini adalah ringkasan dari artikel ${title}. Artikel ini membahas berbagai aspek penting yang perlu Anda ketahui.`,
    content: `Ini adalah konten untuk **${title}**.\n\nDibuat menggunakan editor artikel.\n\nArtikle ini membahas topik-topik penting yang perlu diketahui oleh setiap developer modern.`,
    coverImage: `https://picsum.photos/seed/${i + 1}/800/400`,
    coverImageAlt: title,
    status,
    visibility: i % 10 === 0 ? "members_only" : "public",
    password: null,
    authorId: author.id,
    author,
    coAuthors: [],
    categoryId: category.id,
    category,
    tags,
    seo: {
      metaTitle: title,
      metaDescription: `Ringkasan SEO untuk ${title}`,
      focusKeyword: "nextjs, react",
      canonicalUrl: null,
      ogTitle: title,
      ogDescription: null,
      ogImage: null,
      twitterTitle: null,
      twitterDescription: null,
      twitterImage: null,
      noIndex: false,
      noFollow: false,
      schema: null,
    },
    readingTime: (i % 10) + 2,
    wordCount: ((i + 1) * 137) % 1000 + 300,
    viewCount,
    likeCount: status === "published" ? (i * 17) % 500 : 0,
    commentCount: status === "published" ? (i * 7) % 50 : 0,
    shareCount: status === "published" ? (i * 11) % 100 : 0,
    isFeatured: i % 10 === 0,
    isPinned: i % 20 === 0,
    allowComments: true,
    allowReactions: true,
    scheduledAt,
    publishedAt,
    archivedAt: status === "archived" ? new Date("2026-01-01") : null,
    createdAt,
    updatedAt: new Date("2026-06-01"),
    version: 1,
    revisions: [],
    customFields: {},
  }
})
