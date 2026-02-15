"use client";

import Link from "next/link";
import type { AdminTab } from "@/app/admin/_types";

type AdminTabBarProps = {
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  counts: {
    feeds: number;
    stories: number;
    books: number;
    roadmaps: number;
    products: number;
    categories: number;
  };
};

const tabs: { key: AdminTab; label: string; countKey: keyof AdminTabBarProps["counts"] }[] = [
  { key: "feeds", label: "📰 Feeds", countKey: "feeds" },
  { key: "stories", label: "💬 Stories", countKey: "stories" },
  { key: "books", label: "📚 Buku", countKey: "books" },
  { key: "roadmaps", label: "🧭 Roadmaps", countKey: "roadmaps" },
  { key: "products", label: "🛒 Produk", countKey: "products" },
  { key: "categories", label: "🏷️ Kategori", countKey: "categories" },
];

export function AdminTabBar({ tab, setTab, counts }: AdminTabBarProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map(({ key, label, countKey }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
            tab === key
              ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {label} ({counts[countKey]})
        </button>
      ))}
      <Link
        href="/admin/analytics"
        className="rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition flex items-center"
      >
        📊 Analytics
      </Link>
    </div>
  );
}
