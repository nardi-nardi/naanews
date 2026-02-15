"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteShell } from "@/app/components/site-shell";
import type { Feed, Book } from "@/app/data/content";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#ec4899",
];

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type Roadmap = {
  slug: string;
  title: string;
  level: string;
  duration: string;
  tags: string[];
};

export default function AnalyticsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [feedsRes, booksRes, roadmapsRes, productsRes] =
          await Promise.all([
            fetch("/api/feeds"),
            fetch("/api/books"),
            fetch("/api/roadmaps"),
            fetch("/api/products"),
          ]);

        if (feedsRes.ok) {
          const data = await feedsRes.json();
          setFeeds(data.sort((a: Feed, b: Feed) => b.createdAt - a.createdAt));
        }
        if (booksRes.ok) setBooks(await booksRes.json());
        if (roadmapsRes.ok) setRoadmaps(await roadmapsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categoryCounts = {
    berita: feeds.filter((feed) => feed.category === "Berita").length,
    tutorial: feeds.filter((feed) => feed.category === "Tutorial").length,
    riset: feeds.filter((feed) => feed.category === "Riset").length,
  };

  const avgChatLength =
    feeds.reduce((acc, item) => acc + item.lines.length, 0) /
    (feeds.length || 1);

  // Total content across all types
  const totalContent =
    feeds.length + books.length + roadmaps.length + products.length;

  // Content type distribution
  const contentTypeData = [
    { name: "Feed", value: feeds.length },
    { name: "Buku", value: books.length },
    { name: "Roadmap", value: roadmaps.length },
    { name: "Produk", value: products.length },
  ];

  // Product stats
  const totalProductValue = products.reduce(
    (acc, p) => acc + p.price * p.stock,
    0
  );
  const productCategories = Array.from(
    new Set(products.map((p) => p.category))
  );
  const avgProductPrice =
    products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1);

  // Roadmap stats
  const roadmapLevels = {
    pemula: roadmaps.filter((r) => r.level === "Pemula").length,
    menengah: roadmaps.filter((r) => r.level === "Menengah").length,
    lanjutan: roadmaps.filter((r) => r.level === "Lanjutan").length,
  };

  const roadmapLevelData = [
    { level: "Pemula", count: roadmapLevels.pemula },
    { level: "Menengah", count: roadmapLevels.menengah },
    { level: "Lanjutan", count: roadmapLevels.lanjutan },
  ];

  // Data for category distribution pie chart
  const categoryData = [
    { name: "Berita", value: categoryCounts.berita },
    { name: "Tutorial", value: categoryCounts.tutorial },
    { name: "Riset", value: categoryCounts.riset },
  ];

  // Data for content over time (last 7 days)
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayFeeds = feeds.filter((feed) => {
      const feedDate = new Date(feed.createdAt);
      return feedDate.toDateString() === date.toDateString();
    });
    return {
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      berita: dayFeeds.filter((f) => f.category === "Berita").length,
      tutorial: dayFeeds.filter((f) => f.category === "Tutorial").length,
      riset: dayFeeds.filter((f) => f.category === "Riset").length,
      total: dayFeeds.length,
    };
  });

  // Top 10 most popular feeds
  const topFeeds = [...feeds]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  // Data for popularity distribution
  const popularityData = feeds.map((feed) => ({
    title: feed.title.substring(0, 20) + "...",
    popularity: feed.popularity,
    category: feed.category,
  }));

  // Average Q&A length by category
  const avgQAByCategory = [
    {
      category: "Berita",
      avgQA:
        feeds
          .filter((f) => f.category === "Berita")
          .reduce((acc, f) => acc + f.lines.length, 0) /
        (categoryCounts.berita || 1),
    },
    {
      category: "Tutorial",
      avgQA:
        feeds
          .filter((f) => f.category === "Tutorial")
          .reduce((acc, f) => acc + f.lines.length, 0) /
        (categoryCounts.tutorial || 1),
    },
    {
      category: "Riset",
      avgQA:
        feeds
          .filter((f) => f.category === "Riset")
          .reduce((acc, f) => acc + f.lines.length, 0) /
        (categoryCounts.riset || 1),
    },
  ];

  return (
    <SiteShell activePath="/analytics">
      {/* Hero Section */}
      <div className="glass-panel mb-4 sm:mb-8 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-4 sm:p-8 lg:p-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide sm:tracking-[0.2em] text-cyan-300">
          ANALYTICS DASHBOARD
        </p>
        <h1 className="mb-2 text-2xl font-bold text-slate-50 sm:text-3xl lg:text-4xl">
          📊 Analisis Konten
        </h1>
        <p className="max-w-2xl text-xs text-slate-300 sm:text-sm lg:text-base">
          Ringkasan konten untuk melihat distribusi kategori dan statistik.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel rounded-xl p-12 text-center text-slate-400">
          Loading...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mb-4 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Total Konten
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-slate-100">
                {totalContent}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Feed
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-cyan-400">
                {feeds.length}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Buku
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-amber-400">
                {books.length}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Roadmap
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-emerald-400">
                {roadmaps.length}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Produk
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-purple-400">
                {products.length}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-3 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Rata-rata Q&A
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-pink-400">
                {avgChatLength.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="mb-4 sm:mb-8 grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Content Type Distribution */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Distribusi Tipe Konten
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Feed Category Distribution */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Distribusi Kategori Feed
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Content Over Time */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Konten 7 Hari Terakhir
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="berita"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                  />
                  <Area
                    type="monotone"
                    dataKey="tutorial"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                  />
                  <Area
                    type="monotone"
                    dataKey="riset"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Average Q&A by Category */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Rata-rata Q&A per Kategori
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={avgQAByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgQA" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Popularity Trend */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Tren Popularitas Feed
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={popularityData.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} hide />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="popularity"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Roadmap Levels */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                Distribusi Level Roadmap
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roadmapLevelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="level" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mb-4 sm:mb-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Total Nilai Inventori
              </p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-400">
                Rp {totalProductValue.toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                Dari {products.length} produk
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Kategori Produk
              </p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-purple-400">
                {productCategories.length}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                {productCategories.join(", ")}
              </p>
            </div>
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">
                Rata-rata Harga Produk
              </p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-amber-400">
                Rp{" "}
                {avgProductPrice.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                Per item
              </p>
            </div>
          </div>

          {/* Content Lists Grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Top Feed */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                🔥 Top 10 Feed Terpopuler
              </h2>
              <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {topFeeds.map((feed, index) => (
                  <Link
                    key={feed.id}
                    href={`/read/${feed.id}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-cyan-400/50 hover:bg-slate-800/60"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {feed.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Pop: {feed.popularity}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Books */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                📚 Buku ({books.length})
              </h2>
              <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/buku/${book.id}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-amber-400/50 hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {book.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {book.author} • {book.pages} hal • ⭐ {book.rating}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      {book.genre}
                    </span>
                  </Link>
                ))}
                {books.length === 0 && (
                  <p className="text-center text-sm text-slate-500">
                    Belum ada buku
                  </p>
                )}
              </div>
            </div>

            {/* All Roadmaps */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                🧭 Roadmap ({roadmaps.length})
              </h2>
              <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {roadmaps.map((roadmap) => (
                  <Link
                    key={roadmap.slug}
                    href={`/roadmap/${roadmap.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-emerald-400/50 hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {roadmap.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {roadmap.duration}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {roadmap.level}
                    </span>
                  </Link>
                ))}
                {roadmaps.length === 0 && (
                  <p className="text-center text-sm text-slate-500">
                    Belum ada roadmap
                  </p>
                )}
              </div>
            </div>

            {/* All Products */}
            <div className="glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col">
              <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
                🛒 Produk ({products.length})
              </h2>
              <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/toko/${product.id}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-purple-400/50 hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Rp {product.price.toLocaleString("id-ID")} • Stok:{" "}
                        {product.stock}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                      {product.category}
                    </span>
                  </Link>
                ))}
                {products.length === 0 && (
                  <p className="text-center text-sm text-slate-500">
                    Belum ada produk
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* All Content List */}
          <div className="mt-4 sm:mt-8 glass-panel rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-slate-100">
              📋 Semua Konten ({feeds.length})
            </h2>
            <div className="space-y-2">
              {feeds.map((feed) => (
                <Link
                  key={feed.id}
                  href={`/read/${feed.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-cyan-400/50 hover:bg-slate-800/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {feed.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(feed.createdAt).toLocaleDateString("id-ID")} •{" "}
                      {feed.lines.length} Q&A
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      feed.category === "Berita"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : feed.category === "Tutorial"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {feed.category}
                  </span>
                  <div className="shrink-0 text-xs text-slate-500">
                    Pop: {feed.popularity}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </SiteShell>
  );
}
