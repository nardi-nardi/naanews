"use client";

import { useEffect, useState } from "react";
import { FeedTitleCard } from "@/app/components/feed-title-card";
import { SiteShell } from "@/app/components/site-shell";
import type { Feed } from "@/app/data/content";

export default function AnalyticsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const res = await fetch("/api/feeds");
        const data = await res.json();
        // Sort by createdAt descending (newest first)
        setFeeds(data.sort((a: Feed, b: Feed) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Failed to fetch feeds:", error);
        setFeeds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  const categoryCounts = {
    berita: feeds.filter((feed) => feed.category === "Berita").length,
    tutorial: feeds.filter((feed) => feed.category === "Tutorial").length,
    riset: feeds.filter((feed) => feed.category === "Riset").length,
  };

  const avgChatLength =
    feeds.reduce((acc, item) => acc + item.lines.length, 0) / (feeds.length || 1);

  return (
    <SiteShell activePath="/analytics">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Analytics</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">Dashboard Konten</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Ringkasan konten untuk melihat distribusi kategori dan statistik.
        </p>

        {loading ? (
          <div className="mt-5 text-sm text-slate-400">Loading...</div>
        ) : (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">Total Konten</p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">{feeds.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">Berita</p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">{categoryCounts.berita}</p>
              </div>
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">Tutorial</p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">{categoryCounts.tutorial}</p>
              </div>
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">Rata-rata Q&A</p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">{avgChatLength.toFixed(1)}</p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="mt-5 grid gap-4">
        {feeds.map((feed, index) => (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        ))}
      </section>
    </SiteShell>
  );
}
