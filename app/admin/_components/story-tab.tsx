"use client";
import { useState } from "react";
import type { Story } from "@/data/content";
import { StoryForm } from "./story-form";
import { useAdminTab } from "@/hooks/useAdminTab";
import { JsonImportModal } from "@/components/JsonImportModal";

const STORY_SCHEMA = `[
  {
    "name": "AI Corner",
    "label": "AI",
    "type": "Berita",
    "palette": "from-sky-400 to-blue-500",
    "image": "https://...",
    "viral": false
  }
]`;

export function StoryTab({ stories, onRefresh, onDelete, flash }: any) {
  const { editingItem: editingStory, showForm, handleSave, startEdit, startCreate, cancelForm } =
    useAdminTab<Story>("/api/stories", "✅ Story Tersimpan!", flash, onRefresh);
  const [showJsonModal, setShowJsonModal] = useState(false);

  async function handleJsonImport(items: unknown[]) {
    let failCount = 0;
    for (const item of items) {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) failCount++;
    }
    if (failCount > 0) return `${failCount} dari ${items.length} story gagal disimpan.`;
    flash(`✅ ${items.length} Story berhasil diimport!`);
    onRefresh();
    return null;
  }

  return (
    <div>
      {showJsonModal && (
        <JsonImportModal
          title="Story"
          schemaHint={STORY_SCHEMA}
          onImport={handleJsonImport}
          onClose={() => setShowJsonModal(false)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Story</h2>
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
              + Tambah Story
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <StoryForm
          initialData={editingStory}
          onSave={handleSave}
          onCancel={cancelForm}
        />
      )}

      <div className="space-y-3">
        {stories.map((story: Story) => (
          <div
            key={story.id}
            className="glass-panel flex items-center justify-between p-4 rounded-xl"
          >
            <div className="flex gap-3 items-center">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center ${story.palette}`}
                style={
                  story.image
                    ? {
                        backgroundImage: `url(${story.image})`,
                        backgroundSize: "cover",
                      }
                    : {}
                }
              >
                {!story.image && (
                  <span className="text-[10px] font-bold">{story.label}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{story.name}</p>
                <p className="text-xs text-slate-400">
                  {story.type} {story.viral && "• 🔥 Viral"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(story)}
                className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(story.id)}
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
