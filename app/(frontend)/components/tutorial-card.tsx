import Image from "next/image";
import Link from "next/link";
import type { Feed } from "@/app/(frontend)/data/content";
import { RelativeTime } from "@/app/(frontend)/components/relative-time";

type TutorialCardProps = {
  feed: Feed;
  index: number;
};

export function TutorialCard({ feed, index }: TutorialCardProps) {
  const stepCount = feed.lines.filter((l) => l.role === "q").length;

  return (
    <Link
      href={`/read/${feed.id}`}
      className="tutorial-card group block w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-900/80 via-[#0d1b3a]/80 to-slate-900/80 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_32px_-8px_rgba(34,211,238,0.15)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-row">
        {/* Thumbnail */}
        <div className="relative h-36 w-28 shrink-0 overflow-hidden sm:h-auto sm:w-48 md:w-56">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 112px, 224px"
          />

          {/* Step badge on image */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">{stepCount} langkah</span>
            <span className="inline sm:hidden">{stepCount}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
          <div>
            {/* Top row: badge + time */}
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 ring-1 ring-cyan-500/25 sm:text-[11px]">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 15.96v-4.5l.256.11a2.995 2.995 0 002.487 0l5.527-2.369v3.408c0 .753-.306 1.473-.85 1.997A6.028 6.028 0 0110 16.5a6.028 6.028 0 01-4.3-1.782A2.81 2.81 0 015 12.72V11.5l-.69.297A2 2 0 003 13.63v.87a1 1 0 001.757.656A7.97 7.97 0 009.3 16.573z" />
                </svg>
                <span className="hidden sm:inline">Tutorial</span>
                <span className="inline sm:hidden">📚</span>
              </span>
              <span className="text-[11px] text-slate-500">•</span>
              <span className="text-[10px] text-slate-400 sm:text-[11px]">
                <RelativeTime timestamp={feed.createdAt} />
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-sm font-bold leading-snug text-slate-50 transition-colors group-hover:text-cyan-200 sm:mb-3 sm:text-base md:text-lg">
              {feed.title}
            </h3>

            {/* Preview Q&A - Only on desktop */}
            <div className="mt-3 hidden space-y-2 sm:block">
              <div className="flex items-start gap-2 text-[13px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300">Q</span>
                <p className="line-clamp-1 text-slate-400">{feed.lines[0]?.text}</p>
              </div>
              {feed.lines[1] ? (
                <div className="flex items-start gap-2 text-[13px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">A</span>
                  <p className="line-clamp-2 text-slate-300">{feed.lines[1].text}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2 sm:mt-4 sm:pt-3">
            <div className="hidden items-center gap-3 sm:flex">
              {/* Step indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(stepCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-cyan-400/60 transition-all group-hover:bg-cyan-400"
                    style={{ width: i === 0 ? 16 : 8 }}
                  />
                ))}
                {stepCount > 5 ? (
                  <span className="ml-1 text-[10px] text-slate-500">+{stepCount - 5}</span>
                ) : null}
              </div>
            </div>

            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200 sm:gap-1.5">
              <span className="hidden sm:inline">Mulai belajar</span>
              <span className="inline sm:hidden">Mulai</span>
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
