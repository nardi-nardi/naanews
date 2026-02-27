import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { products as dummyProducts, type Product } from "@/types/products";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

async function loadProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    if (!db) return dummyProducts;
    const docs = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0) return dummyProducts;
    return docs.map((item) => ({
      _id: item._id?.toString(),
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      images: item.images || [],
      category: item.category,
      stock: item.stock,
      featured: item.featured,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as Product[];
  } catch {
    return dummyProducts;
  }
}

export const getProducts = unstable_cache(
  async () => loadProducts(),
  ["cached-products"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);
