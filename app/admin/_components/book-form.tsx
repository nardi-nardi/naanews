"use client";
import { useState } from "react";
import { ImageUpload } from "@/app/components/image-upload";
import { BookForm as BookFormType, emptyBookForm } from "@/app/admin/_types";
import type { Book } from "@/app/data/content";

interface Props {
  initialData?: Book | null;
  onSave: (form: BookFormType) => Promise<void>;
  onCancel: () => void;
}

export function BookForm({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = useState<BookFormType>(
    initialData ? JSON.parse(JSON.stringify(initialData)) : emptyBookForm
  );

  // Chapter Helpers
  const addChapter = () =>
    setForm((p) => ({
      ...p,
      chapters: [...p.chapters, { title: "", lines: [] }],
    }));
  const removeChapter = (i: number) =>
    setForm((p) => ({
      ...p,
      chapters: p.chapters.filter((_, idx) => idx !== i),
    }));
  const updateChTitle = (i: number, v: string) =>
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((c, idx) =>
        idx === i ? { ...c, title: v } : c
      ),
    }));

  // Line Helpers inside Chapter
  const addLine = (cIdx: number) =>
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((c, i) =>
        i === cIdx
          ? { ...c, lines: [...c.lines, { role: "q", text: "", image: "" }] }
          : c
      ),
    }));
  const removeLine = (cIdx: number, lIdx: number) =>
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((c, i) =>
        i === cIdx
          ? { ...c, lines: c.lines.filter((_, idx) => idx !== lIdx) }
          : c
      ),
    }));
  const updateLine = (
    cIdx: number,
    lIdx: number,
    f: "role" | "text" | "image",
    v: string
  ) =>
    setForm((p) => ({
      ...p,
      chapters: p.chapters.map((c, i) =>
        i === cIdx
          ? {
              ...c,
              lines: c.lines.map((l, idx) =>
                idx === lIdx ? { ...l, [f]: v } : l
              ),
            }
          : c
      ),
    }));

  return (
    <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
      <h3 className="mb-4 text-base font-semibold">
        {initialData ? "Edit Buku" : "Buku Baru"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Judul Buku"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Penulis"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
        <input
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          placeholder="Genre"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
        <input
          value={form.cover}
          onChange={(e) => setForm({ ...form, cover: e.target.value })}
          placeholder="URL Cover Image"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={form.pages}
            onChange={(e) =>
              setForm({ ...form, pages: Number(e.target.value) })
            }
            placeholder="Halaman"
            className="w-1/2 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            step="0.1"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
            placeholder="Rating"
            className="w-1/2 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Deskripsi Singkat"
          className="w-full sm:col-span-2 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Chapters Section */}
      <div className="mt-8 border-t border-slate-700/50 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-slate-300">Bab / Chapters</h4>
          <button
            onClick={addChapter}
            className="bg-slate-700/60 px-3 py-1 text-xs rounded-lg hover:bg-slate-600/60"
          >
            + Tambah Bab
          </button>
        </div>

        <div className="space-y-4">
          {form.chapters.map((ch, ci) => (
            <div
              key={ci}
              className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl"
            >
              <div className="flex gap-2 mb-3">
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-bold shrink-0">
                  Bab {ci + 1}
                </span>
                <input
                  value={ch.title}
                  onChange={(e) => updateChTitle(ci, e.target.value)}
                  placeholder="Judul Bab..."
                  className="flex-1 bg-slate-800 text-sm px-2 rounded border border-slate-600/50 outline-none"
                />
                <button
                  onClick={() => removeChapter(ci)}
                  className="bg-red-900/40 text-red-300 px-2 text-xs rounded"
                >
                  Hapus Bab
                </button>
              </div>

              <div className="ml-4 pl-4 border-l border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] text-slate-400">Lines Q&A</span>
                  <button
                    onClick={() => addLine(ci)}
                    className="text-[10px] bg-slate-700 px-2 rounded"
                  >
                    + Line
                  </button>
                </div>
                {ch.lines.map((line, li) => (
                  <div
                    key={li}
                    className="mb-2 bg-slate-800/40 p-2 rounded border border-slate-700/40"
                  >
                    <div className="flex gap-2 mb-2">
                      <select
                        value={line.role}
                        onChange={(e) =>
                          updateLine(ci, li, "role", e.target.value as string)
                        }
                        title="Pilih Peran (Q/A)"
                        className="bg-slate-800 text-xs rounded border border-slate-600"
                      >
                        <option value="q">Q</option>
                        <option value="a">A</option>
                      </select>
                      <input
                        value={line.text}
                        onChange={(e) =>
                          updateLine(ci, li, "text", e.target.value)
                        }
                        className="flex-1 bg-slate-800 text-xs px-2 rounded border border-slate-600"
                        placeholder="Teks..."
                      />
                      <button
                        onClick={() => removeLine(ci, li)}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="pl-10">
                      <ImageUpload
                        currentImageUrl={line.image}
                        onUploadComplete={(url) =>
                          updateLine(ci, li, "image", url)
                        }
                        buttonText="Set Image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="rounded-xl bg-cyan-600/80 px-6 py-2 text-sm font-semibold text-white"
        >
          Simpan Buku
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-600/50 px-6 py-2 text-sm text-slate-300"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
