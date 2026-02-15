# Arsitektur & Struktur Proyek (Next.js 16)

Dokumen ini menjelaskan pemisahan **server vs client**, struktur folder, dan praktik keamanan.

---

## 1. Server vs Client (Next.js 16)

### Server Components (default)
- **Tidak** ada directive `"use client"`.
- Bisa async, akses DB/API server, tidak bisa pakai `useState`/`useEffect`.
- **Lokasi**: Halaman di `app/(frontend)/**/page.tsx`, komponen di `app/(frontend)/read/[id]/_components/*` (ReadArticleHeader, ReadArticleBody, SimilarFeedsSection, StorePreviewSection), `app/components/relative-time.tsx` (jika tidak pakai state).

### Client Components
- Harus ada `"use client"` di baris pertama.
- Bisa pakai state, effect, event handler, browser API.
- **Lokasi**:
  - `app/components/comment-section.tsx` — state komentar, fetch API
  - `app/components/share-button.tsx` — klik share
  - `app/components/image-upload.tsx` — upload UI
  - `app/components/mobile-nav-drawer.tsx` — drawer state
  - `app/admin/page.tsx` — seluruh admin panel (tabs, forms, fetch)
  - `app/components/feed-page.tsx` — jika pakai state

### Aturan
- Server component bisa **render** client component (import dan pakai seperti biasa).
- Client component **tidak boleh** import server-only module (mis. yang langsung akses DB). Data dari server dikirim lewat **props**.

---

## 2. Struktur Folder

```
app/  // Jangan masukkan secret (MONGODB_URI, API keys) di sini — pakai .env.local saja.
  // env di sini bisa terbundle ke client; rahasia hanya di server via process.env.
├── (frontend)/          # Rute publik
│   ├── read/[id]/       # Halaman baca artikel
│   │   ├── page.tsx     # Server: data fetch, layout
│   │   └── _components/ # Komponen server untuk read (header, body, similar, toko)
│   ├── berita/, tutorial/, riset/, buku/, roadmap/, toko/, tag/, search/, tentang/
│   └── toko/products.ts # Data/tipe produk (shared)
├── admin/               # Panel admin (client-heavy)
│   ├── _types.ts        # Tipe & konstanta form admin
│   ├── _components/     # AdminTabBar, dll.
│   └── page.tsx         # Client: dashboard dengan tabs
├── api/                 # API Routes (server)
│   ├── comments/        # GET/POST komentar (rate-limited)
│   ├── seed/            # POST seed DB (auth + rate-limited)
│   ├── upload/presigned-url/ # POST presigned URL (rate-limited)
│   └── books/, feeds/, stories/, products/, categories/, roadmaps/
├── components/   // Jangan masukkan secret (MONGODB_URI, API keys) di sini — pakai .env.local saja.
  // env di sini bisa terbundle ke client; rahasia hanya di server via process.env.         # Komponen UI shared (campuran server/client)
├── lib/                 # Kode server-side shared
│   ├── data/            # Data layer per domain
│   │   ├── constants.ts
│   │   ├── feeds.ts, books.ts, stories.ts, roadmaps.ts, products.ts
│   │   └── index.ts     # Re-export
│   ├── mongodb.ts
│   ├── validate.ts      # Zod schemas
│   ├── api-auth.ts      # Seed auth
│   └── rate-limit.ts    # Rate limiter in-memory
├── types/               # Tipe shared (content.ts)
│   └── content.ts       # Feed, Book, Story, FeedCategory, dll.
└── data/                # Seed/dummy data & re-export types
    ├── content.ts
    └── roadmaps.ts
```

---

## 3. Keamanan (Anti-Spam DB & Object Storage)

- **Komentar** (`POST /api/comments`): Rate limit **15 request / IP / menit**; input divalidasi Zod + sanitasi HTML.
- **Upload** (`POST /api/upload/presigned-url`): Rate limit **10 request / IP / menit**; hanya `contentType` image dan filename divalidasi.
- **Seed** (`POST /api/seed`): Wajib header `x-api-key` jika `SEED_API_KEY` di-set; rate limit **2 request / IP / jam**.
- **MongoDB**: Jangan simpan `MONGODB_URI` di `next.config.ts`; pakai **.env.local** saja.
- **Validasi API  // Jangan masukkan secret (MONGODB_URI, API keys) di sini — pakai .env.local saja.
  // env di sini bisa terbundle ke client; rahasia hanya di server via process.env.**: Semua body API (books, feeds, products, categories, stories, comments) memakai **Zod**; hanya field yang diizinkan yang diset ke DB.

Untuk production, pertimbangkan rate limit berbasis **Redis/Upstash** agar limit konsisten di semua instance serverless.

---

## 4. Skalabilitas & Durability

- **Data layer**: Satu domain satu file (`lib/data/feeds.ts`, `books.ts`, dll.); cache lewat `unstable_cache` dengan tag per domain.
- **Tipe**: Tipe konten terpusat di `app/types/content.ts`; seed data di `app/data/` agar file besar tidak ikut ke client.
- **Halaman read**: Dipecah jadi komponen kecil (header, body, similar feeds, store preview) agar mudah diubah dan di-test.
- **Admin**: Tipe dan konstanta form di `admin/_types.ts`; tab bar di `admin/_components/admin-tab-bar.tsx`. Konten tiap tab bisa dipindah ke komponen terpisah jika halaman admin masih terlalu besar.
