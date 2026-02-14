"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/app/(frontend)/roadmap/roadmaps";
import { ImageUpload } from "@/app/(frontend)/components/image-upload";

const emptyForm: Roadmap = {
  slug: "",
  title: "",
  summary: "",
  duration: "",
  level: "Pemula",
  tags: [],
  image: "",
  steps: [],
};

const emptyStep: RoadmapStep = {
  title: "",
  description: "",
  focus: "",
  videos: [],
};

const emptyVideo: RoadmapVideo = {
  id: "",
  author: "",
};

function RoadmapAdminContent() {
  const searchParams = useSearchParams();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Roadmap>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    return !!form.title || !!form.summary || form.tags.length > 0 || form.steps.length > 0 || !!form.image;
  }, [form]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/roadmaps", { cache: "no-store" });
      const data = await res.json();
      setRoadmaps(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Load roadmap for editing from URL param
  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (editSlug && roadmaps.length > 0) {
      const roadmapToEdit = roadmaps.find((r) => r.slug === editSlug);
      if (roadmapToEdit) {
        setEditingSlug(roadmapToEdit.slug);
        setForm({ ...roadmapToEdit });
      }
    }
  }, [searchParams, roadmaps]);

  function resetForm() {
    setForm(emptyForm);
    setEditingSlug(null);
    setError(null);
    setMessage(null);
  }

  function startEdit(item: Roadmap) {
    setEditingSlug(item.slug);
    setForm({ ...item });
    setMessage(null);
    setError(null);
  }

  function addStep() {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...emptyStep }],
    }));
  }

  function removeStep(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }

  function updateStep(index: number, field: keyof RoadmapStep, value: string) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  }

  function addVideo(stepIndex: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? { ...step, videos: [...step.videos, { ...emptyVideo }] }
          : step
      ),
    }));
  }

  function removeVideo(stepIndex: number, videoIndex: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? { ...step, videos: step.videos.filter((_, vi) => vi !== videoIndex) }
          : step
      ),
    }));
  }

  function updateVideo(stepIndex: number, videoIndex: number, field: keyof RoadmapVideo, value: string) {
    // Extract video ID from YouTube URL if needed
    let finalValue = value;
    if (field === "id" && value.includes("youtube.com") || value.includes("youtu.be")) {
      const urlPatterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      ];
      for (const pattern of urlPatterns) {
        const match = value.match(pattern);
        if (match && match[1]) {
          finalValue = match[1];
          break;
        }
      }
    }
    
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              videos: step.videos.map((video, vi) =>
                vi === videoIndex ? { ...video, [field]: finalValue } : video
              ),
            }
          : step
      ),
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        tags: Array.isArray(form.tags)
          ? form.tags
          : typeof form.tags === "string"
            ? (form.tags as unknown as string).split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        steps: form.steps,
      };

      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug ? `/api/roadmaps/${editingSlug}` : "/api/roadmaps";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal menyimpan");
      }

      await loadData();
      setMessage(editingSlug ? "Berhasil diperbarui" : "Berhasil ditambahkan");
      resetForm();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Hapus roadmap ini?")) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/roadmaps/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal menghapus");
      }
      await loadData();
      if (editingSlug === slug) resetForm();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-canvas min-h-screen px-4 py-6 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="mb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
            ← Kembali ke Admin
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Admin</p>
          <h1 className="text-2xl font-bold text-slate-50">Roadmaps</h1>
          <p className="text-sm text-slate-400">CRUD sederhana, data tersimpan di MongoDB yang sudah terhubung.</p>
        </div>

        <section className="glass-panel rounded-2xl p-4 ring-1 ring-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">{editingSlug ? "Edit Roadmap" : "Tambah Roadmap"}</h2>
              {editingSlug && (
                <button
                  type="button"
                  className="text-sm text-amber-200 hover:text-amber-100"
                  onClick={resetForm}
                >
                  + Baru
                </button>
              )}
            </div>

            <div className="mt-3 space-y-3 text-sm text-slate-200">
              <label className="block">
                <span className="text-xs text-slate-400">Title</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                  value={form.title}
                  onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
                  placeholder="Judul"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Slug (opsional, auto dari title)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                  value={form.slug}
                  onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))}
                  placeholder="react-specialist"
                  disabled={!!editingSlug}
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Ringkasan</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-slate-400">Level</span>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                    value={form.level}
                    onChange={(e) => setForm((v) => ({ ...v, level: e.target.value as Roadmap["level"] }))}
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400">Durasi</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                    value={form.duration}
                    onChange={(e) => setForm((v) => ({ ...v, duration: e.target.value }))}
                    placeholder="4-6 minggu"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-slate-400">Tags (pisahkan koma)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                  onChange={(e) => {
                    const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                    setForm((v) => ({ ...v, tags }));
                  }}
                  placeholder="React, Hooks, State"
                />
              </label>

              <div className="block">
                <span className="text-xs text-slate-400">Image (hero)</span>
                <div className="mt-1">
                  <ImageUpload
                    currentImageUrl={form.image}
                    onUploadComplete={(url) => setForm((v) => ({ ...v, image: url }))}
                    label=""
                    buttonText="Upload Gambar"
                  />
                </div>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                  value={form.image}
                  onChange={(e) => setForm((v) => ({ ...v, image: e.target.value }))}
                  placeholder="Atau masukkan URL manual: https://..."
                />
              </div>

              <div className="space-y-4 rounded-xl border border-slate-700/60 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-100">Langkah-langkah (Steps)</h3>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    onClick={addStep}
                  >
                    + Tambah Step
                  </button>
                </div>

                {form.steps.length === 0 && (
                  <p className="text-xs text-slate-400">Belum ada langkah. Klik tombol di atas untuk menambah.</p>
                )}

                {form.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="space-y-3 rounded-lg border border-slate-700/50 bg-slate-900/60 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-cyan-200">Step {stepIndex + 1}</h4>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-200 hover:border-rose-400"
                        onClick={() => removeStep(stepIndex)}
                      >
                        Hapus Step
                      </button>
                    </div>

                    <label className="block">
                      <span className="text-xs text-slate-400">Judul Step</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                        value={step.title}
                        onChange={(e) => updateStep(stepIndex, "title", e.target.value)}
                        placeholder="Component Patterns & Hooks"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-slate-400">Deskripsi</span>
                      <textarea
                        className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                        rows={2}
                        value={step.description}
                        onChange={(e) => updateStep(stepIndex, "description", e.target.value)}
                        placeholder="Dalami props, composition, custom hooks..."
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-slate-400">Focus (label singkat)</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
                        value={step.focus}
                        onChange={(e) => updateStep(stepIndex, "focus", e.target.value)}
                        placeholder="Komposisi komponen"
                      />
                    </label>

                    <div className="space-y-2 rounded-lg border border-slate-600/40 bg-slate-800/40 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Video YouTube</span>
                        <button
                          type="button"
                          className="rounded-lg bg-cyan-600/70 px-2 py-1 text-xs text-white hover:bg-cyan-500"
                          onClick={() => addVideo(stepIndex)}
                        >
                          + Video
                        </button>
                      </div>

                      {step.videos.length === 0 && (
                        <p className="text-xs text-slate-500">Belum ada video.</p>
                      )}

                      {step.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-300/70"
                            value={video.id}
                            onChange={(e) => updateVideo(stepIndex, videoIndex, "id", e.target.value)}
                            placeholder="URL YouTube atau Video ID"
                          />
                          <input
                            className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/60 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-300/70"
                            value={video.author}
                            onChange={(e) => updateVideo(stepIndex, videoIndex, "author", e.target.value)}
                            placeholder="Nama author"
                          />
                          <button
                            type="button"
                            className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-200 hover:border-rose-400"
                            onClick={() => removeVideo(stepIndex, videoIndex)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-rose-300">{error}</p>}
              {message && <p className="text-sm text-emerald-300">{message}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                  onClick={handleSave}
                  disabled={saving || (!editingSlug && !hasChanges)}
                >
                  {saving ? "Menyimpan..." : editingSlug ? "Simpan perubahan" : "Tambah"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:border-cyan-300/70"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>
      </div>
    </div>
  );
}

export default function RoadmapAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading...</div>}>
      <RoadmapAdminContent />
    </Suspense>
  );
}
