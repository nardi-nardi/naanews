import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/app/components/site-shell";
import { getDb } from "@/app/lib/mongodb";
import { products as seedProducts } from "@/app/toko/products";
import type { Product } from "@/app/toko/products";

export const dynamic = "force-dynamic";

async function fetchProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    if (!db) return seedProducts;

    const data = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    
    if (data.length === 0) return seedProducts;
    
    return data.map((item) => ({
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
    return seedProducts;
  }
}

export default async function TokoPage() {
  const products = await fetchProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <SiteShell activePath="/toko">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="glass-panel mb-8 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8 sm:p-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">
            TOKO NARZZA MEDIA DIGITAL
          </p>
          <h1 className="mb-3 text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
            🛒 Belanja Merchandise
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Belanja merchandise dan produk pilihan untuk developer dan tech enthusiast. Kualitas premium dengan harga terjangkau.
          </p>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">⭐ Produk Unggulan</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </div>
          </div>
        )}

        {/* Categories Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-cyan-500/20 px-4 py-1.5 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-500/40">
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-slate-400">Belum ada produk tersedia.</p>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const mainImage = product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

  return (
    <Link
      href={`/toko/${product.id}`}
      className={`glass-panel group flex flex-col overflow-hidden rounded-lg transition hover:shadow-lg hover:shadow-cyan-500/10 ${
        featured ? "ring-2 ring-cyan-500/40" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-900/60">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {featured && (
          <div className="absolute left-2 top-2 rounded bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
            ⭐ UNGGULAN
          </div>
        )}
      </div>

      {/* Product Info - Minimal like Shopee */}
      <div className="flex flex-col gap-1.5 p-2.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight text-slate-50">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-orange-500">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{product.category}</span>
          <span className="flex items-center gap-1">
            {product.stock > 0 ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Tersedia
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                Habis
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
