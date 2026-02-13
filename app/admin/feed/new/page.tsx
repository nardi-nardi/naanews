"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChatLine, Story } from "@/app/data/content";
import { ImageUpload } from "@/app/components/image-upload";

type FeedForm = {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
  takeaway: string;
  lines: ChatLine[];
  source?: { title: string; url: string };
  storyId?: number | null;
};

const emptyForm: FeedForm = {
  title: "",
  category: "Berita",
  image: "",
  takeaway: "",
  lines: [{ role: "q", text: "" }, { role: "a", text: "" }],
  storyId: null,
};

export default function NewFeedPage() {
  const router = useRouter();
  const [form, setForm] = useState<FeedForm>(emptyForm);
  const [stories, setStories] = useState<Story[]>([]);
  const [message, setMessage] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data: Story[]) => setStories(data))
      .catch(() => setStories([]));
  }, []);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleImportJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setForm({
        title: json.title || "",
        category: json.category || "Berita",
        image: json.image || "",
        takeaway: json.takeaway || "",
        lines: Array.isArray(json.lines) ? json.lines : [{ role: "q", text: "" }, { role: "a", text: "" }],
        source: json.source ? { title: json.source.title || "", url: json.source.url || "" } : undefined,
        storyId: json.storyId ?? null,
      });
      setShowImport(false);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash("❌ Format JSON tidak valid: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function addLine() {
    setForm((p) => ({ ...p, lines: [...p.lines, { role: "q", text: "" }] }));
  }

  function removeLine(index: number) {
    setForm((p) => ({ ...p, lines: p.lines.filter((_, i) => i !== index) }));
  }

  function updateLine(index: number, field: keyof ChatLine, value: string) {
    setForm((p) => ({
      ...p,
      lines: p.lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    }));
  }

  async function saveFeed() {
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      flash("✅ Feed berhasil dibuat");
      setTimeout(() => router.push("/admin"), 1000);
    } catch {
      flash("❌ Gagal menyimpan feed");
    }
  }

  return (
    <div className="min-h-screen bg-canvas px-3 py-6 text-slate-100 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-50">Buat Feed Baru</h1>
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
          <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5">
            <h3 className="mb-3 text-sm font-semibold text-cyan-200">Paste JSON Feed</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"title": "...", "category": "Berita", "image": "...", "takeaway": "...", "source": {"title": "Kompas.com", "url": "https://..."}, "lines": [...]}'
              className="mb-3 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400/60"
              rows={8}
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportJSON}
                className="rounded-lg bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
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
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as any }))}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
              >
                <option value="Berita">Berita</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Riset">Riset</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Assign ke Story (opsional)</label>
              <select
                value={form.storyId ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    storyId: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
              >
                <option value="">— Tidak di-assign —</option>
                {stories.map((story) => (
                  <option key={story.id} value={story.id}>
                    {story.name} ({story.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                currentImageUrl={form.image}
                onUploadComplete={(url) => setForm((p) => ({ ...p, image: url }))}
                label="Cover Image"
                buttonText="Upload Gambar"
              />
              <div className="mt-2">
                <label className="mb-1 block text-xs text-slate-400">Atau masukkan URL manual</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://picsum.photos/seed/your-seed/800/400"
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Takeaway</label>
              <textarea
                value={form.takeaway}
                onChange={(e) => setForm((p) => ({ ...p, takeaway: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
              />
            </div>
            
            {/* Source */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Sumber (Opsional)</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.source?.title || ""}
                  onChange={(e) => setForm((p) => ({ ...p, source: { title: e.target.value, url: p.source?.url || "" } }))}
                  placeholder="Nama sumber (contoh: Kompas.com)"
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                />
                <input
                  value={form.source?.url || ""}
                  onChange={(e) => setForm((p) => ({ ...p, source: { title: p.source?.title || "", url: e.target.value } }))}
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
              {form.lines.map((line, i) => (
                <div key={i} className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-2.5">
                  <div className="flex items-start gap-2">
                    <select
                      value={line.role}
                      onChange={(e) => updateLine(i, "role", e.target.value as "q" | "a")}
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
