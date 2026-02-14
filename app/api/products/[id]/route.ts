import { NextResponse } from "next/server";
import { getDb } from "@/app/(frontend)/lib/mongodb";
import { getProductById } from "@/app/(frontend)/toko/products";

// GET /api/products/[id] — get single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    if (!db) {
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const product = await db.collection("products").findOne({ id });
    
    if (!product) {
      const fallback = getProductById(id);
      if (!fallback) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(fallback);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — update product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }

    const body = await req.json();
    const { name, description, price, images, category, categoryId, stock, featured, productType, platforms } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (featured !== undefined) updateData.featured = featured;
    if (productType !== undefined) updateData.productType = productType;
    if (platforms !== undefined) updateData.platforms = platforms;

    const result = await db.collection("products").updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
    }

    const result = await db.collection("products").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
