import { unstable_cache } from "next/cache";
import { getDb } from "@/app/lib/mongodb";
import type { Feed } from "@/app/types/content";
import { feeds as dummyFeeds } from "@/app/data/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

function mapFeedDoc(d: Record<string, unknown>): Feed {
  return {
    id: d.id as number,
    title: d.title as string,
    category: d.category as Feed["category"],
    createdAt: (d.createdAt as number) ?? Date.now(),
    popularity: (d.popularity as number) ?? 0,
    image: (d.image as string) ?? "",
    lines: (d.lines as Feed["lines"]) ?? [],
    takeaway: (d.takeaway as string) ?? "",
    source: d.source as Feed["source"],
    storyId: (d.storyId as number | null | undefined) ?? null,
  };
}

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
    const doc = await db.collection("feeds").findOne({ id });
    return doc ? mapFeedDoc(doc) : null;
  } catch {
    return null;
  }
}

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

export async function getFeedIds(): Promise<number[]> {
  const feeds = await getFeeds();
  return feeds.map((f) => f.id);
}
