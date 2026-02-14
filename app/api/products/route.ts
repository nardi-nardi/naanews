import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { products } from "@/app/toko/products";

// GET /api/products — list all products
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      // Fallback to seed data
      return NextResponse.json(products);
    }

    const data = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    
    if (data.length === 0) {
      // Return seed data if no products in DB
      return NextResponse.json(products);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(products);
  }
}

// POST /api/products — create new product
export async function POST(req: Request) {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }

    const body = await req.json();
    const { id, name, description, price, images, category, stock, featured } = body;

    if (!id || !name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if product ID already exists
    const existing = await db.collection("products").findOne({ id });
    if (existing) {
      return NextResponse.json({ error: "Product ID already exists" }, { status: 409 });
    }

    const now = Date.now();
    const product = {
      id,
      name,
      description,
      price: Number(price),
      images: images || [],
      category,
      stock: Number(stock),
      featured: featured || false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("products").insertOne(product);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
