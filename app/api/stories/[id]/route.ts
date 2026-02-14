import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import type { Story } from "@/app/(frontend)/data/content";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single story
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const story = await db.collection("stories").findOne({ id: storyId });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: story.id,
      name: story.name,
      label: story.label,
      type: story.type,
      palette: story.palette,
      image: story.image || "",
      viral: story.viral,
      _id: story._id.toString(),
    });
  } catch (error) {
    console.error("GET /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

// PUT update story
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const body = (await req.json()) as Partial<Story>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _removedId, ...updateData } = body;

    const result = await db.collection("stories").findOneAndUpdate(
      { id: storyId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: result.id,
      name: result.name,
      label: result.label,
      type: result.type,
      palette: result.palette,
      image: result.image || "",
      viral: result.viral,
      _id: result._id.toString(),
    });
  } catch (error) {
    console.error("PUT /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

// DELETE story
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const result = await db.collection("stories").deleteOne({ id: storyId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
