import { z } from "zod";

/** Max length for search query to avoid ReDoS and abuse */
const MAX_SEARCH_LENGTH = 200;

/** Escape special regex characters in user search input to prevent ReDoS */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Sanitize and limit search query; returns null if invalid */
export function sanitizeSearchQuery(raw: string | null): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_SEARCH_LENGTH)
    return null;
  return escapeRegex(trimmed);
}

/** Book create/update body */
export const bookSchema = z.object({
  title: z.string().max(500).default(""),
  author: z.string().max(200).default(""),
  cover: z.string().max(2000).default(""),
  genre: z.string().max(100).default(""),
  pages: z.coerce.number().int().min(0).max(100_000).default(0),
  rating: z.coerce.number().min(0).max(5).default(0),
  description: z.string().max(5000).default(""),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        lines: z.array(
          z.object({
            role: z.enum(["q", "a"]),
            text: z.string(),
            image: z.string().optional(),
          })
        ),
      })
    )
    .default([]),
  storyId: z.number().int().positive().nullable().optional().default(null),
});

/** Feed create body (no id, createdAt, popularity) */
export const feedCreateSchema = z.object({
  title: z.string().min(1).max(500),
  category: z.enum(["Berita", "Tutorial", "Riset"]),
  image: z.string().max(2000).default(""),
  lines: z.array(
    z.object({
      role: z.enum(["q", "a"]),
      text: z.string(),
      image: z.string().optional(),
    })
  ).default([]),
  takeaway: z.string().max(2000).default(""),
  source: z
    .object({ title: z.string(), url: z.string().url() })
    .optional(),
  storyId: z.number().int().positive().nullable().optional().default(null),
});

/** Feed update body (partial, no id) */
export const feedUpdateSchema = feedCreateSchema.partial();

/** Category create/update allowlist */
export const categorySchema = z.object({
  id: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200),
  slug: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
});

/** Presigned URL request */
export const presignedUrlSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().refine((v) => v.startsWith("image/"), {
    message: "Only image files are allowed",
  }),
});

/** Product create body */
export const productCreateSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i, "id must be alphanumeric with hyphens"),
  name: z.string().min(1).max(300),
  description: z.string().max(5000).default(""),
  price: z.coerce.number().min(0).max(1e12),
  images: z.array(z.string().max(2000)).max(20).default([]),
  category: z.string().min(1).max(100),
  categoryId: z.string().max(100).optional(),
  stock: z.coerce.number().int().min(0).max(1e6).default(0),
  featured: z.boolean().default(false),
  productType: z.enum(["physical", "digital"]),
  platforms: z.record(z.string(), z.string()).optional().default({}),
});

/** Product update body (partial) */
export const productUpdateSchema = productCreateSchema.partial().omit({ id: true });

/** Story create body (no id) */
export const storyCreateSchema = z.object({
  name: z.string().min(1).max(200),
  label: z.string().max(50).default(""),
  type: z.enum(["Berita", "Tutorial", "Riset"]),
  palette: z.string().max(100).default(""),
  image: z.string().max(2000).default(""),
  viral: z.boolean().default(false),
});

/** Strip HTML/script tags to reduce XSS risk in stored content */
function stripHtml(raw: string): string {
  return raw.replace(/<[^>]*>/g, "").trim();
}

/** Comment create body — validasi ketat untuk keamanan */
export const commentCreateSchema = z.object({
  feedId: z.number().int().positive("feedId harus angka positif"),
  author: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(50, "Nama maksimal 50 karakter")
    .transform((s) => s.trim().slice(0, 50)),
  text: z
    .string()
    .min(1, "Komentar wajib diisi")
    .max(500, "Komentar maksimal 500 karakter")
    .transform((s) => stripHtml(s.trim()).slice(0, 500)),
});

export type BookInput = z.infer<typeof bookSchema>;
export type FeedCreateInput = z.infer<typeof feedCreateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
