"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/app/components/book-card";
import { FeedTitleCard } from "@/app/components/feed-title-card";
import { GlobalSearchForm } from "@/app/components/global-search-form";
import { SiteShell } from "@/app/components/site-shell";
import { StatusViralSection } from "@/app/components/status-viral-section";
import { TutorialCard } from "@/app/components/tutorial-card";
import type { Book, Feed, Story } from "@/app/data/content";

type HomeCategory = "Berita" | "Tutorial" | "Riset" | "Buku";

const categoryButtons: { key: HomeCategory; icon: string; activeColor: string }[] = [
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
  const [activeCategory, setActiveCategory] = useState<HomeCategory | null>(isHome ? "Berita" : null);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const feedsUrl = category ? `/api/feeds?category=${category}` : "/api/feeds";
        const [feedsRes, storiesRes, booksRes] = await Promise.all([
          fetch(feedsUrl),
          showStories ? fetch("/api/stories") : Promise.resolve(null),
          isHome ? fetch("/api/books") : Promise.resolve(null),
        ]);

        const feedsData = await feedsRes.json();
        if (Array.isArray(feedsData)) {
          setFeeds(feedsData);
        } else {
          console.error("Feeds response is not an array:", feedsData);
          setFeeds([]);
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
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFeeds([]);
        setStories([]);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category, showStories, isHome]);

  const filteredFeeds = activeCategory === null || activeCategory === "Buku"
    ? feeds
    : feeds.filter((f) => f.category === activeCategory);

  const showBooks = isHome && (activeCategory === null || activeCategory === "Buku");
  const showFeeds = activeCategory !== "Buku";

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
            <StatusViralSection stories={stories} feeds={feeds} />
          </div>
        ) : null}
      </section>

      {isHome ? (
        <div className="mt-4 flex flex-col gap-4">
          {showStories && !loading && stories.length > 0 ? (
            <section className="glass-panel rounded-3xl p-5 xl:hidden">
              <StatusViralSection stories={stories} feeds={feeds} standalone />
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
                onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
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
          {/* Feed cards */}
          {isHome && showFeeds && filteredFeeds.length > 0 ? (
            <section className="mt-4 grid gap-4">
              {filteredFeeds.map((feed, index) =>
                (activeCategory === "Tutorial" || (activeCategory === null && feed.category === "Tutorial")) ? (
                  <TutorialCard key={feed.id} feed={feed} index={index} />
                ) : (
                  <FeedTitleCard key={feed.id} feed={feed} index={index} />
                ),
              )}
            </section>
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

          {/* Book cards */}
          {showBooks && books.length > 0 ? (
            <section className={showFeeds && filteredFeeds.length > 0 ? "mt-6" : "mt-4"}>
              {activeCategory === null ? (
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
              ) : null}
              <div className="grid gap-4">
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Home empty state */}
          {isHome && showFeeds && filteredFeeds.length === 0 && !(showBooks && books.length > 0) ? (
            <div className="glass-panel mt-4 rounded-2xl p-5 text-sm text-slate-300">
              Belum ada konten untuk kategori ini.
            </div>
          ) : null}
        </>
      )}
    </SiteShell>
  );
}
