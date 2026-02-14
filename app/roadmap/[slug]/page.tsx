import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/app/components/site-shell";
import { getDb } from "@/app/lib/mongodb";
import { roadmaps as seedRoadmaps, type Roadmap } from "@/app/roadmap/roadmaps";

export const dynamic = "force-dynamic";

async function fetchRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection("roadmaps").findOne({ slug });
      if (doc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = doc;
        return rest as Roadmap;
      }
    }
  } catch (error) {
    console.error("roadmap detail fetch error:", error);
  }

  const fallback = seedRoadmaps.find((r) => r.slug === slug);
  return fallback ?? null;
}

type RoadmapDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await fetchRoadmapBySlug(slug);
  if (!roadmap) return { title: "Roadmap tidak ditemukan" };

  return {
    title: `${roadmap.title} | Roadmap Belajar`,
    description: roadmap.summary,
  };
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmap = await fetchRoadmapBySlug(slug);
  if (!roadmap) {
    notFound();
  }

  const current = roadmap;

  return (
    <SiteShell activePath="/roadmap">
      <div className="space-y-6">
        <header className="glass-panel rounded-3xl p-6 shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Learning Roadmap</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-50">{current.title}</h1>
              <p className="mt-2 text-slate-300">{current.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200">
                {current.level}
              </span>
              <span className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1">{current.duration}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
            {current.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-800/60 px-2.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="flex justify-start">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-slate-900/50 transition hover:border-cyan-300/50 hover:text-cyan-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M11.707 4.293a1 1 0 0 1 0 1.414L7.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke daftar roadmap
          </Link>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-6 hidden h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-cyan-500/60 via-cyan-400/30 to-transparent md:block" aria-hidden />
          <ol className="space-y-4">
            {current.steps.map((step, index) => {
              const stepNumber = index + 1;
              const isLast = index === current.steps.length - 1;

              return (
                <li key={step.title} className="glass-panel overflow-hidden rounded-2xl p-5 ring-1 ring-white/5">
                  <div className="flex gap-4">
                    <div className="hidden flex-col items-center md:flex">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200 ring-1 ring-cyan-400/30">
                        {stepNumber}
                      </div>
                      {!isLast && <span className="mt-2 h-full w-px bg-gradient-to-b from-cyan-500/50 via-cyan-400/20 to-transparent" aria-hidden />}
                    </div>

                    <div className="w-full space-y-3">
                      {/* Judul topik */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-100">{step.title}</h2>
                        <span className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
                          {step.focus}
                        </span>
                      </div>

                      {/* Deskripsi singkat */}
                      <p className="text-sm text-slate-300">{step.description}</p>

                      {/* Embed video */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {step.videos.map((video, videoIndex) => (
                          <div key={`${stepNumber}-${videoIndex}`} className="space-y-2">
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
                            <p className="text-xs text-slate-400">Video oleh {video.author}</p>
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
    </SiteShell>
  );
}
