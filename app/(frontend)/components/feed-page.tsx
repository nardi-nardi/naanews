"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookCard } from "@/app/(frontend)/components/book-card";
import { FeedTitleCard } from "@/app/(frontend)/components/feed-title-card";
import { GlobalSearchForm } from "@/app/(frontend)/components/global-search-form";
import { SiteShell } from "@/app/(frontend)/components/site-shell";
import { StatusViralSection } from "@/app/(frontend)/components/status-viral-section";
import { TutorialCard } from "@/app/(frontend)/components/tutorial-card";
import type { Book, Feed, Story } from "@/app/(frontend)/data/content";

type HomeCategory = "Semua" | "Berita" | "Tutorial" | "Riset" | "Buku";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt?: number;
};

type Roadmap = {
  slug: string;
  title: string;
  summary: string;
  level: string;
  image: string;
  createdAt?: number;
};

const categoryButtons: { key: HomeCategory; icon: string; activeColor: string }[] = [
  { key: "Semua", icon: "🌐", activeColor: "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40" },
  { key: "Berita", icon: "📰", activeColor: "bg-sky-500/20 text-sky-200 ring-1 ring-sky-500/40" },
  { key: "Tutorial", icon: "🎓", activeColor: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/40" },
  { key: "Riset", icon: "🔬", activeColor: "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-fuchsia-500/40" },
  { key: "Buku", icon: "📚", activeColor: "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/40" },
];

type FeedPageProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset";
  badge: string;
  title: string;
  description: string;
  category?: string;
  showStories?: boolean;
};

export function FeedPage({
  activePath,
  badge,
  title,
  description,
  category,
  showStories = false,
}: FeedPageProps) {
  const isHome = activePath === "/";
  const [activeCategory, setActiveCategory] = useState<HomeCategory>(isHome ? "Semua" : "Berita");
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const feedsUrl = category ? `/api/feeds?category=${category}` : "/api/feeds";
        const promises = [
          fetch(feedsUrl),
          showStories ? fetch("/api/stories") : Promise.resolve(null),
          isHome ? fetch("/api/books") : Promise.resolve(null),
          isHome ? fetch("/api/roadmaps") : Promise.resolve(null),
          isHome ? fetch("/api/products") : Promise.resolve(null),
        ];

        const [feedsRes, storiesRes, booksRes, roadmapsRes, productsRes] = await Promise.all(promises);

        if (feedsRes) {
          const feedsData = await feedsRes.json();
          if (Array.isArray(feedsData)) {
            setFeeds(feedsData);
          } else {
            console.error("Feeds response is not an array:", feedsData);
            setFeeds([]);
          }
        }

        if (storiesRes) {
          const storiesData = await storiesRes.json();
          if (Array.isArray(storiesData)) {
            setStories(storiesData);
          } else {
            setStories([]);
          }
        }

        if (booksRes) {
          const booksData = await booksRes.json();
          if (Array.isArray(booksData)) {
            setBooks(booksData);
          } else {
            setBooks([]);
          }
        }

        if (roadmapsRes) {
          const roadmapsData = await roadmapsRes.json();
          if (Array.isArray(roadmapsData)) {
            setRoadmaps(roadmapsData);
          } else {
            setRoadmaps([]);
          }
        }

        if (productsRes) {
          const productsData = await productsRes.json();
          if (Array.isArray(productsData)) {
            setProducts(productsData);
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFeeds([]);
        setStories([]);
        setBooks([]);
        setRoadmaps([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category, showStories, isHome]);

  // Filter logic
  const filteredFeeds = activeCategory === "Buku"
    ? []
    : activeCategory === "Semua"
    ? feeds
    : feeds.filter((f) => f.category === activeCategory);

  const showBooks = isHome && (activeCategory === "Buku" || activeCategory === "Semua");
  const showRoadmaps = isHome && activeCategory === "Semua";
  const showProducts = isHome && activeCategory === "Semua";
  const showFeeds = activeCategory !== "Buku";
  const showAllSections = activeCategory === "Semua";

  return (
    <SiteShell activePath={activePath}>
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{badge}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">{description}</p>
          </div>
        </div>

        {showStories && !loading && stories.length > 0 ? (
          <div className="hidden xl:block">
            <StatusViralSection stories={stories} feeds={feeds} books={books} />
          </div>
        ) : null}
      </section>

      {isHome ? (
        <div className="mt-4 flex flex-col gap-4">
          {showStories && !loading && stories.length > 0 ? (
            <section className="glass-panel rounded-3xl p-5 xl:hidden">
              <StatusViralSection stories={stories} feeds={feeds} books={books} standalone />
            </section>
          ) : null}
          <div>
            <GlobalSearchForm />
          </div>
        </div>
      ) : null}

      {/* Category filter buttons — only on home */}
      {isHome ? (
        <div className="mt-5 -mx-3 md:-mx-5">
          <div className="flex items-center gap-2 overflow-x-auto px-3 pb-2 md:px-5 scrollbar-hide">
            {categoryButtons.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.key
                    ? cat.activeColor
                    : "border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {cat.icon} {cat.key}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4 grid gap-4">
          {/* Skeleton loading cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel animate-pulse rounded-3xl overflow-hidden">
              <div className="h-44 w-full bg-slate-800/50 md:h-52" />
              <div className="p-5 md:p-6">
                <div className="mb-4">
                  <div className="h-6 w-3/4 rounded bg-slate-800/50 md:h-7" />
                  <div className="mt-2 h-3 w-24 rounded bg-slate-800/50" />
                </div>
                <div className="h-16 rounded-xl bg-slate-800/50" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Feed cards - Tutorial 1 kolom, yang lain juga 1 kolom */}
          {isHome && showFeeds && filteredFeeds.length > 0 && !showAllSections ? (
            <section className="mt-4">
              <div className="grid gap-4">
                {filteredFeeds.map((feed, index) =>
                  activeCategory === "Tutorial" ? (
                    <TutorialCard key={feed.id} feed={feed} index={index} />
                  ) : (
                    <FeedTitleCard key={feed.id} feed={feed} index={index} />
                  ),
                )}
              </div>
            </section>
          ) : null}

          {/* Kategori Semua - Sections per jenis konten */}
          {isHome && showAllSections ? (
            <>
              {/* Section Berita */}
              {filteredFeeds.filter(f => f.category === "Berita").length > 0 && (
                <section className="mt-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/25">
                      <span className="text-lg">📰</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Berita Terbaru</h2>
                      <p className="text-xs text-slate-400">Update berita teknologi</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {filteredFeeds.filter(f => f.category === "Berita").slice(0, 4).map((feed, index) => (
                      <FeedTitleCard key={feed.id} feed={feed} index={index} />
                    ))}
                  </div>
                </section>
              )}

              {/* Section Tutorial */}
              {filteredFeeds.filter(f => f.category === "Tutorial").length > 0 && (
                <section className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/25">
                      <span className="text-lg">🎓</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Tutorial Terbaru</h2>
                      <p className="text-xs text-slate-400">Panduan step-by-step</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {filteredFeeds.filter(f => f.category === "Tutorial").slice(0, 4).map((feed, index) => (
                      <TutorialCard key={feed.id} feed={feed} index={index} />
                    ))}
                  </div>
                </section>
              )}

              {/* Section Riset */}
              {filteredFeeds.filter(f => f.category === "Riset").length > 0 && (
                <section className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/15 ring-1 ring-fuchsia-500/25">
                      <span className="text-lg">🔬</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Riset Terbaru</h2>
                      <p className="text-xs text-slate-400">Analisa mendalam</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {filteredFeeds.filter(f => f.category === "Riset").slice(0, 4).map((feed, index) => (
                      <FeedTitleCard key={feed.id} feed={feed} index={index} />
                    ))}
                  </div>
                </section>
              )}

              {/* Section Roadmap */}
              {showRoadmaps && roadmaps.length > 0 && (
                <section className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/25">
                      <span className="text-lg">🗺️</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Roadmap Belajar</h2>
                      <p className="text-xs text-slate-400">Jalur pembelajaran terstruktur</p>
                    </div>
                  </div>
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

              {/* Section Produk */}
              {showProducts && products.length > 0 && (
                <section className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 ring-1 ring-purple-500/25">
                      <span className="text-lg">🛍️</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Produk Terbaru</h2>
                      <p className="text-xs text-slate-400">Merchandise dan produk digital</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={`/toko/${product.id}`}
                        className="glass-panel group flex flex-col overflow-hidden rounded-lg transition hover:shadow-lg hover:shadow-cyan-500/10"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-slate-900/60">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
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
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Section Buku */}
              {showBooks && books.length > 0 && (
                <section className="mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/25">
                      <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-50">Buku Terbaru</h2>
                      <p className="text-xs text-slate-400">Koleksi buku Q&A interaktif</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {books.slice(0, 4).map((book, index) => (
                      <BookCard key={book.id} book={book} index={index} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : null}

          {/* Non-home feed cards */}
          {!isHome ? (
            <section className="mt-5 grid gap-4">
              {feeds.length > 0 ? (
                feeds.map((feed, index) =>
                  category === "Tutorial" ? (
                    <TutorialCard key={feed.id} feed={feed} index={index} />
                  ) : (
                    <FeedTitleCard key={feed.id} feed={feed} index={index} />
                  ),
                )
              ) : (
                <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
                  Belum ada konten untuk kategori ini.
                </div>
              )}
            </section>
          ) : null}

          {/* Book cards - when Buku category is selected */}
          {isHome && activeCategory === "Buku" && books.length > 0 ? (
            <section className="mt-4">
              <div className="grid gap-4">
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Home empty state */}
          {isHome && !showAllSections && filteredFeeds.length === 0 && activeCategory !== "Buku" ? (
            <div className="glass-panel mt-4 rounded-2xl p-5 text-sm text-slate-300">
              Belum ada konten untuk kategori ini.
            </div>
          ) : null}
        </>
      )}
    </SiteShell>
  );
}
