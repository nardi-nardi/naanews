import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { roadmaps as dummyRoadmaps, type Roadmap } from "@/types/roadmaps";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

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
    return docs.map(({ _id, ...rest }) => rest as Roadmap);
  } catch {
    return dummyRoadmaps;
  }
}

export const getRoadmaps = unstable_cache(
  async () => loadRoadmaps(),
  ["cached-roadmaps"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.roadmaps] }
);
