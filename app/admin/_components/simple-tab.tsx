"use client";
import Link from "next/link";
import { Category, Product } from "../_types";
import { Roadmap } from "@/app/types/roadmaps";

export function RoadmapTab({ roadmaps }: { roadmaps: Roadmap[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Roadmap</h2>
        <Link
          href="/admin/roadmaps"
          className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          + Tambah Roadmap
        </Link>
      </div>
      <div className="space-y-3">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.slug}
            className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex gap-2">
                <span className="text-cyan-300 text-[10px] bg-cyan-500/20 px-2 rounded-full">
                  {roadmap.level}
                </span>
              </div>
              <p className="truncate text-sm font-medium">{roadmap.title}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/roadmaps?edit=${roadmap.slug}`}
                className="bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
              >
                Edit
              </Link>
              <Link
                href={`/roadmap/${roadmap.slug}`}
                target="_blank"
                className="bg-cyan-700/40 px-3 py-1.5 rounded-lg text-xs text-cyan-200"
              >
                Lihat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductTab({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Produk</h2>
        <Link
          href="/admin/products"
          className="rounded-lg bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          🛒 Kelola Produk
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover bg-slate-900/60"
                />
              )}
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-cyan-400">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/products"
                className="bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
              >
                ✏️ Edit
              </Link>
              <Link
                href={`/toko/${product.id}`}
                target="_blank"
                className="bg-cyan-700/40 px-3 py-1.5 rounded-lg text-xs text-cyan-200"
              >
                👁️ Lihat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryTab({ categories }: { categories: Category[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Kategori</h2>
        <Link
          href="/admin/categories"
          className="rounded-lg bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          🏷️ Kelola Kategori
        </Link>
      </div>
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900/60 text-2xl">
                {category.icon || "🏷️"}
              </div>
              <div>
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-slate-500">/{category.slug}</p>
              </div>
            </div>
            <Link
              href="/admin/categories"
              className="bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
            >
              ✏️ Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
