"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "@/app/data/content";

type MobileNavDrawerProps = {
  activePath: string;
  items: NavItem[];
};

export function MobileNavDrawer({ activePath, items }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="glass-panel fixed inset-x-3 top-3 z-30 rounded-2xl px-4 py-3 xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-slate-100">
            Narzza Media Digital
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Buka navigasi"
            className="rounded-lg border border-slate-500/60 bg-slate-900/45 px-2.5 py-2"
          >
            <span className="block h-[2px] w-4 bg-slate-100" />
            <span className="mt-1 block h-[2px] w-4 bg-slate-100" />
            <span className="mt-1 block h-[2px] w-4 bg-slate-100" />
          </button>
        </div>
      </header>

      {/* Drawer overlay + panel */}
      <div
        className={`fixed inset-0 z-40 xl:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Tutup navigasi"
          className={`absolute inset-0 bg-black/65 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        <aside
          className={`glass-panel absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-slate-600/50 p-4 transition-transform duration-200 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-100">Navigasi</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-500/60 px-2 py-1 text-xs text-slate-200"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`nav-pill block rounded-xl px-3 py-2 transition hover:border-cyan-300/50 hover:bg-cyan-500/10 ${
                    isActive
                      ? "border-cyan-400/70 bg-cyan-500/15 ring-1 ring-cyan-400/30"
                      : ""
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${isActive ? "text-cyan-200" : "text-slate-100"}`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-xs ${isActive ? "text-cyan-300/70" : "text-slate-400"}`}
                  >
                    {item.note}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
