import { unstable_cache } from "next/cache";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import type { Book, BookChapter, ChatLine, Feed, Story } from "@/app/(frontend)/data/content";
import { books as dummyBooks, feeds as dummyFeeds, stories as dummyStories } from "@/app/(frontend)/data/content";

export const CONTENT_REVALIDATE_SECONDS = 300;

export const CACHE_TAGS = {
  feeds: "feeds",
  stories: "stories",
  books: "books",
} as const;

/* ── internal loaders (hit DB, fallback to dummy) ── */

async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const db = await getDb();
    if (!db) return dummyFeeds;
    
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await db
      .collection("feeds")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    if (docs.length === 0 && !category) {
      return dummyFeeds;
    }

    return docs.map((d) => ({
      id: d.id as number,
      title: d.title as string,
      category: d.category as Feed["category"],
      createdAt: (d.createdAt as number) || Date.now(),
      popularity: d.popularity as number,
      image: d.image as string,
      lines: d.lines as Feed["lines"],
      takeaway: d.takeaway as string,
      source: d.source as Feed["source"],
      storyId: (d.storyId as number | null | undefined) ?? null,
    }));
  } catch {
    const filtered = category
      ? dummyFeeds.filter((f) => f.category === category)
      : dummyFeeds;
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }
}

async function loadStories(): Promise<Story[]> {
  try {
    const db = await getDb();
    if (!db) return dummyStories;
    
    const docs = await db.collection("stories").find().sort({ id: 1 }).toArray();

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

/* ── cached wrappers (ISR-friendly, tagged for on-demand revalidation) ── */

const getFeedsCached = unstable_cache(
  async (category?: Feed["category"]) => loadFeeds(category),
  ["cached-feeds"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] },
);

const getStoriesCached = unstable_cache(
  async () => loadStories(),
  ["cached-stories"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.stories] },
);

const getBooksCached = unstable_cache(
  async () => loadBooks(),
  ["cached-books"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.books] },
);

/* ── public API used by pages ── */

export async function getFeeds(category?: Feed["category"]): Promise<Feed[]> {
  return getFeedsCached(category);
}

export async function getFeedById(id: number): Promise<Feed | null> {
  const feeds = await getFeeds();
  return feeds.find((f) => f.id === id) ?? null;
}

export async function getFeedIds(): Promise<number[]> {
  const feeds = await getFeeds();
  return feeds.map((f) => f.id);
}

export async function getStories(): Promise<Story[]> {
  return getStoriesCached();
}

export async function getBooks(): Promise<Book[]> {
  return getBooksCached();
}

export async function getBookById(id: number): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function getBookIds(): Promise<number[]> {
  const books = await getBooks();
  return books.map((b) => b.id);
}
