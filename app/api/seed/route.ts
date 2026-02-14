import { NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import { books, feeds, stories } from "@/app/(frontend)/data/content";
import { roadmaps } from "@/app/(frontend)/data/roadmaps";
import { products } from "@/app/(frontend)/toko/products";

// POST /api/seed — seed the database with dummy data
export async function POST() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    // Clear existing data
    await db.collection("feeds").deleteMany({});
    await db.collection("stories").deleteMany({});
    await db.collection("books").deleteMany({});
    await db.collection("roadmaps").deleteMany({});
    await db.collection("products").deleteMany({});

    // Insert feeds with updated timestamps
    if (feeds.length > 0) {
      const now = Date.now();
      const feedsWithTimestamps = feeds.map((f, index) => ({
        ...f,
        // Generate varied timestamps: newest feeds get recent dates
        // Spread them across the last 7 days
        createdAt: now - index * 6 * 60 * 60 * 1000, // 6 hours apart
        storyId: f.storyId ?? null,
      }));
      await db.collection("feeds").insertMany(feedsWithTimestamps);
    }

    // Insert stories
    if (stories.length > 0) {
      await db.collection("stories").insertMany(stories.map((s) => ({ ...s })));
    }

    // Insert books
    if (books.length > 0) {
      await db.collection("books").insertMany(
        books.map((b) => ({
          ...b,
          storyId: b.storyId ?? null,
          chapters: b.chapters.map((ch) => ({ ...ch, lines: [...ch.lines] })),
        }))
      );
    }

    // Insert roadmaps with timestamps
    if (roadmaps.length > 0) {
      const now = Date.now();
      const roadmapsWithTimestamps = roadmaps.map((r, index) => {
        const { _id, ...roadmapWithoutId } = r;
        return {
          ...roadmapWithoutId,
          createdAt: now - index * 24 * 60 * 60 * 1000, // 1 day apart
          updatedAt: now - index * 24 * 60 * 60 * 1000,
        };
      });
      await db.collection("roadmaps").insertMany(roadmapsWithTimestamps);
    }

    // Insert products with timestamps
    if (products.length > 0) {
      const now = Date.now();
      const productsWithTimestamps = products.map((p, index) => {
        const { _id, ...productWithoutId } = p;
        return {
          ...productWithoutId,
          createdAt: now - index * 12 * 60 * 60 * 1000, // 12 hours apart
          updatedAt: now - index * 12 * 60 * 60 * 1000,
        };
      });
      await db.collection("products").insertMany(productsWithTimestamps);
    }

    return NextResponse.json({
      success: true,
      feedsInserted: feeds.length,
      storiesInserted: stories.length,
      booksInserted: books.length,
      roadmapsInserted: roadmaps.length,
      productsInserted: products.length,
    });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
