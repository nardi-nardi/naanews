"use client";
import { useState } from "react";
import { RelativeTime } from "@/components/relative-time";
import type { Feed } from "@/data/content";
import { FeedForm } from "./feed-form";

export function FeedTab({ feeds, onRefresh, onDelete, flash }: any) {
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (formData: any) => {
    const res = await fetch(
      editingFeed ? `/api/feeds/${editingFeed.id}` : "/api/feeds",
      {
        method: editingFeed ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      flash("✅ Feed Tersimpan!");
      setShowForm(false);
      setEditingFeed(null);
      onRefresh();
    } else flash("❌ Gagal simpan");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Feed</h2>
        {!showForm && (
          <button
            onClick={() => {
              setEditingFeed(null);
              setShowForm(true);
            }}
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
          onCancel={() => {
            setShowForm(false);
            setEditingFeed(null);
          }}
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
                onClick={() => {
                  setEditingFeed(feed);
                  setShowForm(true);
                }}
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
