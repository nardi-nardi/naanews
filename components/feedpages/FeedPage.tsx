"use client";

import { useState } from "react";
import { BookCard } from "@/components/books/book-card";
import { FeedTitleCard } from "@/components/feedpages/FeedTitleCard";
import { GlobalSearchForm } from "@/components/GlobalSearchForm";
import { TutorialCard } from "@/components/tutorial-card";
import type { Book, Feed, Story } from "@/data/content";
import { useGlobalSearchFocus } from "@/hooks/useGlobalSearchFocus";
import { SiteShell } from "../navigation/SiteShell";
import { StatusViralSection } from "../status-bubble/StatusViralSection";
import { CategoryTabs } from "./CategoryTabs";
import { HomeAllSections } from "./HomeAllSections";
import { Product } from "@/types/products";
import { Roadmap } from "@/types/roadmaps";

export type HomeCategory = "Semua" | "Berita" | "Tutorial" | "Riset" | "Buku";

// (Letakkan type Product & Roadmap di sini atau di file type terpisah)

type FeedPageProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset";
  badge: string;
  title: string;
  description: string;
  category?: Feed["category"];
  showStories?: boolean;
  initialFeeds: Feed[];
  initialStories: Story[];
  initialBooks: Book[];
  initialRoadmaps: Roadmap[];
  initialProducts: Product[];
};

export function FeedPage({
  activePath,
  badge,
  title,
  description,
  category,
  showStories = false,
  initialFeeds = [],
  initialStories = [],
  initialBooks = [],
  initialRoadmaps = [],
  initialProducts = [],
}: FeedPageProps) {
  const isHome = activePath === "/";
  const [activeCategory, setActiveCategory] = useState<HomeCategory>(
    isHome ? "Semua" : "Berita"
  );

  // Panggil hook untuk shortcut keyboard
  useGlobalSearchFocus();

  // Filter Data Data Logics
  const isAllSection = isHome && activeCategory === "Semua";
  const isBookSection = activeCategory === "Buku";

  const filteredFeeds = isBookSection
    ? []
    : isAllSection
      ? initialFeeds
      : initialFeeds.filter((f) => f.category === activeCategory);
  const pageFeeds =
    !isHome && category
      ? initialFeeds.filter((f) => f.category === category)
      : initialFeeds;

  // Komponen Helper untuk me-render list feed/tutorial
  const renderFeedList = (feeds: Feed[], targetCategory?: string) => {
    if (feeds.length === 0) {
      return (
        <div className="glass-panel mt-4 rounded-2xl p-5 text-sm text-slate-300">
          Belum ada konten untuk kategori ini.
        </div>
      );
    }
    return (
      <section className="mt-4 grid gap-4">
        {feeds.map((feed, index) =>
          targetCategory === "Tutorial" ? (
            <TutorialCard key={feed.id} feed={feed} index={index} />
          ) : (
            <FeedTitleCard key={feed.id} feed={feed} index={index} />
          )
        )}
      </section>
    );
  };

  return (
    <SiteShell activePath={activePath}>
      {/* HEADER HERO */}
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
              {badge}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              {description}
            </p>
          </div>
        </div>
        {isHome && showStories && initialStories.length > 0 && (
          <div className="hidden xl:block mt-4">
            <StatusViralSection
              stories={initialStories}
              feeds={initialFeeds}
              books={initialBooks}
            />
          </div>
        )}
      </section>

      {/* MOBILE STORIES & SEARCH */}
      {isHome && (
        <div className="mt-4 flex flex-col gap-4">
          {showStories && initialStories.length > 0 && (
            <section className="glass-panel rounded-3xl p-5 xl:hidden">
              <StatusViralSection
                stories={initialStories}
                feeds={initialFeeds}
                books={initialBooks}
                standalone
              />
            </section>
          )}
          <GlobalSearchForm />
        </div>
      )}

      {/* CATEGORY TABS (Hanya di Home) */}
      {isHome && (
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {/* CONTENT ROUTING */}
      {isHome ? (
        isAllSection ? (
          // Jika Tab "Semua" diklik
          <HomeAllSections
            feeds={initialFeeds}
            roadmaps={initialRoadmaps}
            products={initialProducts}
            books={initialBooks}
          />
        ) : isBookSection ? (
          // Jika Tab "Buku" diklik
          <section className="mt-4 grid gap-4">
            {initialBooks.length > 0 ? (
              initialBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            ) : (
              <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
                Belum ada buku.
              </div>
            )}
          </section>
        ) : (
          // Jika Tab Spesifik diklik (Berita, Tutorial, Riset)
          renderFeedList(filteredFeeds, activeCategory)
        )
      ) : (
        // Jika bukan di halaman Home (misal langsung masuk /berita)
        renderFeedList(pageFeeds, category)
      )}
    </SiteShell>
  );
}
