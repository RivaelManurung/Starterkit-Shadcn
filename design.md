# Design System (Shadcn UI)

Dokumen ini berisi rangkuman sistem desain (Design System) yang saat ini digunakan di dalam proyek berdasarkan konfigurasi Shadcn UI (v4) dan Tailwind CSS (v4).

## 1. Konfigurasi Dasar
- **Style Shadcn UI**: `base-vega`
- **Base Color**: `neutral`
- **CSS Variables**: `true` (Menggunakan OKLCH untuk rentang warna yang lebih luas dan modern)
- **Library Ikon**: `lucide-react`
- **Tailwind Version**: v4

## 2. Tipografi (Typography)
Desain ini menggunakan font bawaan dari Vercel/Next.js:
- **Sans Serif**: `var(--font-geist-sans)` (Digunakan sebagai default)
- **Monospace**: `var(--font-geist-mono)`
- **Heading**: Menggunakan font sans-serif bawaan.

## 3. Warna (Color Palette)
Semua warna didefinisikan menggunakan format `oklch()` yang mendukung variasi terang dan gelap (*dark mode*).

### Tema Terang (Light Mode)
- **Background**: Putih (`oklch(1 0 0)`)
- **Foreground**: Abu-abu sangat gelap / nyaris hitam (`oklch(0.145 0 0)`)
- **Primary**: Biru (`oklch(0.5 0.134 242.749)`)
- **Primary Foreground**: Putih kebiruan (`oklch(0.977 0.013 236.62)`)
- **Secondary**: Abu-abu cerah (`oklch(0.967 0.001 286.375)`)
- **Muted**: Abu-abu sangat cerah, digunakan untuk elemen yang kurang menonjol.
- **Accent**: Sama dengan warna Primary, digunakan untuk aksen elemen interaktif.
- **Destructive**: Merah terang, untuk aksi berbahaya/hapus (`oklch(0.577 0.245 27.325)`).
- **Border / Input**: Abu-abu muda (`oklch(0.922 0 0)`).
- **Ring**: Warna fokus cincin biru/abu (`oklch(0.708 0 0)`).

### Tema Gelap (Dark Mode)
- **Background**: Abu-abu sangat gelap / hitam (`oklch(0.145 0 0)`)
- **Foreground**: Putih / abu-abu terang (`oklch(0.985 0 0)`)
- **Primary**: Biru terang yang disesuaikan untuk latar gelap (`oklch(0.443 0.11 240.79)`)
- **Card / Popover**: Latar belakang kartu di dark mode (`oklch(0.205 0 0)`), membedakannya dari background utama.
- **Border**: Transparan dengan sedikit opacity (`oklch(1 0 0 / 10%)`).

### Warna Sidebar
Sidebar memiliki warna khusus yang menyesuaikan dengan tema untuk memastikan kontras yang baik:
- **Light Mode Sidebar**: Abu-abu sangat terang (`oklch(0.985 0 0)`) dengan aksen biru/abu-abu.
- **Dark Mode Sidebar**: Sama dengan warna background kartu dark mode (`oklch(0.205 0 0)`).

### Warna Grafik (Charts)
Terdapat 5 warna khusus untuk komponen grafik (Recharts) dengan nuansa kebiruan dan ungu untuk menjaga konsistensi estetik:
- **Chart 1 - 5**: Variasi dari *blue* dan *indigo* (Hue di sekitar 230 - 242).

## 4. Radius (Border Radius)
Desain ini menggunakan gaya melengkung yang cukup lembut dan modern:
- **Base Radius**: `0.875rem` (14px)
- **Variasi Radius**:
  - `sm`: ~8.4px (`calc(var(--radius) * 0.6)`)
  - `md`: ~11.2px (`calc(var(--radius) * 0.8)`)
  - `lg`: 14px (`var(--radius)`)
  - `xl`: ~19.6px (`calc(var(--radius) * 1.4)`)

## 5. Komponen Utama
Sistem ini menggunakan library eksternal yang diintegrasikan secara kustom:
- **Tabel**: `@tanstack/react-table`
- **Grafik**: `recharts`
- **Carousel / Slider**: `embla-carousel-react`
- **Layout & Panel**: `react-resizable-panels`
- **Animasi & Interaksi**: `tw-animate-css` dan *Framer Motion* (jika ditambahkan kemudian).
- **Date Picker**: `react-day-picker`

## Kesimpulan Estetika
Desain *Starterkit Dashboard* ini mengusung tema **Modern, Clean, dan Professional**. Penggunaan warna dasar netral yang dipadukan dengan aksen warna biru (primary) memberikan kesan *clean* namun tetap menarik (vibrant). Border radius sebesar 14px memberikan kesan organik dan ramah (tidak terlalu kaku). Penggunaan `oklch()` memastikan kecerahan yang konsisten di berbagai kombinasi warna dan mendukung penuh perpindahan mulus antara *Light Mode* dan *Dark Mode*.
