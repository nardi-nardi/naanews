"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BookChapter, ChatLine } from "@/app/data/content";

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

const emptyForm: BookForm = {
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

export default function NewBookPage() {
  const router = useRouter();
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [showImport, setShowImport] = useState(false);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleImportJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setForm({
        title: json.title || "",
        author: json.author || "",
        cover: json.cover || "",
        genre: json.genre || "",
        pages: json.pages || 0,
        rating: json.rating || 0,
        description: json.description || "",
        chapters: Array.isArray(json.chapters) && json.chapters.length > 0
          ? json.chapters
          : [{ title: "", lines: [{ role: "q", text: "" }, { role: "a", text: "" }] }],
      });
      setShowImport(false);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash("❌ Format JSON tidak valid: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function addChapter() {
    setForm((p) => ({
      ...p,
      chapters: [...p.chapters, { title: "", lines: [{ role: "q", text: "" }, { role: "a", text: "" }] }],
    }));
  }

  function removeChapter(index: number) {
    setForm((p) => ({ ...p, chapters: p.chapters.filter((_, i) => i !== index) }));
  }

  function updateChapterTitle(index: number, title: string) {
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((ch, i) => (i === index ? { ...ch, title } : ch)),
    }));
  }

  function addChapterLine(chapterIndex: number) {
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, lines: [...ch.lines, { role: "q", text: "" }] } : ch
      ),
    }));
  }

  function removeChapterLine(chapterIndex: number, lineIndex: number) {
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, lines: ch.lines.filter((_, li) => li !== lineIndex) } : ch
      ),
    }));
  }

  function updateChapterLine(chapterIndex: number, lineIndex: number, field: keyof ChatLine, value: string) {
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((ch, i) =>
        i === chapterIndex
          ? { ...ch, lines: ch.lines.map((line, li) => (li === lineIndex ? { ...line, [field]: value } : line)) }
          : ch
      ),
    }));
  }

  async function saveBook() {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      flash("✅ Buku berhasil dibuat");
      setTimeout(() => router.push("/admin"), 1000);
    } catch {
      flash("❌ Gagal menyimpan buku");
    }
  }

  return (
    <div className="min-h-screen bg-canvas px-3 py-6 text-slate-100 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-50">Buat Buku Baru</h1>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
          >
            ← Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-slate-800/60 px-4 py-2 text-sm text-cyan-300">
            {message}
          </div>
        )}

        {/* Import JSON */}
        <div className="mb-4">
          <button
            onClick={() => setShowImport(!showImport)}
            className="rounded-lg bg-slate-700/60 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600/60"
          >
            {showImport ? "Tutup" : "Import dari JSON"}
          </button>
        </div>

        {showImport && (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5">
            <h3 className="mb-3 text-sm font-semibold text-amber-200">Paste JSON Book</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"title": "...", "author": "...", "cover": "...", "genre": "...", "pages": 100, "rating": 5, "description": "...", "chapters": [...]}'
              className="mb-3 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-amber-400/60"
              rows={8}
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportJSON}
                className="rounded-lg bg-amber-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
              >
                Import ke Form
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setJsonInput("");
                }}
                className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Author</label>
              <input
                value={form.author}
                onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Genre</label>
              <input
                value={form.genre}
                onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Pages</label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => setForm((p) => ({ ...p, pages: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Cover URL</label>
              <input
                value={form.cover}
                onChange={(e) => setForm((p) => ({ ...p, cover: e.target.value }))}
                placeholder="https://picsum.photos/seed/book/400/600"
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          {/* Chapters */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Chapters</h3>
              <button
                onClick={addChapter}
                className="rounded-lg bg-slate-700/60 px-3 py-1 text-xs text-slate-300 hover:bg-slate-600/60"
              >
                + Tambah Chapter
              </button>
            </div>

            <div className="space-y-4">
              {form.chapters.map((chapter, chIdx) => (
                <div key={chIdx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <input
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(chIdx, e.target.value)}
                      placeholder={`Chapter ${chIdx + 1} title...`}
                      className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm font-semibold outline-none focus:border-amber-400/60"
                    />
                    <button
                      onClick={() => removeChapter(chIdx)}
                      className="shrink-0 rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-300 hover:bg-red-800/50"
                    >
                      Hapus Chapter
                    </button>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs text-slate-400">Q&A Lines</label>
                    <button
                      onClick={() => addChapterLine(chIdx)}
                      className="rounded-lg bg-slate-700/60 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600/60"
                    >
                      + Line
                    </button>
                  </div>

                  <div className="space-y-2">
                    {chapter.lines.map((line, lineIdx) => (
                      <div key={lineIdx} className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-2">
                        <div className="flex items-start gap-2">
                          <select
                            value={line.role}
                            onChange={(e) => updateChapterLine(chIdx, lineIdx, "role", e.target.value)}
                            className="shrink-0 rounded-lg border border-slate-600/50 bg-slate-800/60 px-2 py-1.5 text-xs outline-none"
                          >
                            <option value="q">Q</option>
                            <option value="a">A</option>
                          </select>
                          <input
                            value={line.text}
                            onChange={(e) => updateChapterLine(chIdx, lineIdx, "text", e.target.value)}
                            placeholder={line.role === "q" ? "Pertanyaan..." : "Jawaban..."}
                            className="min-w-0 flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-2 py-1.5 text-sm outline-none focus:border-amber-400/60"
                          />
                          <button
                            onClick={() => removeChapterLine(chIdx, lineIdx)}
                            className="shrink-0 rounded-lg bg-red-900/40 px-2 py-1.5 text-xs text-red-300 hover:bg-red-800/50"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2 pl-[38px]">
                          <span className="text-[10px] text-slate-500">🖼️</span>
                          <input
                            value={line.image ?? ""}
                            onChange={(e) => updateChapterLine(chIdx, lineIdx, "image", e.target.value)}
                            placeholder="Image URL (opsional)"
                            className="min-w-0 flex-1 rounded-md border border-slate-700/40 bg-slate-800/40 px-2 py-1 text-xs text-slate-300 outline-none placeholder:text-slate-600 focus:border-amber-400/40"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={saveBook}
              className="rounded-xl bg-amber-600/80 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Simpan
            </button>
            <Link
              href="/admin"
              className="rounded-xl border border-slate-600/50 px-5 py-2 text-sm text-slate-300 hover:border-slate-500"
            >
              Batal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
