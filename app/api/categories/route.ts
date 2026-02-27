import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { categorySchema } from "@/lib/validate";
import { categories } from "@/types/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json(categories);
    }

    const data = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();

    if (data.length === 0) {
      return NextResponse.json(categories);
    }

    const formattedData = data.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(categories);
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;
    const db = await getDb();

    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const now = Date.now();
    const slugBase =
      body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "category";
    const newCategory = {
      id: body.id ?? body.slug ?? slugBase,
      name: body.name,
      slug: body.slug ?? slugBase,
      description: body.description ?? "",
      icon: body.icon ?? "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("categories").insertOne(newCategory);

    return NextResponse.json({
      ...newCategory,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
