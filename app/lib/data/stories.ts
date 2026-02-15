import { unstable_cache } from "next/cache";
import { getDb } from "@/app/lib/mongodb";
import type { Story } from "@/app/types/content";
import { stories as dummyStories } from "@/app/data/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

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

export const getStories = unstable_cache(
  async () => loadStories(),
  ["cached-stories"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.stories] }
);
