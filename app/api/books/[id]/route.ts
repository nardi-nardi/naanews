import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";

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
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
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
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
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
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const body = await request.json();

    const result = await db.collection("books").findOneAndUpdate(
      { id: bookId },
      {
        $set: {
          title: body.title,
          author: body.author,
          cover: body.cover,
          genre: body.genre,
          pages: body.pages,
          rating: body.rating,
          description: body.description,
          chapters: body.chapters,
          storyId: body.storyId ?? null,
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _removedId, ...book } = result;
    return NextResponse.json(book);
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
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
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }
    const result = await db.collection("books").deleteOne({ id: bookId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
