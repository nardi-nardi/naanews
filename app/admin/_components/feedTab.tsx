"use client";
import { useState } from "react";
import { RelativeTime } from "@/components/relative-time";
import type { Feed } from "@/data/content";
import { FeedForm } from "./feed-form";
import { useAdminTab } from "@/hooks/useAdminTab";
import { JsonImportModal } from "@/components/JsonImportModal";

const FEED_SCHEMA = `[
  {
    "title": "Judul Feed",
    "category": "Berita",
    "image": "https://...",
    "takeaway": "Ringkasan singkat",
    "lines": [
      { "role": "q", "text": "Pertanyaan..." },
      { "role": "a", "text": "Jawaban..." }
    ],
    "source": { "title": "Nama Sumber", "url": "https://..." }
  }
]`;

export function FeedTab({ feeds, onRefresh, onDelete, flash }: any) {
  const { editingItem: editingFeed, showForm, handleSave, startEdit, startCreate, cancelForm } =
    useAdminTab<Feed>("/api/feeds", "✅ Feed Tersimpan!", flash, onRefresh);
  const [showJsonModal, setShowJsonModal] = useState(false);

  async function handleJsonImport(items: unknown[]) {
    let failCount = 0;
    for (const item of items) {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) failCount++;
    }
    if (failCount > 0) return `${failCount} dari ${items.length} feed gagal disimpan.`;
    flash(`✅ ${items.length} Feed berhasil diimport!`);
    onRefresh();
    return null;
  }

  return (
    <div>
      {showJsonModal && (
        <JsonImportModal
          title="Feed"
          schemaHint={FEED_SCHEMA}
          onImport={handleJsonImport}
          onClose={() => setShowJsonModal(false)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Feed</h2>
        {!showForm && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowJsonModal(true)}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600"
            >
              + Tambah JSON
            </button>
            <button
              onClick={startCreate}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold"
            >
              + Tambah Feed
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <FeedForm
          initialData={editingFeed}
          onSave={handleSave}
          onCancel={cancelForm}
        />
      )}

      <div className="space-y-3">
        {feeds.map((feed: Feed) => (
          <div
            key={feed.id}
            className="glass-panel flex items-center justify-between p-4 rounded-xl"
          >
            <div>
              <p className="text-sm font-medium">{feed.title}</p>
              <p className="text-xs text-slate-400">
                <RelativeTime timestamp={feed.createdAt} /> •{" "}
                {feed.lines.length} lines
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(feed)}
                className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(feed.id)}
                className="text-xs bg-red-900/40 px-3 py-1.5 rounded-lg text-red-300"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
