"use client";

import { FeedTitleCard } from "@/app/(frontend)/components/feed-title-card";
import { BookCard } from "@/app/(frontend)/components/book-card";
import { SiteShell } from "@/app/(frontend)/components/site-shell";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import type { Feed, Book } from "@/app/(frontend)/data/content";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [feedResults, setFeedResults] = useState<Feed[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input saat pertama kali load atau query berubah dari luar
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Set cursor di akhir text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, []);

  // Auto redirect ke home kalau input kosong
  useEffect(() => {
    if (!query.trim()) {
      const timer = setTimeout(() => {
        router.push("/?from=search");
      }, 500); // Tunggu 500ms sebelum redirect
      return () => clearTimeout(timer);
    }
  }, [query, router]);

  // Update URL tanpa navigation
  useEffect(() => {
    if (query.trim()) {
      window.history.replaceState(null, "", `/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      window.history.replaceState(null, "", "/search");
    }
  }, [query]);

  // Realtime search saat query berubah
  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setFeedResults([]);
        setBookResults([]);
        return;
      }

      setLoading(true);
      try {
        const normalized = query.toLowerCase();
        const tokens = normalized.split(/\s+/).filter(Boolean);

        const [feedsRes, booksRes] = await Promise.all([
          fetch("/api/feeds"),
          fetch("/api/books"),
        ]);

        const allFeeds: Feed[] = await feedsRes.json();
        const allBooks: Book[] = await booksRes.json();

        const filteredFeeds = Array.isArray(allFeeds) ? allFeeds.filter((feed) => {
          const haystack = [feed.title, feed.category, feed.takeaway, ...feed.lines.map((l) => l.text)]
            .join(" ")
            .toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        }).sort((a, b) => b.createdAt - a.createdAt) : [];

        const filteredBooks = Array.isArray(allBooks) ? allBooks.filter((book) => {
          const haystack = [book.title, book.description, book.author]
            .join(" ")
            .toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        }) : [];

        setFeedResults(filteredFeeds);
        setBookResults(filteredBooks);
      } catch (error) {
        console.error("Search error:", error);
        setFeedResults([]);
        setBookResults([]);
      } finally {
        setLoading(false);
      }
    }

    // Debounce minimal - hanya 150ms untuk smooth typing
    const timer = setTimeout(performSearch, 150);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SiteShell activePath="/search">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Search</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">Hasil Pencarian Global</h1>
        <p className="mt-2 text-sm text-slate-300">
          {query ? `Kata kunci: "${query}"` : "Ketik untuk mencari..."}
        </p>
      </section>

      <div className="mt-4">
        <div className="glass-panel rounded-2xl p-3 md:p-4">
          <label htmlFor="global-search" className="mb-2 block text-xs uppercase tracking-[0.2em] text-cyan-300">
            Global Search
          </label>
          <input
            ref={inputRef}
            id="global-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari topik, judul, atau kata kunci..."
            autoComplete="off"
            className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
          />
        </div>
      </div>

      <section className="mt-5 grid gap-4">
        {loading ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            🔍 Mencari...
          </div>
        ) : !query ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            ↩️ Kembali ke homepage...
          </div>
        ) : null}

        {query && !loading && feedResults.length === 0 && bookResults.length === 0 ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Tidak ada hasil untuk kata kunci tersebut.
          </div>
        ) : null}

        {feedResults.map((feed, index) => (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        ))}
      </section>

      {bookResults.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">📚 Buku</h2>
          <div className="grid gap-4">
            {bookResults.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <SearchPageContent />
    </Suspense>
  );
}
