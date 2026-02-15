import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/(frontend)/toko/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";

type StorePreviewSectionProps = {
  products: Product[];
};

export function StorePreviewSection({ products }: StorePreviewSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">
        Barang di Toko
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={"/toko/" + product.id}
            className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition hover:border-cyan-300/50"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-900/60">
              <Image
                src={product.images?.[0] || FALLBACK_IMAGE}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-col gap-1 p-3">
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-50">
                {product.name}
              </h3>
              <span className="text-base font-bold text-amber-400">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-slate-500">{product.category}</span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/toko"
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Lihat semua barang di toko
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  );
}
