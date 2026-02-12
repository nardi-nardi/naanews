"use client";

import { useMemo, useState } from "react";
import { FeedTitleCard } from "@/app/components/feed-title-card";
import type { Feed } from "@/app/data/content";

type GlobalSearchFormProps = {
  placeholder?: string;
  feeds: Feed[];
  onSearchActive?: (active: boolean) => void;
};

export function GlobalSearchForm({
  placeholder = "Cari topik, judul, atau kata kunci...",
  feeds,
  onSearchActive,
}: GlobalSearchFormProps) {
  const [query, setQuery] = useState("");

  function handleChange(value: string) {
    setQuery(value);
    onSearchActive?.(value.trim().length > 0);
  }

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const normalized = trimmed.toLowerCase();
    const tokens = normalized.split(/\s+/).filter(Boolean);

    return [...feeds]
      .filter((feed) => {
        const haystack = [
          feed.title,
          feed.category,
          feed.takeaway,
          ...feed.lines.map((line) => line.text),
        ]
          .join(" ")
          .toLowerCase();

        return tokens.every((token) => haystack.includes(token));
      })
      .sort((a, b) => b.popularity - a.popularity);
  }, [query, feeds]);

  return (
    <div>
      <div className="glass-panel rounded-2xl p-3 md:p-4">
        <label htmlFor="global-search" className="mb-2 block text-xs uppercase tracking-[0.2em] text-cyan-300">
          Global Search
        </label>
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
        />
      </div>

      {results !== null ? (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200">
              {results.length ? `${results.length} hasil untuk "${query.trim()}"` : `Tidak ada hasil untuk "${query.trim()}"`}
            </p>
            <button
              type="button"
              onClick={() => handleChange("")}
              className="rounded-full border border-slate-500/50 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-400 hover:text-slate-100"
            >
              Bersihkan
            </button>
          </div>
          <div className="grid gap-4">
            {results.map((feed, index) => (
              <FeedTitleCard key={feed.id} feed={feed} index={index} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
