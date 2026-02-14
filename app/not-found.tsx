import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-canvas flex min-h-screen items-center justify-center px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="glass-panel rounded-3xl p-8 md:p-12">
          {/* 404 Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-cyan-500/30">
              <svg
                className="h-16 w-16 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="mb-3 text-6xl font-bold text-cyan-300 md:text-7xl">
            404
          </h1>

          {/* Error Message */}
          <h2 className="mb-2 text-2xl font-bold text-slate-50">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mb-8 text-slate-400">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              ← Kembali ke Beranda
            </Link>
            <Link
              href="/search"
              className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
            >
              🔍 Cari Konten
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-8 border-t border-slate-700/60 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Link Populer
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/berita"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                📰 Berita
              </Link>
              <Link
                href="/tutorial"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                🎓 Tutorial
              </Link>
              <Link
                href="/buku"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                📚 Buku
              </Link>
              <Link
                href="/toko"
                className="rounded-full bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700/60 hover:text-cyan-300"
              >
                🛍️ Toko
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
