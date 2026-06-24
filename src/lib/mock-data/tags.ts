import { Tag } from "@/types"

const TAG_NAMES = [
  "React", "Next.js", "Tailwind CSS", "TypeScript", "JavaScript",
  "Frontend", "Backend", "Fullstack", "Web Dev", "Mobile Dev",
  "UI/UX", "Design System", "Figma", "Startup", "Bisnis Online",
  "Marketing", "SEO", "Content Creator", "Produktivitas", "Kesehatan",
  "Olah Raga", "Kuliner", "Travel", "Finansial", "Investasi",
  "Crypto", "AI", "Machine Learning", "Data Science", "Python"
]

const POST_COUNTS = [
  12, 8, 25, 19, 30, 15, 10, 7, 22, 5,
  18, 3, 11, 6, 9, 20, 14, 4, 16, 2,
  13, 17, 8, 21, 7, 11, 28, 15, 9, 24
]

export const mockTags: Tag[] = TAG_NAMES.map((name, i) => ({
  id: `tag_${i + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  description: `Artikel terkait dengan ${name}`,
  color: `hsl(${i * 12}, 70%, 50%)`,
  postCount: POST_COUNTS[i],
  createdAt: new Date(`2024-0${(i % 9) + 1}-01`),
  updatedAt: new Date("2026-06-01"),
}))
