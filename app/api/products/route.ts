import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { productCreateSchema } from "@/lib/validate";
import { products } from "@/types/products";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

// GET /api/products — list all products
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      // Fallback to seed data
      return NextResponse.json(products);
    }

    const data = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    if (data.length === 0) {
      return NextResponse.json(products);
    }

    const mapped = data.map((item) => {
      const { _id, ...rest } = item;
      return { ...rest, _id: _id?.toString() };
    });
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(products);
  }
}

// POST /api/products — create new product
export async function POST(req: Request) {
  try {
    const db = await getDb();
    if (!db) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = productCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    const existing = await db.collection("products").findOne({ id: body.id });
    if (existing) {
      return NextResponse.json(
        { error: "Product ID already exists" },
        { status: 409 }
      );
    }

    const now = Date.now();
    const product = {
      id: body.id,
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images.filter(Boolean),
      category: body.category,
      categoryId: body.categoryId ?? body.category,
      stock: body.stock,
      featured: body.featured,
      productType: body.productType,
      platforms: body.platforms ?? {},
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("products").insertOne(product);
    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
