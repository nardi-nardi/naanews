import Link from "next/link";
import { FeedTitleCard } from "@/components/feedpages/FeedTitleCard";
import { TutorialCard } from "@/components/tutorial-card";
import { BookCard } from "@/components/books/book-card";
import type { Book, Feed } from "@/data/content";
import { Roadmap } from "@/types/roadmaps";
import { Product } from "@/types/products";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

export function HomeAllSections({
  feeds,
  roadmaps,
  products,
  books,
}: {
  feeds: Feed[];
  roadmaps: Roadmap[];
  products: Product[];
  books: Book[];
}) {
  const berita = feeds.filter((f) => f.category === "Berita").slice(0, 4);
  const tutorial = feeds.filter((f) => f.category === "Tutorial").slice(0, 4);
  const riset = feeds.filter((f) => f.category === "Riset").slice(0, 4);

  return (
    <>
      {/* BERITA */}
      {berita.length > 0 && (
        <section className="mt-4">
          <SectionHeader
            icon="📰"
            title="Berita Terbaru"
            desc="Update berita teknologi"
            colorClass="sky"
          />
          <div className="grid gap-4">
            {berita.map((feed, index) => (
              <FeedTitleCard key={feed.id} feed={feed} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* TUTORIAL */}
      {tutorial.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icon="🎓"
            title="Tutorial Terbaru"
            desc="Panduan step-by-step"
            colorClass="emerald"
          />
          <div className="grid gap-4">
            {tutorial.map((feed, index) => (
              <TutorialCard key={feed.id} feed={feed} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* RISET */}
      {riset.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icon="🔬"
            title="Riset Terbaru"
            desc="Analisa mendalam"
            colorClass="fuchsia"
          />
          <div className="grid gap-4">
            {riset.map((feed, index) => (
              <FeedTitleCard key={feed.id} feed={feed} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* ROADMAP */}
      {roadmaps.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icon="🗺️"
            title="Roadmap Belajar"
            desc="Jalur pembelajaran terstruktur"
            colorClass="emerald"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {roadmaps.slice(0, 4).map((roadmap) => (
              <Link
                key={roadmap.slug}
                href={`/roadmap/${roadmap.slug}`}
                className="glass-panel group overflow-hidden rounded-xl transition hover:border-emerald-400/40"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900/60">
                  <Image
                    src={roadmap.image}
                    alt={roadmap.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                      {roadmap.level}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-50 group-hover:text-emerald-200">
                    {roadmap.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-slate-400">
                    {roadmap.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PRODUK */}
      {products.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icon="🛍️"
            title="Produk Terbaru"
            desc="Merchandise dan produk digital"
            colorClass="purple"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/toko/${product.id}`}
                className="glass-panel group flex flex-col overflow-hidden rounded-lg transition hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900/60">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="flex flex-col gap-1.5 p-2.5">
                  <h3 className="line-clamp-2 min-h-10 text-sm leading-tight text-slate-50">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-orange-500">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{product.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BUKU */}
      {books.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icon="📚"
            title="Buku Terbaru"
            desc="Koleksi buku Q&A interaktif"
            colorClass="amber"
          />
          <div className="grid gap-4">
            {books.slice(0, 4).map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
