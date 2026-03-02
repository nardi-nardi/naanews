"use client";
import { useState, useRef } from "react";

interface Props {
  title: string;
  /** Schema hint shown in the placeholder textarea */
  schemaHint: string;
  /** Called with the parsed array of items; return error string if validation fails */
  onImport: (items: unknown[]) => Promise<string | null>;
  onClose: () => void;
}

/**
 * Generic JSON bulk-import modal.
 * Accepts either an array [...] or a single object {...} which is wrapped in [].
 */
export function JsonImportModal({ title, schemaHint, onImport, onClose }: Props) {
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ ok: number; fail: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleImport() {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      setError("JSON tidak valid. Periksa format (tanda kutip, koma, dll.).");
      return;
    }

    const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
    if (items.length === 0) {
      setError("Array kosong, tidak ada yang diimport.");
      return;
    }

    setLoading(true);
    const err = await onImport(items);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setDone({ ok: items.length, fail: 0 });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-600/50 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Import JSON — {title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="rounded-xl bg-emerald-900/40 border border-emerald-600/40 p-4 text-sm text-emerald-300">
            ✅ Berhasil import <strong>{done.ok}</strong> item!
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Schema hint */}
            <p className="mb-2 text-xs text-slate-400">
              Paste array JSON (bisa 1 atau banyak item). Contoh struktur:
            </p>
            <pre className="mb-3 max-h-28 overflow-auto rounded-lg bg-slate-800/70 p-3 text-[11px] text-slate-400 whitespace-pre-wrap">
              {schemaHint}
            </pre>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={10}
              placeholder='[{ ... }, { ... }]'
              className="w-full rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400 resize-y"
            />

            {error && (
              <p className="mt-2 rounded-lg bg-red-900/30 border border-red-600/40 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleImport}
                disabled={loading || !raw.trim()}
                className="rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold hover:bg-cyan-500 disabled:opacity-50"
              >
                {loading ? "Menyimpan…" : "Import"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
