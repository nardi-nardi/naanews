import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getDb } from "@/app/lib/mongodb";
import type { Feed } from "@/app/data/content";
import { feeds as dummyFeeds } from "@/app/data/content";

export const dynamic = "force-dynamic";

// GET all feeds, optionally filter by category
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    
    if (!db) {
      console.warn("MongoDB not available, using dummy data");
      const category = req.nextUrl.searchParams.get("category");
      const filtered = category 
        ? dummyFeeds.filter((f) => f.category === category)
        : dummyFeeds;
      return NextResponse.json(filtered);
    }

    const category = req.nextUrl.searchParams.get("category");
    const query = req.nextUrl.searchParams.get("q");

    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { takeaway: { $regex: query, $options: "i" } },
        { "lines.text": { $regex: query, $options: "i" } },
      ];
    }

    const feeds = await db
      .collection("feeds")
      .find(filter)
      .sort({ popularity: -1 })
      .toArray();

    const mapped = feeds.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      time: f.time,
      popularity: f.popularity,
      image: f.image,
      lines: f.lines,
      takeaway: f.takeaway,
      _id: f._id.toString(),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/feeds error:", error);
    return NextResponse.json(dummyFeeds, { status: 200 });
  }
}

// POST create a new feed
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = (await req.json()) as Omit<Feed, "id">;

    // Auto-increment id
    const last = await db.collection("feeds").find().sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length > 0 ? (last[0].id as number) + 1 : 1;

    const newFeed = { ...body, id: nextId };
    await db.collection("feeds").insertOne(newFeed);

    revalidateTag("feeds");

    return NextResponse.json({ ...newFeed, id: nextId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feeds error:", error);
    return NextResponse.json({ error: "Failed to create feed" }, { status: 500 });
  }
}
