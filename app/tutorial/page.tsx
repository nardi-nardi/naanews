import { SiteShell } from "@/app/components/site-shell";
import { TutorialCard } from "@/app/components/tutorial-card";
import { getFeeds } from "@/app/lib/data";

export const revalidate = 300;

export default async function TutorialPage() {
  const tutorialFeeds = await getFeeds("Tutorial");
  return (
    <SiteShell activePath="/tutorial">
      {/* Header */}
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/25">
            <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Kategori</p>
            <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">Tutorial Praktis</h1>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-sm text-slate-300">
          Panduan step-by-step supaya pembaca bisa langsung praktik.
        </p>

        {/* Stats bar */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-700/50 pt-4 text-[12px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            {tutorialFeeds.length} tutorial
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Format Q&A Interaktif
          </span>
        </div>
      </section>

      {/* Tutorial Cards */}
      <section className="mt-5 grid gap-4">
        {tutorialFeeds.map((feed, index) => (
          <TutorialCard key={feed.id} feed={feed} index={index} />
        ))}
        {!tutorialFeeds.length ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Belum ada tutorial tersedia.
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
