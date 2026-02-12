"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Feed, Story, ChatLine, Book, BookChapter } from "@/app/data/content";

type Tab = "feeds" | "stories" | "books";

type FeedForm = {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  time: string;
  popularity: number;
  image: string;
  takeaway: string;
  lines: ChatLine[];
};

type StoryForm = {
  name: string;
  label: string;
  type: "Berita" | "Tutorial" | "Riset";
  palette: string;
  viral: boolean;
};

const emptyFeedForm: FeedForm = {
  title: "",
  category: "Berita",
  time: "",
  popularity: 50,
  image: "",
  takeaway: "",
  lines: [{ role: "q", text: "" }, { role: "a", text: "" }],
};

const emptyStoryForm: StoryForm = {
  name: "",
  label: "",
  type: "Berita",
  palette: "from-sky-400 to-blue-500",
  viral: false,
};

type BookForm = {
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  chapters: BookChapter[];
};

const emptyBookForm: BookForm = {
  title: "",
  author: "",
  cover: "",
  genre: "",
  pages: 0,
  rating: 0,
  description: "",
  chapters: [
    {
      title: "",
      lines: [
        { role: "q", text: "" },
        { role: "a", text: "" },
      ],
    },
  ],
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("feeds");
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [message, setMessage] = useState("");

  // Feed form
  const [feedForm, setFeedForm] = useState<FeedForm>(emptyFeedForm);
  const [editingFeedId, setEditingFeedId] = useState<number | null>(null);
  const [showFeedForm, setShowFeedForm] = useState(false);

  // Story form
  const [storyForm, setStoryForm] = useState<StoryForm>(emptyStoryForm);
  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
  const [showStoryForm, setShowStoryForm] = useState(false);

  // Book form
  const [bookForm, setBookForm] = useState<BookForm>(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [feedsRes, storiesRes, booksRes] = await Promise.all([
        fetch("/api/feeds"),
        fetch("/api/stories"),
        fetch("/api/books"),
      ]);
      if (feedsRes.ok) setFeeds(await feedsRes.json());
      if (storiesRes.ok) setStories(await storiesRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  // ──── SEED ────
  async function handleSeed() {
    if (!confirm("Ini akan menghapus semua data di DB dan menggantinya dengan dummy data. Lanjut?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        flash(`✅ Seed berhasil! ${data.feedsInserted} feeds, ${data.storiesInserted} stories, ${data.booksInserted} books`);
        fetchData();
      } else {
        flash(`❌ Seed gagal: ${data.error}`);
      }
    } catch {
      flash("❌ Seed gagal: network error");
    }
    setSeeding(false);
  }

  // ──── FETCH REAL NEWS ────
  async function handleFetchNews() {
    setFetchingNews(true);
    try {
      const res = await fetch("/api/fetch-news", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        const sourceInfo = (data.sources as { name: string; count: number; error?: string }[])
          .map((s) => `${s.name}: ${s.count}${s.error ? " ⚠️" : ""}`)
          .join(", ");
        flash(`📡 ${data.message} (${sourceInfo})`);
        fetchData();
      } else {
        flash(`❌ ${data.message || data.error || "Gagal fetch news"}`);
      }
    } catch {
      flash("❌ Gagal mengambil berita: network error");
    }
    setFetchingNews(false);
  }

  // ──── FEED CRUD ────
  function openFeedCreate() {
    setFeedForm(emptyFeedForm);
    setEditingFeedId(null);
    setShowFeedForm(true);
  }

  function openFeedEdit(feed: Feed) {
    setFeedForm({
      title: feed.title,
      category: feed.category,
      time: feed.time,
      popularity: feed.popularity,
      image: feed.image,
      takeaway: feed.takeaway,
      lines: [...feed.lines],
    });
    setEditingFeedId(feed.id);
    setShowFeedForm(true);
  }

  async function saveFeed() {
    try {
      if (editingFeedId !== null) {
        const res = await fetch(`/api/feeds/${editingFeedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedForm),
        });
        if (res.ok) flash("✅ Feed berhasil diupdate");
        else flash("❌ Gagal update feed");
      } else {
        const res = await fetch("/api/feeds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedForm),
        });
        if (res.ok) flash("✅ Feed berhasil dibuat");
        else flash("❌ Gagal membuat feed");
      }
      setShowFeedForm(false);
      fetchData();
    } catch {
      flash("❌ Network error");
    }
  }

  async function deleteFeed(id: number) {
    if (!confirm("Hapus feed ini?")) return;
    try {
      const res = await fetch(`/api/feeds/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Feed dihapus");
        fetchData();
      } else flash("❌ Gagal menghapus feed");
    } catch {
      flash("❌ Network error");
    }
  }

  function addLine() {
    setFeedForm((prev) => ({
      ...prev,
      lines: [...prev.lines, { role: "q", text: "", image: "" }],
    }));
  }

  function removeLine(index: number) {
    setFeedForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  }

  function updateLine(index: number, field: "role" | "text" | "image", value: string) {
    setFeedForm((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line,
      ),
    }));
  }

  // ──── STORY CRUD ────
  function openStoryCreate() {
    setStoryForm(emptyStoryForm);
    setEditingStoryId(null);
    setShowStoryForm(true);
  }

  function openStoryEdit(story: Story) {
    setStoryForm({
      name: story.name,
      label: story.label,
      type: story.type,
      palette: story.palette,
      viral: story.viral,
    });
    setEditingStoryId(story.id);
    setShowStoryForm(true);
  }

  async function saveStory() {
    try {
      if (editingStoryId !== null) {
        const res = await fetch(`/api/stories/${editingStoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storyForm),
        });
        if (res.ok) flash("✅ Story berhasil diupdate");
        else flash("❌ Gagal update story");
      } else {
        const res = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storyForm),
        });
        if (res.ok) flash("✅ Story berhasil dibuat");
        else flash("❌ Gagal membuat story");
      }
      setShowStoryForm(false);
      fetchData();
    } catch {
      flash("❌ Network error");
    }
  }

  async function deleteStory(id: number) {
    if (!confirm("Hapus story ini?")) return;
    try {
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Story dihapus");
        fetchData();
      } else flash("❌ Gagal menghapus story");
    } catch {
      flash("❌ Network error");
    }
  }

  // ──── BOOK CRUD ────
  function openBookCreate() {
    setBookForm(JSON.parse(JSON.stringify(emptyBookForm)));
    setEditingBookId(null);
    setShowBookForm(true);
  }

  function openBookEdit(book: Book) {
    setBookForm({
      title: book.title,
      author: book.author,
      cover: book.cover,
      genre: book.genre,
      pages: book.pages,
      rating: book.rating,
      description: book.description,
      chapters: JSON.parse(JSON.stringify(book.chapters)),
    });
    setEditingBookId(book.id);
    setShowBookForm(true);
  }

  async function saveBook() {
    try {
      if (editingBookId !== null) {
        const res = await fetch(`/api/books/${editingBookId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookForm),
        });
        if (res.ok) flash("✅ Buku berhasil diupdate");
        else flash("❌ Gagal update buku");
      } else {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookForm),
        });
        if (res.ok) flash("✅ Buku berhasil dibuat");
        else flash("❌ Gagal membuat buku");
      }
      setShowBookForm(false);
      fetchData();
    } catch {
      flash("❌ Network error");
    }
  }

  async function deleteBook(id: number) {
    if (!confirm("Hapus buku ini?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Buku dihapus");
        fetchData();
      } else flash("❌ Gagal menghapus buku");
    } catch {
      flash("❌ Network error");
    }
  }

  // Chapter helpers
  function addChapter() {
    setBookForm((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: "", lines: [{ role: "q", text: "" }, { role: "a", text: "" }] },
      ],
    }));
  }

  function removeChapter(chapterIndex: number) {
    setBookForm((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== chapterIndex),
    }));
  }

  function updateChapterTitle(chapterIndex: number, title: string) {
    setBookForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, title } : ch,
      ),
    }));
  }

  function addChapterLine(chapterIndex: number) {
    setBookForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, lines: [...ch.lines, { role: "q" as const, text: "", image: "" }] } : ch,
      ),
    }));
  }

  function removeChapterLine(chapterIndex: number, lineIndex: number) {
    setBookForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? { ...ch, lines: ch.lines.filter((_, li) => li !== lineIndex) }
          : ch,
      ),
    }));
  }

  function updateChapterLine(chapterIndex: number, lineIndex: number, field: "role" | "text" | "image", value: string) {
    setBookForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === chapterIndex
          ? {
              ...ch,
              lines: ch.lines.map((line, li) =>
                li === lineIndex ? { ...line, [field]: value } : line,
              ),
            }
          : ch,
      ),
    }));
  }

  // ──── PALETTE OPTIONS ────
  const paletteOptions = [
    { value: "from-sky-400 to-blue-500", label: "Sky → Blue" },
    { value: "from-amber-300 to-orange-500", label: "Amber → Orange" },
    { value: "from-emerald-400 to-teal-500", label: "Emerald → Teal" },
    { value: "from-indigo-400 to-blue-600", label: "Indigo → Blue" },
    { value: "from-pink-400 to-rose-500", label: "Pink → Rose" },
    { value: "from-violet-400 to-fuchsia-500", label: "Violet → Fuchsia" },
  ];

  return (
    <div className="bg-canvas min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">🛠️ Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-400">Kelola feeds, stories, dan buku NAA News</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-slate-600/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              ← Kembali ke Home
            </Link>
            <button
              onClick={handleFetchNews}
              disabled={fetchingNews}
              className="rounded-xl bg-emerald-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {fetchingNews ? "⏳ Mengambil..." : "📡 Ambil Berita Terbaru"}
            </button>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="rounded-xl bg-amber-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {seeding ? "Seeding..." : "🌱 Seed Database"}
            </button>
          </div>
        </div>

        {/* Flash message */}
        {message ? (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {message}
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("feeds")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === "feeds"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📰 Feeds ({feeds.length})
          </button>
          <button
            onClick={() => setTab("stories")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === "stories"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💬 Stories ({stories.length})
          </button>
          <button
            onClick={() => setTab("books")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === "books"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📚 Buku ({books.length})
          </button>
        </div>

        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">Memuat data...</div>
        ) : (
          <>
            {/* ──── FEEDS TAB ──── */}
            {tab === "feeds" ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Daftar Feed</h2>
                  <button
                    onClick={openFeedCreate}
                    className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    + Tambah Feed
                  </button>
                </div>

                {/* Feed form modal */}
                {showFeedForm ? (
                  <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
                    <h3 className="mb-4 text-base font-semibold">
                      {editingFeedId !== null ? `Edit Feed #${editingFeedId}` : "Feed Baru"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Title</label>
                        <input
                          value={feedForm.title}
                          onChange={(e) => setFeedForm((p) => ({ ...p, title: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Category</label>
                        <select
                          value={feedForm.category}
                          onChange={(e) =>
                            setFeedForm((p) => ({
                              ...p,
                              category: e.target.value as Feed["category"],
                            }))
                          }
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        >
                          <option value="Berita">Berita</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Riset">Riset</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Time</label>
                        <input
                          value={feedForm.time}
                          onChange={(e) => setFeedForm((p) => ({ ...p, time: e.target.value }))}
                          placeholder="e.g. 2 jam lalu"
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Popularity (0-100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={feedForm.popularity}
                          onChange={(e) => setFeedForm((p) => ({ ...p, popularity: Number(e.target.value) }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-slate-400">Image URL</label>
                        <input
                          value={feedForm.image}
                          onChange={(e) => setFeedForm((p) => ({ ...p, image: e.target.value }))}
                          placeholder="https://picsum.photos/seed/your-seed/800/400"
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-slate-400">Takeaway</label>
                        <textarea
                          value={feedForm.takeaway}
                          onChange={(e) => setFeedForm((p) => ({ ...p, takeaway: e.target.value }))}
                          rows={2}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                    </div>

                    {/* Q&A Lines */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs text-slate-400">Chat Lines (Q&A)</label>
                        <button
                          onClick={addLine}
                          className="rounded-lg bg-slate-700/60 px-3 py-1 text-xs text-slate-300 hover:bg-slate-600/60"
                        >
                          + Tambah Line
                        </button>
                      </div>
                      <div className="space-y-3">
                        {feedForm.lines.map((line, i) => (
                          <div key={i} className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-2.5">
                            <div className="flex items-start gap-2">
                              <select
                                value={line.role}
                                onChange={(e) => updateLine(i, "role", e.target.value)}
                                className="shrink-0 rounded-lg border border-slate-600/50 bg-slate-800/60 px-2 py-2 text-xs outline-none"
                              >
                                <option value="q">Q</option>
                                <option value="a">A</option>
                              </select>
                              <input
                                value={line.text}
                                onChange={(e) => updateLine(i, "text", e.target.value)}
                                placeholder={line.role === "q" ? "Pertanyaan..." : "Jawaban..."}
                                className="min-w-0 flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                              />
                              <button
                                onClick={() => removeLine(i)}
                                className="shrink-0 rounded-lg bg-red-900/40 px-2 py-2 text-xs text-red-300 hover:bg-red-800/50"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 pl-[42px]">
                              <span className="text-[10px] text-slate-500">🖼️</span>
                              <input
                                value={line.image ?? ""}
                                onChange={(e) => updateLine(i, "image", e.target.value)}
                                placeholder="Image URL (opsional)"
                                className="min-w-0 flex-1 rounded-md border border-slate-700/40 bg-slate-800/40 px-2.5 py-1.5 text-[12px] text-slate-300 outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={saveFeed}
                        className="rounded-xl bg-cyan-600/80 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        {editingFeedId !== null ? "Update" : "Simpan"}
                      </button>
                      <button
                        onClick={() => setShowFeedForm(false)}
                        className="rounded-xl border border-slate-600/50 px-5 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Feed list */}
                <div className="space-y-3">
                  {feeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              feed.category === "Berita"
                                ? "bg-sky-500/20 text-sky-300"
                                : feed.category === "Tutorial"
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-fuchsia-500/20 text-fuchsia-300"
                            }`}
                          >
                            {feed.category}
                          </span>
                          <span className="text-xs text-slate-500">ID: {feed.id}</span>
                          <span className="text-xs text-slate-500">Pop: {feed.popularity}</span>
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">{feed.title}</p>
                        <p className="truncate text-xs text-slate-400">{feed.time} · {feed.lines.length} lines</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openFeedEdit(feed)}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFeed(feed.id)}
                          className="rounded-lg bg-red-900/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-800/50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                  {feeds.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada feed. Klik &quot;Seed Database&quot; untuk mengisi data awal, atau tambah manual.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ──── STORIES TAB ──── */}
            {tab === "stories" ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Daftar Story</h2>
                  <button
                    onClick={openStoryCreate}
                    className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    + Tambah Story
                  </button>
                </div>

                {/* Story form */}
                {showStoryForm ? (
                  <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
                    <h3 className="mb-4 text-base font-semibold">
                      {editingStoryId !== null ? `Edit Story #${editingStoryId}` : "Story Baru"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Name</label>
                        <input
                          value={storyForm.name}
                          onChange={(e) => setStoryForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. AI Corner"
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Label (2-3 chars)</label>
                        <input
                          value={storyForm.label}
                          onChange={(e) => setStoryForm((p) => ({ ...p, label: e.target.value }))}
                          placeholder="e.g. AI"
                          maxLength={3}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Type</label>
                        <select
                          value={storyForm.type}
                          onChange={(e) =>
                            setStoryForm((p) => ({
                              ...p,
                              type: e.target.value as Story["type"],
                            }))
                          }
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        >
                          <option value="Berita">Berita</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Riset">Riset</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Palette</label>
                        <select
                          value={storyForm.palette}
                          onChange={(e) => setStoryForm((p) => ({ ...p, palette: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        >
                          {paletteOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-slate-400">Viral?</label>
                        <input
                          type="checkbox"
                          checked={storyForm.viral}
                          onChange={(e) => setStoryForm((p) => ({ ...p, viral: e.target.checked }))}
                          className="h-4 w-4 accent-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={saveStory}
                        className="rounded-xl bg-cyan-600/80 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        {editingStoryId !== null ? "Update" : "Simpan"}
                      </button>
                      <button
                        onClick={() => setShowStoryForm(false)}
                        className="rounded-xl border border-slate-600/50 px-5 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Story list */}
                <div className="space-y-3">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${story.palette} text-xs font-bold text-white`}
                        >
                          {story.label}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{story.name}</p>
                          <p className="text-xs text-slate-400">
                            {story.type} · {story.viral ? "🔥 Viral" : "Normal"} · ID: {story.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openStoryEdit(story)}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="rounded-lg bg-red-900/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-800/50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                  {stories.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada story. Klik &quot;Seed Database&quot; untuk mengisi data awal, atau tambah manual.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ──── BOOKS TAB ──── */}
            {tab === "books" ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Daftar Buku</h2>
                  <button
                    onClick={openBookCreate}
                    className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    + Tambah Buku
                  </button>
                </div>

                {/* Book form */}
                {showBookForm ? (
                  <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
                    <h3 className="mb-4 text-base font-semibold">
                      {editingBookId !== null ? `Edit Buku #${editingBookId}` : "Buku Baru"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Judul</label>
                        <input
                          value={bookForm.title}
                          onChange={(e) => setBookForm((p) => ({ ...p, title: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Author</label>
                        <input
                          value={bookForm.author}
                          onChange={(e) => setBookForm((p) => ({ ...p, author: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Genre</label>
                        <input
                          value={bookForm.genre}
                          onChange={(e) => setBookForm((p) => ({ ...p, genre: e.target.value }))}
                          placeholder="e.g. Software Engineering"
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Halaman</label>
                        <input
                          type="number"
                          min={0}
                          value={bookForm.pages}
                          onChange={(e) => setBookForm((p) => ({ ...p, pages: Number(e.target.value) }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Rating (0-5)</label>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={bookForm.rating}
                          onChange={(e) => setBookForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">Cover Image URL</label>
                        <input
                          value={bookForm.cover}
                          onChange={(e) => setBookForm((p) => ({ ...p, cover: e.target.value }))}
                          placeholder="https://picsum.photos/seed/your-seed/400/600"
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-slate-400">Deskripsi</label>
                        <textarea
                          value={bookForm.description}
                          onChange={(e) => setBookForm((p) => ({ ...p, description: e.target.value }))}
                          rows={2}
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                        />
                      </div>
                    </div>

                    {/* Chapters */}
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-300">Bab / Chapters</label>
                        <button
                          onClick={addChapter}
                          className="rounded-lg bg-slate-700/60 px-3 py-1 text-xs text-slate-300 hover:bg-slate-600/60"
                        >
                          + Tambah Bab
                        </button>
                      </div>
                      <div className="space-y-4">
                        {bookForm.chapters.map((chapter, ci) => (
                          <div
                            key={ci}
                            className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4"
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <span className="shrink-0 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                                Bab {ci + 1}
                              </span>
                              <input
                                value={chapter.title}
                                onChange={(e) => updateChapterTitle(ci, e.target.value)}
                                placeholder="Judul bab..."
                                className="min-w-0 flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-1.5 text-sm outline-none focus:border-cyan-400/60"
                              />
                              <button
                                onClick={() => removeChapter(ci)}
                                className="shrink-0 rounded-lg bg-red-900/40 px-2 py-1.5 text-xs text-red-300 hover:bg-red-800/50"
                              >
                                ✕ Hapus Bab
                              </button>
                            </div>

                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">Lines Q&A</span>
                              <button
                                onClick={() => addChapterLine(ci)}
                                className="rounded-lg bg-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-600/60"
                              >
                                + Line
                              </button>
                            </div>
                            <div className="space-y-2">
                              {chapter.lines.map((line, li) => (
                                <div key={li} className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-2">
                                  <div className="flex items-start gap-1.5">
                                    <select
                                      value={line.role}
                                      onChange={(e) => updateChapterLine(ci, li, "role", e.target.value)}
                                      className="shrink-0 rounded-md border border-slate-600/50 bg-slate-800/60 px-1.5 py-1.5 text-[11px] outline-none"
                                    >
                                      <option value="q">Q</option>
                                      <option value="a">A</option>
                                    </select>
                                    <input
                                      value={line.text}
                                      onChange={(e) => updateChapterLine(ci, li, "text", e.target.value)}
                                      placeholder={line.role === "q" ? "Pertanyaan..." : "Jawaban..."}
                                      className="min-w-0 flex-1 rounded-md border border-slate-600/50 bg-slate-800/60 px-2 py-1.5 text-[12px] outline-none focus:border-cyan-400/60"
                                    />
                                    <button
                                      onClick={() => removeChapterLine(ci, li)}
                                      className="shrink-0 rounded-md bg-red-900/40 px-1.5 py-1.5 text-[11px] text-red-300 hover:bg-red-800/50"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <div className="mt-1 flex items-center gap-1.5 pl-[34px]">
                                    <span className="text-[10px] text-slate-500">🖼️</span>
                                    <input
                                      value={line.image ?? ""}
                                      onChange={(e) => updateChapterLine(ci, li, "image", e.target.value)}
                                      placeholder="Image URL (opsional)"
                                      className="min-w-0 flex-1 rounded-md border border-slate-700/40 bg-slate-800/40 px-2 py-1 text-[11px] text-slate-300 outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={saveBook}
                        className="rounded-xl bg-cyan-600/80 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        {editingBookId !== null ? "Update" : "Simpan"}
                      </button>
                      <button
                        onClick={() => setShowBookForm(false)}
                        className="rounded-xl border border-slate-600/50 px-5 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Book list */}
                <div className="space-y-3">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            {book.genre}
                          </span>
                          <span className="text-xs text-slate-500">ID: {book.id}</span>
                          <span className="text-xs text-amber-300">★ {book.rating}</span>
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">{book.title}</p>
                        <p className="truncate text-xs text-slate-400">
                          {book.author} · {book.chapters.length} bab · {book.pages} hal
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openBookEdit(book)}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="rounded-lg bg-red-900/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-800/50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada buku. Klik &quot;Seed Database&quot; untuk mengisi data awal, atau tambah manual.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
