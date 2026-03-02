import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/toko/product-card";

export const revalidate = 300;

export default async function TokoPage() {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero Section */}
      <header className="glass-panel mb-8 rounded-2xl bg-linear-to-br from-cyan-500/10 to-transparent p-8 md:p-12">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
          Narzza Store
        </span>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">
          🛒 Merchandise Digital
        </h1>
        <p className="mt-4 max-w-xl text-slate-400 text-sm md:text-base">
          Produk premium untuk para developer dan tech enthusiast.
        </p>
      </header>

      {/* Featured Section */}
      {featuredProducts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-100">
            <span className="h-2 w-2 rounded-full bg-orange-500" /> Produk
            Unggulan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <div className="mb-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
        <button className="rounded-full bg-cyan-600 px-5 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-500">
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className="rounded-full bg-slate-800 px-5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="glass-panel py-20 text-center rounded-2xl">
          <p className="text-slate-500">Katalog sedang kosong...</p>
        </div>
      )}
    </div>
  );
}
