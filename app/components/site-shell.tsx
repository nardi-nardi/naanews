"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, tags } from "@/app/data/content";

type SiteShellProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset" | "/buku" | "/analytics" | "/search";
  children: React.ReactNode;
};

export function SiteShell({ activePath, children }: SiteShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  return (
    <div className="bg-canvas min-h-screen pb-6 pt-20 text-slate-100 xl:pt-0">
      <div className="mx-auto flex w-full max-w-[1500px] gap-4 px-3 py-4 md:px-5 md:py-6">
        <aside className="hidden w-72 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
            <section className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Navigasi</h2>
              <div className="mt-3 space-y-2">
                {navItems.map((item) => {
                  const isActive = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-pill block w-full rounded-xl px-3 py-2 text-left transition hover:border-cyan-300/50 hover:bg-cyan-500/10 ${
                        isActive
                          ? "border-cyan-400/70 bg-cyan-500/15 ring-1 ring-cyan-400/30"
                          : ""
                      }`}
                    >
                      <p className={`text-sm font-medium ${isActive ? "text-cyan-200" : "text-slate-100"}`}>{item.title}</p>
                      <p className={`text-xs ${isActive ? "text-cyan-300/70" : "text-slate-400"}`}>{item.note}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Quick Access</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200">#berita</span>
                <span className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200">#tutorial</span>
                <span className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200">#riset</span>
              </div>
            </section>
            <Link
              href="/admin"
              className="glass-panel block rounded-2xl p-4 text-center text-sm font-medium text-amber-300 transition hover:border-amber-400/50"
            >
              🛠️ Admin Panel
            </Link>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-3xl">
          {children}
        </main>

        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
            <div className="glass-panel rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-200">Google Ads Slot</p>
              <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
                300 x 250
                <br />
                Sidebar Right
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-200">Sponsored</p>
              <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
                Native Promo Block
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Trending Keywords</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <header className="glass-panel fixed inset-x-3 top-3 z-30 rounded-2xl px-4 py-3 xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-slate-100">NAA Newsroom</p>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Buka navigasi"
            className="rounded-lg border border-slate-500/60 bg-slate-900/45 px-2.5 py-2"
          >
            <span className="block h-[2px] w-4 bg-slate-100" />
            <span className="mt-1 block h-[2px] w-4 bg-slate-100" />
            <span className="mt-1 block h-[2px] w-4 bg-slate-100" />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 xl:hidden ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Tutup navigasi"
          className={`absolute inset-0 bg-black/65 transition-opacity ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        <aside
          className={`glass-panel absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-slate-600/50 p-4 transition-transform duration-200 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-100">Navigasi</p>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-lg border border-slate-500/60 px-2 py-1 text-xs text-slate-200"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`nav-pill block rounded-xl px-3 py-2 transition hover:border-cyan-300/50 hover:bg-cyan-500/10 ${
                    isActive
                      ? "border-cyan-400/70 bg-cyan-500/15 ring-1 ring-cyan-400/30"
                      : ""
                  }`}
                >
                  <p className={`text-sm font-medium ${isActive ? "text-cyan-200" : "text-slate-100"}`}>{item.title}</p>
                  <p className={`text-xs ${isActive ? "text-cyan-300/70" : "text-slate-400"}`}>{item.note}</p>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
