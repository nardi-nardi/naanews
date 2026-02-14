import { NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import { categories } from "@/app/(frontend)/toko/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    
    if (!db) {
      return NextResponse.json(categories);
    }

    const data = await db.collection("categories").find({}).sort({ name: 1 }).toArray();
    
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
    const body = await request.json();
    const db = await getDb();

    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const newCategory = {
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
