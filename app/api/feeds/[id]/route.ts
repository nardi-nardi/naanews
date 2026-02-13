import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import type { Feed } from "@/app/data/content";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single feed by id
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const feed = await db.collection("feeds").findOne({ id: feedId });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: feed.id,
      title: feed.title,
      category: feed.category,
      createdAt: feed.createdAt || Date.now(),
      popularity: feed.popularity,
      image: feed.image,
      lines: feed.lines,
      takeaway: feed.takeaway,
      source: feed.source,
      storyId: feed.storyId ?? null,
      _id: feed._id.toString(),
    });
  } catch (error) {
    console.error("GET /api/feeds/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}

// PUT update a feed
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const body = (await req.json()) as Partial<Feed>;

    // Don't allow changing the id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _removedId, ...updateData } = body;

    const result = await db.collection("feeds").findOneAndUpdate(
      { id: feedId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: result.id,
      title: result.title,
      category: result.category,
      time: result.time,
      popularity: result.popularity,
      image: result.image,
      lines: result.lines,
      takeaway: result.takeaway,
      storyId: result.storyId ?? null,
      _id: result._id.toString(),
    });
  } catch (error) {
    console.error("PUT /api/feeds/[id] error:", error);
    return NextResponse.json({ error: "Failed to update feed" }, { status: 500 });
  }
}

// DELETE a feed
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const result = await db.collection("feeds").deleteOne({ id: feedId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feeds/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
  }
}
