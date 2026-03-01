"use client";
import { RelativeTime } from "@/components/relative-time";
import type { Feed } from "@/data/content";
import { FeedForm } from "./feed-form";
import { useAdminTab } from "@/hooks/useAdminTab";

export function FeedTab({ feeds, onRefresh, onDelete, flash }: any) {
  const { editingItem: editingFeed, showForm, handleSave, startEdit, startCreate, cancelForm } =
    useAdminTab<Feed>("/api/feeds", "✅ Feed Tersimpan!", flash, onRefresh);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Feed</h2>
        {!showForm && (
          <button
            onClick={startCreate}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold"
          >
            + Tambah Feed
          </button>
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
