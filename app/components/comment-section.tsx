"use client";

import { useState, useEffect, useCallback } from "react";

export type Comment = {
  id: string;
  feedId: number;
  author: string;
  text: string;
  createdAt: number;
};

type CommentSectionProps = {
  /** ID artikel — wajib agar komentar disimpan dan dimuat dari database */
  feedId: number;
};

function formatTime(createdAt: number): string {
  const now = Date.now();
  const diff = Math.floor((now - createdAt) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return Math.floor(diff / 86400) + " hari yang lalu";
}

export function CommentSection({ feedId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/comments?feedId=" + encodeURIComponent(String(feedId)));
      if (!res.ok) throw new Error("Gagal memuat komentar");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Komentar tidak dapat dimuat.");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [feedId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAuthor = author.trim();
    const trimmedText = text.trim();
    if (!trimmedAuthor || !trimmedText) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedId,
          author: trimmedAuthor,
          text: trimmedText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error ?? data?.details?.formErrors?.[0] ?? "Gagal mengirim komentar";
        throw new Error(msg);
      }

      setComments((prev) => [{ ...data }, ...prev]);
      setAuthor("");
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengirim komentar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">
        Komentar ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="glass-panel mb-4 rounded-2xl p-5">
        {error ? (
          <div className="mb-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {error}
          </div>
        ) : null}
        <div className="mb-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nama Anda"
            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/50"
            maxLength={50}
            disabled={submitting}
          />
        </div>
        <div className="mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis komentar Anda..."
            rows={3}
            className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/50"
            maxLength={500}
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:opacity-50"
          disabled={!author.trim() || !text.trim() || submitting}
        >
          {submitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-slate-400">
          Memuat komentar...
        </div>
      ) : comments.length === 0 ? (
        <div className="glass-panel rounded-2xl p-5 text-center text-sm text-slate-400">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-panel rounded-2xl p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {comment.author}
                </span>
                <span className="text-xs text-slate-400">
                  {formatTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
