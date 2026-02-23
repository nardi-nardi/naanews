import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/app/lib/mongodb";
import { getProductById } from "@/app/types/products";
import type { Product } from "@/app/types/products";
import { ProductImageGallery } from "@/app/components/product-image-gallery";
import { ProductActions } from "@/app/components/toko/product-actions";
import { ProductInfo } from "@/app/components/toko/product-info";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const db = await getDb();
    const data = db ? await db.collection("products").findOne({ id }) : null;
    const productData = data || getProductById(id);

    if (!productData) return null;

    return {
      ...productData,
      _id: productData._id?.toString(),
    } as Product;
  } catch {
    return getProductById(id) ?? null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };
  return {
    title: `${product.name} - Toko Narzza Media Digital`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) notFound();

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4">
          <Link
            href="/toko"
            className="inline-flex items-center gap-2 rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm transition hover:border-cyan-300/50"
          >
            Kembali ke Toko
          </Link>
        </div>

        <div className="space-y-4">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            featured={product.featured}
          />

          <ProductInfo product={product} />

          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
