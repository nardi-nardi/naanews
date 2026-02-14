"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ImageUpload } from "@/app/(frontend)/components/image-upload";
import type { Feed, Story, ChatLine, Book, BookChapter } from "@/app/(frontend)/data/content";
import type { Product, Category } from "@/app/(frontend)/toko/products";
import { RelativeTime } from "@/app/(frontend)/components/relative-time";

type Tab = "feeds" | "stories" | "books" | "roadmaps" | "products" | "categories" | "analytics";

type FeedForm = {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
  takeaway: string;
  lines: ChatLine[];
  source?: { title: string; url: string };
};

type StoryForm = {
  name: string;
  label: string;
  type: "Berita" | "Tutorial" | "Riset";
  palette: string;
  image: string;
  viral: boolean;
};

const emptyFeedForm: FeedForm = {
  title: "",
  category: "Berita",
  image: "",
  takeaway: "",
  lines: [{ role: "q", text: "" }, { role: "a", text: "" }],
};

const emptyStoryForm: StoryForm = {
  name: "",
  label: "",
  type: "Berita",
  palette: "from-sky-400 to-blue-500",
  image: "",
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

type CategoryForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

const emptyCategoryForm: CategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  icon: "",
};

type ProductForm = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId: string;
  stock: number;
  featured: boolean;
  productType: "physical" | "digital";
  platforms: {
    shopee?: string;
    tokopedia?: string;
    tiktokshop?: string;
    lynk?: string;
  };
};

const emptyProductForm: ProductForm = {
  id: "",
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  categoryId: "",
  stock: 0,
  featured: false,
  productType: "physical",
  platforms: {},
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("feeds");
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [roadmaps, setRoadmaps] = useState<{ slug: string; title: string; level: string; duration: string; tags: string[]; steps: unknown[] }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
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

  // Category form
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Product form
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Import JSON states
  const [showFeedImport, setShowFeedImport] = useState(false);
  const [showStoryImport, setShowStoryImport] = useState(false);
  const [showBookImport, setShowBookImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  // Import JSON handlers
  function handleImportFeedJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setFeedForm({
        title: json.title || "",
        category: json.category || "Berita",
        image: json.image || "",
        takeaway: json.takeaway || "",
        lines: Array.isArray(json.lines) ? json.lines : [{ role: "q", text: "" }, { role: "a", text: "" }],
        source: json.source ? { title: json.source.title || "", url: json.source.url || "" } : undefined,
      });
      setEditingFeedId(null);
      setShowFeedImport(false);
      setShowFeedForm(true);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash("❌ Format JSON tidak valid: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function handleImportStoryJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setStoryForm({
        name: json.name || "",
        label: json.label || "",
        type: json.type || "Berita",
        palette: json.palette || "from-sky-400 to-blue-500",
        image: json.image || "",
        viral: json.viral || false,
      });
      setEditingStoryId(null);
      setShowStoryImport(false);
      setShowStoryForm(true);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash("❌ Format JSON tidak valid: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function handleImportBookJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setBookForm({
        title: json.title || "",
        author: json.author || "",
        cover: json.cover || "",
        genre: json.genre || "",
        pages: json.pages || 0,
        rating: json.rating || 0,
        description: json.description || "",
        chapters: Array.isArray(json.chapters) ? json.chapters : [{
          title: "",
          lines: [{ role: "q", text: "" }, { role: "a", text: "" }],
        }],
      });
      setEditingBookId(null);
      setShowBookImport(false);
      setShowBookForm(true);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash("❌ Format JSON tidak valid: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [feedsRes, storiesRes, booksRes, roadmapsRes, productsRes, categoriesRes] = await Promise.all([
        fetch("/api/feeds"),
        fetch("/api/stories"),
        fetch("/api/books"),
        fetch("/api/roadmaps"),
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      if (feedsRes.ok) {
        const feedsData = await feedsRes.json();
        // Sort by createdAt descending (newest first)
        setFeeds(feedsData.sort((a: Feed, b: Feed) => b.createdAt - a.createdAt));
      }
      if (storiesRes.ok) setStories(await storiesRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
      if (roadmapsRes.ok) setRoadmaps(await roadmapsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
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
    if (!confirm("🔄 DATABASE MIGRATION\n\nIni akan:\n✅ Menghapus semua data lama\n✅ Mengisi ulang dengan data dummy\n✅ Memperbaiki timestamp konten (waktu relatif)\n✅ Reset view counts\n\nLanjutkan?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        flash(`✅ Migrasi berhasil! ${data.feedsInserted} feeds, ${data.storiesInserted} stories, ${data.booksInserted} books. Timestamp sudah diperbaiki!`);
        fetchData();
      } else {
        flash(`❌ Seed gagal: ${data.error}`);
      }
    } catch {
      flash("❌ Seed gagal: network error");
    }
    setSeeding(false);
  }

  // ──── FEED CRUD ────
  function openFeedCreate() {
    setFeedForm(emptyFeedForm);
    setEditingFeedId(null);
    setShowFeedForm(true);
  }

  function openFeedEdit(feed: Feed) {
    // This function is no longer used - forms moved to separate pages
    // Kept for backwards compatibility but should be removed
    setFeedForm({
      title: feed.title,
      category: feed.category,
      image: feed.image,
      takeaway: feed.takeaway,
      lines: [...feed.lines],
      source: feed.source ? { ...feed.source } : undefined,
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
      image: story.image || "",
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
            <p className="mt-1 text-sm text-slate-400">Kelola feeds, stories, buku, dan roadmap Narzza Media Digital</p>
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

        {/* Flash message */}
        {message ? (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {message}
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTab("feeds")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "feeds"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📰 Feeds ({feeds.length})
          </button>
          <button
            onClick={() => setTab("stories")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "stories"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💬 Stories ({stories.length})
          </button>
          <button
            onClick={() => setTab("books")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "books"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📚 Buku ({books.length})
          </button>
          <button
            onClick={() => setTab("roadmaps")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "roadmaps"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🧭 Roadmaps ({roadmaps.length})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "products"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🛒 Produk ({products.length})
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
              tab === "categories"
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏷️ Kategori ({categories.length})
          </button>
          <Link
            href="/admin/analytics"
            className="rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition flex items-center"
          >
            📊 Analytics
          </Link>
        </div>

        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">Memuat data...</div>
        ) : (
          <>
            {/* ──── FEEDS TAB ──── */}
            {tab === "feeds" ? (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Feed</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/admin/feed/new"
                      className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-cyan-500"
                    >
                      + Tambah Feed
                    </Link>
                  </div>
                </div>

                {/* JSON Import Box */}
                {showFeedImport && (
                  <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-cyan-200">Paste JSON Feed</h3>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='{"title": "...", "category": "Berita", "time": "...", "popularity": 50, "image": "...", "takeaway": "...", "source": {"title": "Kompas.com", "url": "https://..."}, "lines": [...]}'
                      className="mb-3 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400/60"
                      rows={8}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleImportFeedJSON}
                        className="rounded-lg bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        Import ke Form
                      </button>
                      <button
                        onClick={() => {
                          setShowFeedImport(false);
                          setJsonInput("");
                        }}
                        className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

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
                      
                      {/* Source */}
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-slate-400">Sumber (Opsional)</label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={feedForm.source?.title || ""}
                            onChange={(e) => setFeedForm((p) => ({ ...p, source: { title: e.target.value, url: p.source?.url || "" } }))}
                            placeholder="Nama sumber (contoh: Kompas.com)"
                            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                          />
                          <input
                            value={feedForm.source?.url || ""}
                            onChange={(e) => setFeedForm((p) => ({ ...p, source: { title: p.source?.title || "", url: e.target.value } }))}
                            placeholder="URL sumber (contoh: https://...)"
                            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                          />
                        </div>
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
                            <div className="mt-2 pl-[42px]">
                              <ImageUpload
                                label="Gambar (opsional)"
                                buttonText={line.image ? "Ganti Image" : "Tambahkan Image"}
                                currentImageUrl={line.image || undefined}
                                onUploadComplete={(url) => updateLine(i, "image", url)}
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
                        <p className="truncate text-xs text-slate-400">
                          <RelativeTime timestamp={feed.createdAt} /> · {feed.lines.length} lines
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/admin/feed/${feed.id}`}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </Link>
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
                      Belum ada feed. Klik tombol <strong className="text-amber-300">🔄 Migrate DB</strong> di atas untuk mengisi data awal dengan timestamp yang benar, atau tambah manual.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ──── STORIES TAB ──── */}
            {tab === "stories" ? (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Story</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowStoryImport(!showStoryImport)}
                      className="rounded-lg sm:rounded-xl border border-cyan-600/50 bg-cyan-600/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-200 transition hover:bg-cyan-600/30"
                    >
                      📋 Paste JSON
                    </button>
                    <button
                      onClick={openStoryCreate}
                      className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-cyan-500"
                    >
                      + Tambah Story
                    </button>
                  </div>
                </div>

                {/* JSON Import Box */}
                {showStoryImport && (
                  <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-cyan-200">Paste JSON Story</h3>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='{"name": "...", "label": "...", "type": "Berita", "palette": "from-sky-400 to-blue-500", "image": "https://...", "viral": false}'
                      className="mb-3 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400/60"
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleImportStoryJSON}
                        className="rounded-lg bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        Import ke Form
                      </button>
                      <button
                        onClick={() => {
                          setShowStoryImport(false);
                          setJsonInput("");
                        }}
                        className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

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
                      <div className="sm:col-span-2 space-y-2">
                        <ImageUpload
                          currentImageUrl={storyForm.image}
                          onUploadComplete={(url) => setStoryForm((p) => ({ ...p, image: url }))}
                          label="Cover Image"
                          buttonText="Upload Gambar"
                        />
                        <div>
                          <label className="mb-1 block text-xs text-slate-400">Atau masukkan URL manual</label>
                          <input
                            value={storyForm.image}
                            onChange={(e) => setStoryForm((p) => ({ ...p, image: e.target.value }))}
                            placeholder="https://picsum.photos/seed/ai-corner/400/400"
                            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                          />
                        </div>
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
                          className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${story.palette} text-xs font-bold text-white ring-1 ring-white/10`}
                          style={story.image ? { backgroundImage: `url(${story.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                        >
                          <span className="rounded-full bg-slate-900/60 px-1.5 py-0.5 text-[10px] font-bold">
                            {story.label}
                          </span>
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
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Buku</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/admin/book/new"
                      className="rounded-lg sm:rounded-xl bg-amber-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-amber-500"
                    >
                      + Tambah Buku
                    </Link>
                  </div>
                </div>

                {/* JSON Import Box */}
                {showBookImport && (
                  <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-cyan-200">Paste JSON Buku</h3>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='{"title": "...", "author": "...", "cover": "...", "genre": "...", "pages": 0, "rating": 0, "description": "...", "chapters": [...]}'
                      className="mb-3 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400/60"
                      rows={8}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleImportBookJSON}
                        className="rounded-lg bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                      >
                        Import ke Form
                      </button>
                      <button
                        onClick={() => {
                          setShowBookImport(false);
                          setJsonInput("");
                        }}
                        className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

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
                                  <div className="mt-2 pl-[34px]">
                                    <ImageUpload
                                      label="Gambar (opsional)"
                                      buttonText={line.image ? "Ganti Image" : "Tambahkan Image"}
                                      currentImageUrl={line.image || undefined}
                                      onUploadComplete={(url) => updateChapterLine(ci, li, "image", url)}
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
                        <Link
                          href={`/admin/book/${book.id}`}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </Link>
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

            {/* ──── ROADMAPS TAB ──── */}
            {tab === "roadmaps" ? (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Roadmap</h2>
                  <Link
                    href="/admin/roadmaps"
                    className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    + Tambah Roadmap
                  </Link>
                </div>

                <div className="space-y-3">
                  {roadmaps.map((roadmap) => (
                    <div
                      key={roadmap.slug}
                      className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 hover:border-cyan-400/30"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="shrink-0 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                            {roadmap.level}
                          </span>
                          <span className="text-xs text-slate-500">{roadmap.duration}</span>
                          <span className="text-xs text-slate-500">{roadmap.steps.length} langkah</span>
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">{roadmap.title}</p>
                        <p className="truncate text-xs text-slate-400">
                          {roadmap.tags.join(", ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/admin/roadmaps?edit=${roadmap.slug}`}
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/roadmap/${roadmap.slug}`}
                          target="_blank"
                          className="rounded-lg bg-cyan-700/40 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-600/50"
                        >
                          Lihat
                        </Link>
                      </div>
                    </div>
                  ))}
                  {roadmaps.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada roadmap. Klik &quot;Tambah Roadmap&quot; untuk membuat roadmap pertama.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ──── PRODUCTS TAB ──── */}
            {tab === "products" ? (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Produk</h2>
                  <Link
                    href="/admin/products"
                    className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    🛒 Kelola Produk
                  </Link>
                </div>

                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 hover:border-cyan-400/30"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {product.images[0] && (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/60">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="shrink-0 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                              {product.category}
                            </span>
                            <span className="text-xs text-slate-500">Stok: {product.stock}</span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs font-semibold text-cyan-400">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href="/admin/products"
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          ✏️ Edit
                        </Link>
                        <Link
                          href={`/toko/${product.id}`}
                          target="_blank"
                          className="rounded-lg bg-cyan-700/40 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-600/50"
                        >
                          👁️ Lihat
                        </Link>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada produk. Klik &quot;🛒 Kelola Produk&quot; untuk membuat produk pertama.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ──── CATEGORIES TAB ──── */}
            {tab === "categories" ? (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold">Daftar Kategori</h2>
                  <Link
                    href="/admin/categories"
                    className="rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-cyan-500"
                  >
                    🏷️ Kelola Kategori
                  </Link>
                </div>

                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 hover:border-cyan-400/30"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-900/60 text-2xl">
                          {category.icon || "🏷️"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{category.name}</p>
                          <p className="text-xs text-slate-500">/{category.slug}</p>
                          {category.description && (
                            <p className="mt-1 text-xs text-slate-400 line-clamp-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href="/admin/categories"
                          className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600"
                        >
                          ✏️ Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 ? (
                    <div className="glass-panel rounded-xl p-6 text-center text-sm text-slate-400">
                      Belum ada kategori. Klik &quot;🏷️ Kelola Kategori&quot; untuk membuat kategori pertama.
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
