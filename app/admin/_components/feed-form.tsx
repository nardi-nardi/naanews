"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Feed,
  FeedForm as FeedFormType,
  emptyFeedForm,
} from "@/app/admin/_types";

type FeedCategory = "Berita" | "Tutorial" | "Riset";

interface Props {
  initialData?: Feed | null;
  onSave: (form: FeedFormType) => Promise<void>;
  onCancel: () => void;
}

export function FeedForm({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = useState<FeedFormType>(
    initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          image: initialData.image,
          takeaway: initialData.takeaway,
          lines: [...initialData.lines],
          source: initialData.source ? { ...initialData.source } : undefined,
        }
      : emptyFeedForm
  );

  const addLine = () =>
    setForm((p) => ({
      ...p,
      lines: [...p.lines, { role: "q", text: "", image: "" }],
    }));
  const removeLine = (i: number) =>
    setForm((p) => ({ ...p, lines: p.lines.filter((_, idx) => idx !== i) }));
  const updateLine = (i: number, f: "role" | "text" | "image", v: string) =>
    setForm((p) => ({
      ...p,
      lines: p.lines.map((l, idx) => (idx === i ? { ...l, [f]: v } : l)),
    }));

  return (
    <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
      <h3 className="mb-4 text-base font-semibold">
        {initialData ? "Edit Feed" : "Feed Baru"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
        />
        <select
          title="s"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as FeedCategory })
          }
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
        >
          <option value="Berita">Berita</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Riset">Riset</option>
        </select>
        <div className="sm:col-span-2">
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="Image URL"
            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <div className="sm:col-span-2">
          <textarea
            value={form.takeaway}
            onChange={(e) => setForm({ ...form, takeaway: e.target.value })}
            placeholder="Takeaway"
            rows={2}
            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-slate-400">Chat Lines (Q&A)</label>
          <button
            onClick={addLine}
            className="rounded-lg bg-slate-700/60 px-3 py-1 text-xs hover:bg-slate-600/60"
          >
            + Tambah Line
          </button>
        </div>
        <div className="space-y-3">
          {form.lines.map((line, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-3"
            >
              <div className="flex gap-2 items-start">
                <select
                  id={`line-role-${i}`}
                  title="Role"
                  value={line.role}
                  onChange={(e) =>
                    updateLine(i, "role", e.target.value as FeedCategory)
                  }
                  className="bg-slate-800 text-xs p-2 rounded outline-none border border-slate-600/50"
                >
                  <option value="q">Q</option>
                  <option value="a">A</option>
                </select>
                <input
                  value={line.text}
                  onChange={(e) => updateLine(i, "text", e.target.value)}
                  placeholder="Teks..."
                  className="flex-1 bg-slate-800 text-sm p-2 rounded outline-none border border-slate-600/50"
                />
                <button
                  onClick={() => removeLine(i)}
                  className="bg-red-900/40 text-red-300 p-2 rounded text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 pl-12">
                <ImageUpload
                  currentImageUrl={line.image}
                  onUploadComplete={(url) => updateLine(i, "image", url)}
                  buttonText="Set Image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="rounded-xl bg-cyan-600/80 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Simpan
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-600/50 px-6 py-2 text-sm text-slate-300 hover:border-slate-500"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
