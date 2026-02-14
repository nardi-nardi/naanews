"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="bg-canvas flex min-h-screen items-center justify-center px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="glass-panel rounded-3xl p-8 md:p-12">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-red-600/20 ring-1 ring-rose-500/30">
              <svg
                className="h-16 w-16 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="mb-3 text-2xl font-bold text-slate-50 md:text-3xl">
            Oops! Terjadi Kesalahan
          </h1>

          {/* Error Message */}
          <p className="mb-6 text-slate-400">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi kami jika masalah berlanjut.
          </p>

          {/* Error Details (dev mode only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-left">
              <p className="mb-1 text-xs font-semibold text-rose-300">Error Details (Dev Mode):</p>
              <p className="text-xs font-mono text-rose-200">{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs text-slate-400">Digest: {error.digest}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              🔄 Coba Lagi
            </button>
            <Link
              href="/"
              className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
            >
              ← Kembali ke Beranda
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 border-t border-slate-700/60 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Butuh Bantuan?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/tentang"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                📧 Hubungi Kami
              </Link>
              <Link
                href="/"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                🏠 Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
