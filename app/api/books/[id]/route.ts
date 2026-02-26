import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { bookSchema } from "@/lib/validate";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/books/:id
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const doc = await db.collection("books").findOne({ id: bookId });

    if (!doc) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _removedId, ...book } = doc;
    return NextResponse.json(book);
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

// PUT /api/books/:id
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const raw = await request.json();
    const parsed = bookSchema.partial().safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.author !== undefined) update.author = body.author;
    if (body.cover !== undefined) update.cover = body.cover;
    if (body.genre !== undefined) update.genre = body.genre;
    if (body.pages !== undefined) update.pages = body.pages;
    if (body.rating !== undefined) update.rating = body.rating;
    if (body.description !== undefined) update.description = body.description;
    if (body.chapters !== undefined) update.chapters = body.chapters;
    if (body.storyId !== undefined) update.storyId = body.storyId;

    const result = await db
      .collection("books")
      .findOneAndUpdate(
        { id: bookId },
        { $set: update },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _removedId, ...book } = result;
    return NextResponse.json(book);
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/:id
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const result = await db.collection("books").deleteOne({ id: bookId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
