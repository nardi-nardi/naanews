import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { feedCreateSchema } from "@/lib/validate";
import { feeds as dummyFeeds } from "@/data/content";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

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
      .sort({ createdAt: -1 })
      .toArray();

    const mapped = feeds.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      createdAt: f.createdAt ?? Date.now(),
      popularity: f.popularity,
      image: f.image,
      lines: f.lines,
      takeaway: f.takeaway,
      source: f.source ?? undefined,
      storyId: f.storyId ?? null,
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
    if (!db) return dbUnavailableResponse();
    const raw = await req.json();
    const parsed = feedCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    const last = await db
      .collection("feeds")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const nextId = last.length > 0 ? (last[0].id as number) + 1 : 1;

    const newFeed = {
      title: body.title,
      category: body.category,
      image: body.image,
      lines: body.lines,
      takeaway: body.takeaway,
      source: body.source,
      storyId: body.storyId,
      id: nextId,
      createdAt: Date.now(),
      popularity: 0,
    };
    await db.collection("feeds").insertOne(newFeed);

    return NextResponse.json({ ...newFeed, id: nextId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to create feed" },
      { status: 500 }
    );
  }
}
