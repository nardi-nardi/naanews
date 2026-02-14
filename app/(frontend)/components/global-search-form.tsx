"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";

type GlobalSearchFormProps = {
  placeholder?: string;
  defaultQuery?: string;
};

export function GlobalSearchForm({
  placeholder = "Cari topik, judul, atau kata kunci...",
  defaultQuery = "",
}: GlobalSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(value: string) {
    setQuery(value);
    
    // Jika bukan di search page dan ada input, redirect ke search
    if (pathname !== "/search" && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  }

  return (
    <div>
      <div className="glass-panel rounded-2xl p-3 md:p-4">
        <label htmlFor="global-search" className="mb-2 block text-xs uppercase tracking-[0.2em] text-cyan-300">
          Global Search
        </label>
        <input
          ref={inputRef}
          id="global-search"
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
        />
      </div>
    </div>
  );
}
