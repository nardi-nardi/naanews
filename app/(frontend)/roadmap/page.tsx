// FILE: app/(frontend)/roadmap/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// 👇 Import data dari pu
import { getRoadmaps } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Roadmap Belajar",
  description:
    "Koleksi roadmap belajar: frontend dasar, React lanjutan, hingga fullstack Next.js.",
};

export default async function RoadmapListPage() {
  const roadmaps = await getRoadmaps();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="glass-panel rounded-3xl p-6 shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Learning Roadmaps
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-50">
          Pilih jalur belajar yang sesuai
        </h1>
        <p className="mt-3 text-slate-300">
          Tiap kartu berisi urutan langkah, video embed resmi YouTube, dan fokus
          kompetensi. Klik untuk lihat detail lengkap.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1">
            Semua video via YouTube embed
          </span>
          <span className="rounded-full border border-slate-600/60 bg-slate-900/40 px-3 py-1">
            Responsif mobile & desktop
          </span>
        </div>
      </header>

      {/* Grid Kartu Roadmap */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roadmaps.map((item, index) => (
          <Link
            key={item.slug}
            href={`/roadmap/${item.slug}`}
            className="feed-card glass-panel group block h-full overflow-hidden rounded-2xl ring-1 ring-white/5 transition hover:border-cyan-300/50"
            style={
              { animationDelay: `${index * 110}ms` } as React.CSSProperties
            }
          >
            <div className="relative h-36 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>

            <div className="flex h-full flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-0.5 font-semibold text-cyan-200">
                  {item.level}
                </span>
                <span className="ml-auto rounded-full border border-slate-700/60 bg-slate-900/60 px-2.5 py-0.5 text-slate-200">
                  {item.duration}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800/60 px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-slate-100">
                {item.title}
              </h2>
              <p className="text-sm text-slate-300 line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-auto flex items-center justify-between text-xs text-cyan-200">
                <span>{item.steps.length} langkah</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  Lihat detail →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
