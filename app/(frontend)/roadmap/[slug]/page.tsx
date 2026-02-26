// FILE: app/(frontend)/roadmap/[slug]/page.tsx
// (Ini Halaman/UI yang akan tampil di browser)

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmaps } from "@/lib/data"; // Import dari pusat data

export const revalidate = 300;

type RoadmapDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate Slug Statis (Agar cepat)
export async function generateStaticParams() {
  const roadmaps = await getRoadmaps();
  return roadmaps.map((r) => ({ slug: r.slug }));
}

// Generate Metadata (Judul Tab Browser)
export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const roadmap = roadmaps.find((r) => r.slug === slug);

  if (!roadmap) return { title: "Roadmap tidak ditemukan" };

  return {
    title: `${roadmap.title} | Roadmap Belajar`,
    description: roadmap.summary,
  };
}

// KOMPONEN UTAMA (Wajib export default function)
export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const current = roadmaps.find((r) => r.slug === slug);

  if (!current) {
    notFound();
  }

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50"
          >
            ← Semua Roadmap
          </Link>
        </div>

        <div className="space-y-6">
          <header className="glass-panel rounded-3xl p-6 shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Learning Roadmap
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-50">
                  {current.title}
                </h1>
                <p className="mt-2 text-slate-300">{current.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200">
                  {current.level}
                </span>
                <span className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1">
                  {current.duration}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-800/60 px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="relative">
            <span
              className="pointer-events-none absolute left-5 top-6 hidden h-[calc(100%-2.5rem)] w-px bg-linear-to-b from-cyan-500/60 via-cyan-400/30 to-transparent md:block"
              aria-hidden
            />
            <ol className="space-y-4">
              {current.steps.map((step, index) => {
                const stepNumber = index + 1;
                const isLast = index === current.steps.length - 1;

                return (
                  <li
                    key={step.title}
                    className="glass-panel overflow-hidden rounded-2xl p-5 ring-1 ring-white/5"
                  >
                    <div className="flex gap-4">
                      <div className="hidden flex-col items-center md:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200 ring-1 ring-cyan-400/30">
                          {stepNumber}
                        </div>
                        {!isLast && (
                          <span
                            className="mt-2 h-full w-px bg-linear-to-b from-cyan-500/50 via-cyan-400/20 to-transparent"
                            aria-hidden
                          />
                        )}
                      </div>

                      <div className="w-full space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-lg font-semibold text-slate-100">
                            {step.title}
                          </h2>
                          <span className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
                            {step.focus}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">
                          {step.description}
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          {step.videos.map((video, videoIndex) => (
                            <div
                              key={`${stepNumber}-${videoIndex}`}
                              className="space-y-2"
                            >
                              <div className="aspect-video overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/60 shadow-inner shadow-cyan-500/10">
                                <iframe
                                  src={`https://www.youtube.com/embed/${video.id}`}
                                  title={`YouTube video ${video.id}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  loading="lazy"
                                  className="h-full w-full"
                                />
                              </div>
                              <p className="text-xs text-slate-400">
                                Video oleh {video.author}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
