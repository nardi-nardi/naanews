import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { bookSchema, sanitizeSearchQuery } from "@/app/lib/validate";
import { books as dummyBooks } from "@/app/data/content";

export const dynamic = "force-dynamic";

// GET /api/books — list all books, optional ?q= search
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    if (!db) {
      console.warn("MongoDB not available, using dummy data");
      return NextResponse.json(dummyBooks);
    }

    const { searchParams } = new URL(request.url);
    const q = sanitizeSearchQuery(searchParams.get("q"));

    const filter: Record<string, unknown> = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await db
      .collection("books")
      .find(filter)
      .sort({ id: 1 })
      .toArray();
    // Strip MongoDB _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const books = docs.map(({ _id: _removedId, ...rest }) => rest);
    return NextResponse.json(books);
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(dummyBooks, { status: 200 });
  }
}

// POST /api/books — create a new book
export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const raw = await request.json();
    const parsed = bookSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const last = await db
      .collection("books")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newId = last.length > 0 ? (last[0].id as number) + 1 : 1;

    const newBook = {
      id: newId,
      title: body.title,
      author: body.author,
      cover: body.cover,
      genre: body.genre,
      pages: body.pages,
      rating: body.rating,
      description: body.description,
      chapters: body.chapters,
      storyId: body.storyId,
    };

    await db.collection("books").insertOne(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
