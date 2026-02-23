"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminTab } from "@/app/admin/_types";
import { AdminTabBar } from "@/app/admin/_components/admin-tab-bar";

// Import komponen tab

import { FeedTab } from "./_components/feedTab";
import { StoryTab } from "./_components/story-tab";
import { BookTab } from "./_components/book-tab";
import { useAdmin } from "@/hooks/useAdmin";
import { RoadmapTab, ProductTab, CategoryTab } from "./_components/simple-tab";

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("feeds");
  const {
    data,
    loading,
    seeding,
    message,
    flash,
    handleSeed,
    fetchData,
    deleteItem,
  } = useAdmin();

  return (
    <div className="bg-canvas min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">🛠️ Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-400">
              Kelola konten Narzza Media Digital
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-slate-600/50 px-3 py-2 text-xs sm:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              ← Home
            </Link>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="rounded-xl bg-amber-600/80 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {seeding ? "⏳ Migrating..." : "🔄 Migrate DB"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {message}
          </div>
        )}

        <AdminTabBar
          tab={tab}
          setTab={setTab}
          counts={{
            feeds: data.feeds.length,
            stories: data.stories.length,
            books: data.books.length,
            roadmaps: data.roadmaps.length,
            products: data.products.length,
            categories: data.categories.length,
          }}
        />

        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            Memuat data...
          </div>
        ) : (
          <main className="mt-6">
            {tab === "feeds" && (
              <FeedTab
                feeds={data.feeds}
                onRefresh={fetchData}
                onDelete={(id: number) => deleteItem("feeds", id)}
                flash={flash}
              />
            )}
            {tab === "stories" && (
              <StoryTab
                stories={data.stories}
                onRefresh={fetchData}
                onDelete={(id: number) => deleteItem("stories", id)}
                flash={flash}
              />
            )}
            {tab === "books" && (
              <BookTab
                books={data.books}
                onRefresh={fetchData}
                onDelete={(id: number) => deleteItem("books", id)}
                flash={flash}
              />
            )}
            {tab === "roadmaps" && <RoadmapTab roadmaps={data.roadmaps} />}
            {tab === "products" && <ProductTab products={data.products} />}
            {tab === "categories" && (
              <CategoryTab categories={data.categories} />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
