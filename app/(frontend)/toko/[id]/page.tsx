import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/app/lib/mongodb";
import { getProductById } from "@/app/(frontend)/toko/products";
import type { Product } from "@/app/(frontend)/toko/products";
import { ProductImageGallery } from "@/app/components/product-image-gallery";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const db = await getDb();
    if (!db) return getProductById(id) ?? null;

    const data = await db.collection("products").findOne({ id });

    if (!data) return getProductById(id) ?? null;

    return {
      _id: data._id?.toString(),
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images || [],
      category: data.category,
      categoryId: data.categoryId,
      stock: data.stock,
      featured: data.featured,
      productType: data.productType,
      platforms: data.platforms || {},
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Product;
  } catch {
    return getProductById(id) ?? null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }
  const stockStatus = product.stock > 0 ? "Tersedia" : "Habis";
  const stockColor = product.stock > 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/toko"
            className="inline-flex items-center gap-2 rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50"
          >
            ← Kembali ke Toko
          </Link>
        </div>

        {/* Vertical Layout - Shopee Style */}
        <div className="space-y-4">
          {/* Image Gallery Section - Interactive */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            featured={product.featured}
          />

          {/* Product Info Section */}
          <div className="glass-panel rounded-xl p-4">
            {/* Title & Price */}
            <h1 className="mb-3 text-xl font-bold leading-tight text-slate-50">
              {product.name}
            </h1>

            <div className="mb-4 rounded-lg bg-slate-900/40 p-3">
              <p className="text-2xl font-bold text-orange-500">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Stock & Category */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-700/40 pb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Stok:</span>
                <span
                  className={
                    product.stock > 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} unit tersedia`
                    : "Habis"}
                </span>
              </div>
              <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-medium text-slate-300">
                {product.category}
              </span>
            </div>

            {/* Description - More prominent */}
            <div className="mb-6">
              <h2 className="mb-3 text-base font-semibold text-slate-100">
                Deskripsi Produk
              </h2>
              <div className="rounded-lg bg-slate-900/40 p-4">
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Product Type Badge */}
            <div className="mb-4 flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.productType === "digital"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {product.productType === "digital"
                  ? "💾 Produk Digital"
                  : "📦 Produk Fisik"}
              </span>
            </div>

            {/* Product Details */}
            <div className="mb-4 rounded-lg bg-slate-900/40 p-3">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">
                Keterangan Produk
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kategori</span>
                  <span className="font-medium text-slate-200">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kondisi</span>
                  <span className="font-medium text-slate-200">Baru</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stok</span>
                  <span className="font-medium text-slate-200">
                    {product.stock} unit
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SKU</span>
                  <span className="font-mono text-xs text-slate-300">
                    {product.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Buy on External Platforms */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-200">
              {product.productType === "digital"
                ? "Download Produk di:"
                : "Beli Produk Ini di:"}
            </h3>
            <div className="space-y-2">
              {/* Physical Product Platforms */}
              {product.productType === "physical" && (
                <>
                  {product.platforms?.shopee && (
                    <a
                      href={product.platforms.shopee}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white transition hover:from-orange-600 hover:to-orange-700"
                    >
                      🛍️ Beli di Shopee
                    </a>
                  )}
                  {product.platforms?.tiktokshop && (
                    <a
                      href={product.platforms.tiktokshop}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 font-semibold text-white transition hover:from-slate-800 hover:to-slate-700"
                    >
                      🎵 Beli di TikTok Shop
                    </a>
                  )}
                  {product.platforms?.tokopedia && (
                    <a
                      href={product.platforms.tokopedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 font-semibold text-white transition hover:from-emerald-700 hover:to-emerald-800"
                    >
                      🟢 Beli di Tokopedia
                    </a>
                  )}
                </>
              )}

              {/* Digital Product Platforms */}
              {product.productType === "digital" && product.platforms?.lynk && (
                <a
                  href={product.platforms.lynk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-semibold text-white transition hover:from-cyan-700 hover:to-blue-700"
                >
                  💎 Download di Lynk
                </a>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              {product.productType === "digital"
                ? "Produk digital akan langsung tersedia setelah pembayaran."
                : "Website ini tidak menyediakan sistem pembayaran. Klik link di atas untuk membeli produk di platform terpercaya."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: `${product.name} - Toko Narzza Media Digital`,
    description: product.description,
  };
}
