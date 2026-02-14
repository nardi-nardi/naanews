import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { roadmaps as seedRoadmaps } from "@/app/roadmap/roadmaps";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET /api/roadmaps — list roadmaps
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("MongoDB not available, using seed roadmaps");
      return NextResponse.json(seedRoadmaps);
    }

    const docs = await db.collection("roadmaps").find().sort({ createdAt: -1 }).toArray();
    const roadmaps = docs.map(({ _id, ...rest }) => rest);
    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error("GET /api/roadmaps error:", error);
    return NextResponse.json(seedRoadmaps, { status: 200 });
  }
}

// POST /api/roadmaps — create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 503 });

    const slug = body.slug?.trim() || slugify(body.title ?? "");
    if (!slug) return NextResponse.json({ error: "Slug or title required" }, { status: 400 });

    const exists = await db.collection("roadmaps").findOne({ slug });
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const now = Date.now();
    const doc = {
      slug,
      title: body.title ?? "",
      summary: body.summary ?? "",
      duration: body.duration ?? "",
      level: body.level ?? "Pemula",
      tags: Array.isArray(body.tags) ? body.tags : typeof body.tags === "string" ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      image: body.image ?? "",
      steps: Array.isArray(body.steps) ? body.steps : [],
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("roadmaps").insertOne(doc);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("POST /api/roadmaps error:", error);
    return NextResponse.json({ error: "Failed to create roadmap" }, { status: 500 });
  }
}
