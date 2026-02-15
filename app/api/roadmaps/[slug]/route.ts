import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { roadmaps as seedRoadmaps } from "@/app/data/roadmaps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

// GET /api/roadmaps/:slug
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const db = await getDb();
    if (!db) {
      const fallback = seedRoadmaps.find((r) => r.slug === slug);
      if (!fallback)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(fallback);
    }

    const doc = await db.collection("roadmaps").findOne({ slug });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...roadmap } = doc;
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("GET /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

// PUT /api/roadmaps/:slug
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const db = await getDb();
    if (!db)
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );

    const update = {
      title: body.title,
      summary: body.summary,
      duration: body.duration,
      level: body.level,
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
          ? body.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      image: body.image ?? "",
      steps: Array.isArray(body.steps) ? body.steps : [],
      updatedAt: Date.now(),
    };

    const result = await db
      .collection("roadmaps")
      .findOneAndUpdate(
        { slug },
        { $set: update },
        { returnDocument: "after" }
      );

    if (!result)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...roadmap } = result;
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("PUT /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// DELETE /api/roadmaps/:slug
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const db = await getDb();
    if (!db)
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );

    const result = await db.collection("roadmaps").deleteOne({ slug });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
