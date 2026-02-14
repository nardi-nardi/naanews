import { unstable_cache } from "next/cache";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import type {
  Book,
  BookChapter,
  ChatLine,
  Feed,
  Story,
} from "@/app/(frontend)/data/content";
import {
  books as dummyBooks,
  feeds as dummyFeeds,
  stories as dummyStories,
} from "@/app/(frontend)/data/content";

// 👇 IMPORT INI PENTING: Pastikan file roadmaps.ts sudah dipindah ke folder data
import {
  roadmaps as dummyRoadmaps,
  type Roadmap,
} from "@/app/(frontend)/data/roadmaps";
// Jika kamu belum memindahkan file, dan masih ada di folder roadmap, gunakan baris ini:
// import { roadmaps as dummyRoadmaps, type Roadmap } from "@/app/(frontend)/roadmap/roadmaps";

import {
  products as dummyProducts,
  type Product,
} from "@/app/(frontend)/toko/products";

export const CONTENT_REVALIDATE_SECONDS = 300;

export const CACHE_TAGS = {
  feeds: "feeds",
  stories: "stories",
  books: "books",
  roadmaps: "roadmaps", // Tag baru
  products: "products", // Tag baru
} as const;

/* ── INTERNAL LOADERS (Direct DB Calls) ── */

async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const db = await getDb();
    if (!db)
      return category
        ? dummyFeeds.filter((f) => f.category === category)
        : dummyFeeds;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await db
      .collection("feeds")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0 && !category) return dummyFeeds;

    return docs.map(mapFeedDoc);
  } catch {
    return category
      ? dummyFeeds.filter((f) => f.category === category)
      : dummyFeeds;
  }
}

async function loadFeedById(id: number): Promise<Feed | null> {
  try {
    const db = await getDb();
    if (!db) return dummyFeeds.find((f) => f.id === id) ?? null;

    const doc = await db.collection("feeds").findOne({ id: id });
    return doc ? mapFeedDoc(doc) : null;
  } catch {
    return null;
  }
}

async function loadStories(): Promise<Story[]> {
  try {
    const db = await getDb();
    if (!db) return dummyStories;
    const docs = await db
      .collection("stories")
      .find()
      .sort({ id: 1 })
      .toArray();
    if (docs.length === 0) return dummyStories;

    return docs.map((d) => ({
      id: d.id as number,
      name: d.name as string,
      label: d.label as string,
      type: d.type as Story["type"],
      palette: d.palette as string,
      image: (d.image as string) || "",
      viral: d.viral as boolean,
    }));
  } catch {
    return dummyStories;
  }
}

async function loadBooks(): Promise<Book[]> {
  try {
    const db = await getDb();
    if (!db) return dummyBooks;
    const docs = await db.collection("books").find().sort({ id: 1 }).toArray();
    if (docs.length === 0) return dummyBooks;

    return docs.map((d) => ({
      id: d.id as number,
      title: d.title as string,
      author: d.author as string,
      cover: d.cover as string,
      genre: d.genre as string,
      pages: d.pages as number,
      rating: d.rating as number,
      description: d.description as string,
      chapters: (d.chapters as BookChapter[]).map((ch) => ({
        title: ch.title,
        lines: ch.lines as ChatLine[],
      })),
      storyId: (d.storyId as number | null | undefined) ?? null,
    }));
  } catch {
    return dummyBooks;
  }
}

// 👇 FUNGSI BARU: Load Roadmaps
async function loadRoadmaps(): Promise<Roadmap[]> {
  try {
    const db = await getDb();
    if (!db) return dummyRoadmaps;
    const docs = await db
      .collection("roadmaps")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0) return dummyRoadmaps;
    // Bersihkan _id mongo agar sesuai type Roadmap
    return docs.map(({ _id, ...rest }) => rest as Roadmap);
  } catch {
    return dummyRoadmaps;
  }
}

// 👇 FUNGSI BARU: Load Products
async function loadProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    if (!db) return dummyProducts;
    const docs = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0) return dummyProducts;

    return docs.map((item) => ({
      _id: item._id?.toString(),
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      images: item.images || [],
      category: item.category,
      stock: item.stock,
      featured: item.featured,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as Product[];
  } catch {
    return dummyProducts;
  }
}

// Helper Mapper
function mapFeedDoc(d: any): Feed {
  return {
    id: d.id,
    title: d.title,
    category: d.category,
    createdAt: d.createdAt || Date.now(),
    popularity: d.popularity,
    image: d.image,
    lines: d.lines,
    takeaway: d.takeaway,
    source: d.source,
    storyId: d.storyId ?? null,
  };
}

/* ── CACHED WRAPPERS (Public API) ── */

export const getFeeds = unstable_cache(
  async (category?: Feed["category"]) => loadFeeds(category),
  ["cached-feeds"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export const getFeedById = unstable_cache(
  async (id: number) => loadFeedById(id),
  ["cached-feed-by-id"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export const getStories = unstable_cache(
  async () => loadStories(),
  ["cached-stories"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.stories] }
);

export const getBooks = unstable_cache(
  async () => loadBooks(),
  ["cached-books"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.books] }
);

// 👇 EXPORT BARU: Roadmaps (PENTING)
export const getRoadmaps = unstable_cache(
  async () => loadRoadmaps(),
  ["cached-roadmaps"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.roadmaps] }
);

// 👇 EXPORT BARU: Products (PENTING)
export const getProducts = unstable_cache(
  async () => loadProducts(),
  ["cached-products"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

/* ── HELPERS ── */

export async function getFeedIds(): Promise<number[]> {
  const feeds = await getFeeds();
  return feeds.map((f) => f.id);
}

export async function getBookById(id: number): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function getBookIds(): Promise<number[]> {
  const books = await getBooks();
  return books.map((b) => b.id);
}
