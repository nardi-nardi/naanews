import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { books, feeds, stories } from "@/app/data/content";

// POST /api/seed — seed the database with dummy data
export async function POST() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }

    // Clear existing data
    await db.collection("feeds").deleteMany({});
    await db.collection("stories").deleteMany({});
    await db.collection("books").deleteMany({});

    // Insert feeds with updated timestamps
    if (feeds.length > 0) {
      const now = Date.now();
      const feedsWithTimestamps = feeds.map((f, index) => ({
        ...f,
        // Generate varied timestamps: newest feeds get recent dates
        // Spread them across the last 7 days
        createdAt: now - (index * 6 * 60 * 60 * 1000), // 6 hours apart
        storyId: f.storyId ?? null,
      }));
      await db.collection("feeds").insertMany(feedsWithTimestamps);
    }

    // Insert stories
    if (stories.length > 0) {
      await db.collection("stories").insertMany(
        stories.map((s) => ({ ...s })),
      );
    }

    // Insert books
    if (books.length > 0) {
      await db.collection("books").insertMany(
        books.map((b) => ({
          ...b,
          storyId: b.storyId ?? null,
          chapters: b.chapters.map((ch) => ({ ...ch, lines: [...ch.lines] })),
        })),
      );
    }

    return NextResponse.json({
      success: true,
      feedsInserted: feeds.length,
      storiesInserted: stories.length,
      booksInserted: books.length,
    });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
