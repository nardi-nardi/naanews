import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/app/components/site-shell";
import { getDb } from "@/app/lib/mongodb";
import { getProductById } from "@/app/toko/products";
import type { Product } from "@/app/toko/products";

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
      stock: data.stock,
      featured: data.featured,
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

  const mainImage = product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";
  const stockStatus = product.stock > 0 ? "Tersedia" : "Habis";
  const stockColor = product.stock > 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <SiteShell activePath="/toko">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/toko"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100"
          >
            ← Kembali ke Toko
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="glass-panel overflow-hidden rounded-2xl">
              <div className="relative aspect-square">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="glass-panel overflow-hidden rounded-lg ring-1 ring-slate-700/60 hover:ring-cyan-500/40"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-medium text-cyan-400">{product.category}</p>
                <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
                  {product.name}
                </h1>
              </div>
              {product.featured && (
                <span className="shrink-0 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/40">
                  UNGGULAN
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6 border-b border-slate-700/60 pb-6">
              <p className="text-3xl font-bold text-cyan-300 sm:text-4xl">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${stockColor}`}>{stockStatus}</span>
                <span className="text-sm text-slate-500">•</span>
                <span className="text-sm text-slate-400">Stok: {product.stock} unit</span>
              </div>
              {product.stock > 0 && product.stock < 10 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                  Stok terbatas!
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-slate-100">Deskripsi Produk</h2>
              <p className="text-sm leading-relaxed text-slate-300">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.stock > 0 ? (
                <>
                  <button className="w-full rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-500">
                    🛒 Tambah ke Keranjang
                  </button>
                  <button className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-500/20">
                    💬 Hubungi Penjual
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-700/60 px-6 py-3 font-semibold text-slate-400"
                >
                  Stok Habis
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-2 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Kategori</span>
                <span className="font-medium text-slate-200">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ID Produk</span>
                <span className="font-mono text-xs text-slate-300">{product.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - Coming Soon */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-50">Produk Terkait</h2>
          <div className="glass-panel rounded-xl p-8 text-center">
            <p className="text-slate-400">Produk terkait akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </SiteShell>
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
    title: `${product.name} - Toko NAA News`,
    description: product.description,
  };
}
