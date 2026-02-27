import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/products";

export function ProductCard({
  product,
  featured,
}: {
  product: Product;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/toko/${product.id}`}
      className={`glass-panel group flex flex-col overflow-hidden rounded-xl transition hover:border-cyan-500/50 ${
        featured ? "ring-1 ring-cyan-500/40" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white rounded shadow-lg">
            PROMO
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-100 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-orange-500">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          <span>{product.category}</span>
          <span
            className={product.stock > 0 ? "text-emerald-400" : "text-rose-400"}
          >
            {product.stock > 0 ? "Ready" : "Habis"}
          </span>
        </div>
      </div>
    </Link>
  );
}
