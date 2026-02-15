import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { productUpdateSchema } from "@/app/lib/validate";
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
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    const product = await db.collection("products").findOne({ id });

    if (!product) {
      const fallback = getProductById(id);
      if (!fallback) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(fallback);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const raw = await req.json();
    const parsed = productUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.productType !== undefined) updateData.productType = body.productType;
    if (body.platforms !== undefined) updateData.platforms = body.platforms;

    const result = await db
      .collection("products")
      .updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const result = await db.collection("products").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
