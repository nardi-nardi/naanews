import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import type { Story } from "@/app/(frontend)/data/content";
import { stories as dummyStories } from "@/app/(frontend)/data/content";

export const dynamic = "force-dynamic";

// GET all stories
export async function GET() {
  try {
    const db = await getDb();
    
    if (!db) {
      console.warn("MongoDB not available, using dummy data");
      return NextResponse.json(dummyStories);
    }

    const stories = await db.collection("stories").find().sort({ id: 1 }).toArray();

    const mapped = stories.map((s) => ({
      id: s.id,
      name: s.name,
      label: s.label,
      type: s.type,
      palette: s.palette,
      image: s.image || "",
      viral: s.viral,
      _id: s._id.toString(),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json(dummyStories, { status: 200 });
  }
}

// POST create story
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const body = (await req.json()) as Omit<Story, "id">;

    const last = await db.collection("stories").find().sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length > 0 ? (last[0].id as number) + 1 : 1;

    const newStory = { ...body, image: body.image || "", id: nextId };
    await db.collection("stories").insertOne(newStory);

    return NextResponse.json({ ...newStory, id: nextId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stories error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
