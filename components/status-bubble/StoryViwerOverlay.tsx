import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/data/content";
import { StoryContent } from "@/hooks/useStoryViwer";
// Sesuaikan path

type StoryViewerOverlayProps = {
  selectedStory: Story;
  popularFeeds: StoryContent[];
  currentIndex: number;
  activeFeed: StoryContent;
  prevFeed: StoryContent | null;
  nextFeed: StoryContent | null;
  viewerCover?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function StoryViewerOverlay({
  selectedStory,
  popularFeeds,
  currentIndex,
  activeFeed,
  prevFeed,
  nextFeed,
  viewerCover,
  onClose,
  onNext,
  onPrev,
}: StoryViewerOverlayProps) {
  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center">
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="pointer-events-none relative z-10 flex w-full max-w-230 items-center justify-center gap-5 px-4">
        {/* Tombol Sebelumnya (Desktop) */}
        {prevFeed ? (
          <button
            type="button"
            onClick={onPrev}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border border-slate-700/55 bg-slate-900/70 p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 hover:border-slate-500/70 xl:block"
          >
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Sebelumnya
            </p>
            <p className="mt-2 overflow-hidden text-sm font-semibold leading-snug text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
              {prevFeed.title}
            </p>
          </button>
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}

        {/* Modal Utama */}
        <article className="pointer-events-auto relative h-[82vh] max-h-180 w-full max-w-100 overflow-hidden rounded-[28px] border border-slate-500/50 bg-[#07162f] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_92%_0%,rgba(217,70,239,0.18),transparent_40%)]" />

          <div className="relative z-10 flex h-full flex-col p-5">
            {/* Progress Bars */}
            <div className="mb-3 flex gap-1.5">
              {popularFeeds.map((feed, index) => (
                <span
                  key={feed.id}
                  className={`h-0.75 flex-1 rounded-full transition-colors duration-300 ${
                    index <= currentIndex ? "bg-white" : "bg-slate-600/50"
                  }`}
                />
              ))}
            </div>

            {/* Header Modal */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Status Populer
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {selectedStory.name} • {selectedStory.type}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-500/50 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-200 transition hover:border-cyan-300/60 hover:bg-slate-700/60"
                onClick={onClose}
              >
                Tutup
              </button>
            </div>

            {/* Konten Utama */}
            <div className="no-scrollbar flex-1 overflow-y-auto rounded-2xl border border-slate-600/30 bg-slate-950/50 p-5">
              {viewerCover && (
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/45 bg-slate-900/60">
                  <Image
                    src={viewerCover}
                    alt={`Status ${selectedStory.name}`}
                    width={720}
                    height={400}
                    className="h-44 w-full object-cover"
                    priority
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                  #{currentIndex + 1} Populer
                </span>
                <span className="text-xs font-medium text-cyan-300">
                  Score {activeFeed.popularity}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-50">
                {activeFeed.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {activeFeed.lines[0]?.text}
              </p>

              <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-400/8 px-3 py-2.5 text-xs leading-relaxed text-amber-100">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
                  Ringkasan
                </span>
                {activeFeed.takeaway}
              </div>
            </div>

            {/* Navigasi Bawah */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="rounded-full border border-slate-500/50 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-300 hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Prev
              </button>
              <Link
                href={activeFeed.detailHref}
                className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-5 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-500/35 hover:border-cyan-300/70"
                onClick={onClose}
              >
                {activeFeed.kind === "book" ? "Lihat Buku" : "Baca Artikel"}
              </Link>
              <button
                type="button"
                onClick={onNext}
                disabled={currentIndex === popularFeeds.length - 1}
                className="rounded-full border border-slate-500/50 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-300 hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </article>

        {/* Tombol Selanjutnya (Desktop) */}
        {nextFeed ? (
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border border-slate-700/55 bg-slate-900/70 p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 hover:border-slate-500/70 xl:block"
          >
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Selanjutnya
            </p>
            <p className="mt-2 overflow-hidden text-sm font-semibold leading-snug text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
              {nextFeed.title}
            </p>
          </button>
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}
      </div>
    </div>
  );
}
