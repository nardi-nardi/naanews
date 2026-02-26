"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import {
  StoryForm as StoryFormType,
  emptyStoryForm,
  paletteOptions,
} from "@/app/admin/_types";
import type { Story } from "@/data/content";

interface Props {
  initialData?: Story | null;
  onSave: (form: StoryFormType) => Promise<void>;
  onCancel: () => void;
}

export function StoryForm({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = useState<StoryFormType>(
    initialData ? { ...initialData } : emptyStoryForm
  );

  return (
    <div className="mb-6 rounded-2xl border border-slate-600/50 bg-slate-900/90 p-5">
      <h3 className="mb-4 text-base font-semibold">
        {initialData ? "Edit Story" : "Story Baru"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name (ex: AI Corner)"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />
        <input
          value={form.label}
          maxLength={3}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Label (ex: AI)"
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as Form })}
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        >
          <option value="Berita">Berita</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Riset">Riset</option>
        </select>

        <select
          value={form.palette}
          onChange={(e) => setForm({ ...form, palette: e.target.value })}
          className="w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm outline-none"
        >
          {paletteOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="sm:col-span-2">
          <ImageUpload
            currentImageUrl={form.image}
            onUploadComplete={(url) => setForm({ ...form, image: url })}
            label="Cover Image"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.viral}
            onChange={(e) => setForm({ ...form, viral: e.target.checked })}
            className="h-4 w-4 accent-cyan-400"
          />
          <label className="text-sm text-slate-300">Tandai Viral 🔥</label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="rounded-xl bg-cyan-600/80 px-6 py-2 text-sm font-semibold text-white"
        >
          Simpan
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
