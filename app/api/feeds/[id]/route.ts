import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { feedUpdateSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  invalidIdResponse,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single feed by id
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const db = await getDb();
    if (!db) return dbUnavailableResponse();
    const feed = await db.collection("feeds").findOne({ id: feedId });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: feed.id,
      title: feed.title,
      category: feed.category,
      createdAt: feed.createdAt ?? Date.now(),
      popularity: feed.popularity,
      image: feed.image,
      lines: feed.lines,
      takeaway: feed.takeaway,
      source: feed.source ?? undefined,
      storyId: feed.storyId ?? null,
    });
  } catch (error) {
    console.error("GET /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

// PUT update a feed
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const db = await getDb();
    if (!db) return dbUnavailableResponse();
    const raw = await req.json();
    const parsed = feedUpdateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const updateData = parsed.data;

    const result = await db
      .collection("feeds")
      .findOneAndUpdate(
        { id: feedId },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: result.id,
      title: result.title,
      category: result.category,
      createdAt: result.createdAt ?? Date.now(),
      popularity: result.popularity,
      image: result.image,
      lines: result.lines,
      takeaway: result.takeaway,
      source: result.source ?? undefined,
      storyId: result.storyId ?? null,
    });
  } catch (error) {
    console.error("PUT /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

// DELETE a feed
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const db = await getDb();
    if (!db) return dbUnavailableResponse();
    const result = await db.collection("feeds").deleteOne({ id: feedId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
