"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { StoryBubble } from "@/app/(frontend)/components/story-bubble";
import type { Book, ChatLine, Feed, Story } from "@/app/(frontend)/data/content";

type StatusViralSectionProps = {
  stories: Story[];
  feeds: Feed[];
  books?: Book[];
  standalone?: boolean;
};

export function StatusViralSection({
  stories,
  feeds,
  books = [],
  standalone = false,
}: StatusViralSectionProps) {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const storyCoverMap = useMemo(() => {
    const map = new Map<number, string>();
    stories.forEach((story) => {
      if (story.image) {
        map.set(story.id, story.image);
        return;
      }
      const assignedFeed = feeds.find((f) => f.storyId === story.id && f.image);
      if (assignedFeed) {
        map.set(story.id, assignedFeed.image);
        return;
      }
      const assignedBook = books.find((b) => b.storyId === story.id && b.cover);
      if (assignedBook) {
        map.set(story.id, assignedBook.cover);
      }
    });
    return map;
  }, [stories, feeds, books]);

  const selectedStory = stories.find((story) => story.id === selectedStoryId) || null;

  type StoryContent = {
    kind: "feed" | "book";
    id: number;
    title: string;
    category: Story["type"];
    createdAt: number;
    popularity: number;
    image: string;
    lines: ChatLine[];
    takeaway: string;
    detailHref: string;
  };

  const popularFeeds = useMemo<StoryContent[]>(() => {
    if (!selectedStory) return [];

    const assignedFeeds: StoryContent[] = feeds
      .filter((f) => f.storyId === selectedStory.id)
      .map((f) => ({
        kind: "feed",
        id: f.id,
        title: f.title,
        category: f.category,
        createdAt: f.createdAt,
        popularity: f.popularity,
        image: f.image,
        lines: f.lines,
        takeaway: f.takeaway,
        detailHref: `/read/${f.id}`,
      }));

    const assignedBooks: StoryContent[] = books
      .filter((b) => b.storyId === selectedStory.id)
      .map((b) => ({
        kind: "book",
        id: Number(`200000${b.id}`),
        title: b.title,
        category: selectedStory.type,
        createdAt: Date.now(),
        popularity: Math.round((b.rating || 0) * 20),
        image: b.cover,
        lines: [
          { role: "q", text: b.description || "Ringkasan buku" },
          { role: "a", text: b.chapters[0]?.lines[0]?.text || "Lihat detail buku" },
        ],
        takeaway: `${b.genre} • ${b.pages} halaman • ★ ${b.rating}`,
        detailHref: `/buku/${b.id}`,
      }));

    return [...assignedFeeds, ...assignedBooks]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  }, [selectedStory, feeds, books]);

  const currentIndex = popularFeeds.length
    ? Math.min(activeIndex, popularFeeds.length - 1)
    : 0;
  const activeFeed = popularFeeds[currentIndex];
  const prevFeed = currentIndex > 0 ? popularFeeds[currentIndex - 1] : null;
  const nextFeed =
    currentIndex < popularFeeds.length - 1 ? popularFeeds[currentIndex + 1] : null;
  const storyCoverFallback = useMemo(() => {
    if (!selectedStory) return undefined;
    const direct = storyCoverMap.get(selectedStory.id);
    if (direct) return direct;
    const firstAssigned = popularFeeds[0];
    return firstAssigned?.image;
  }, [popularFeeds, selectedStory, storyCoverMap]);
  const viewerCover = activeFeed?.image || storyCoverFallback;

  function openStory(storyId: number) {
    setSelectedStoryId(storyId);
    setActiveIndex(0);
  }

  function closeStoryViewer() {
    setSelectedStoryId(null);
    setActiveIndex(0);
  }

  function goNext() {
    if (!popularFeeds.length) {
      return;
    }
    setActiveIndex((current) => Math.min(current + 1, popularFeeds.length - 1));
  }

  function goPrev() {
    if (!popularFeeds.length) {
      return;
    }
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  const portalTarget = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!selectedStory) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedStoryId(null);
        setActiveIndex(0);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => Math.min(current + 1, popularFeeds.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedStory, popularFeeds.length]);

  const viewerOverlay =
    selectedStory && activeFeed ? (
      <div className="fixed inset-0 z-[140] flex items-center justify-center">
        <button
          type="button"
          aria-label="Tutup status populer"
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={closeStoryViewer}
        />

        <div className="pointer-events-none relative z-10 flex w-full max-w-[920px] items-center justify-center gap-5 px-4">
          {prevFeed ? (
            <button
              type="button"
              onClick={goPrev}
              className="pointer-events-auto hidden w-[200px] shrink-0 cursor-pointer rounded-2xl border border-slate-700/55 bg-slate-900/70 p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 hover:border-slate-500/70 xl:block"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Sebelumnya</p>
              <p className="mt-2 overflow-hidden text-sm font-semibold leading-snug text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {prevFeed.title}
              </p>
            </button>
          ) : (
            <div className="hidden w-[200px] shrink-0 xl:block" />
          )}

          <article className="pointer-events-auto relative h-[82vh] max-h-[720px] w-full max-w-[400px] overflow-hidden rounded-[28px] border border-slate-500/50 bg-[#07162f] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_92%_0%,rgba(217,70,239,0.18),transparent_40%)]" />

            <div className="relative z-10 flex h-full flex-col p-5">
              <div className="mb-3 flex gap-1.5">
                {popularFeeds.map((feed, index) => (
                  <span
                    key={feed.id}
                    className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${index <= currentIndex ? "bg-white" : "bg-slate-600/50"}`}
                  />
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Status Populer</p>
                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {selectedStory.name} • {selectedStory.type}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-500/50 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-200 transition hover:border-cyan-300/60 hover:bg-slate-700/60"
                  onClick={closeStoryViewer}
                >
                  Tutup
                </button>
              </div>

              <div className="no-scrollbar flex-1 overflow-y-auto rounded-2xl border border-slate-600/30 bg-slate-950/50 p-5">
                {viewerCover ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/45 bg-slate-900/60">
                    <Image
                      src={viewerCover}
                      alt={`Status ${selectedStory?.name ?? "Status"}`}
                      width={720}
                      height={400}
                      className="h-44 w-full object-cover"
                      priority
                    />
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                    #{currentIndex + 1} Populer
                  </span>
                  <span className="text-xs font-medium text-cyan-300">Score {activeFeed.popularity}</span>
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-50">
                  {activeFeed.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{activeFeed.lines[0]?.text}</p>

                <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-400/8 px-3 py-2.5 text-xs leading-relaxed text-amber-100">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-amber-300/80">Ringkasan</span>
                  {activeFeed.takeaway}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-slate-500/50 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-300 hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Prev
                </button>
                <Link
                  href={activeFeed.detailHref}
                  className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-5 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-500/35 hover:border-cyan-300/70"
                  onClick={closeStoryViewer}
                >
                  {activeFeed.kind === "book" ? "Lihat Buku" : "Baca Artikel"}
                </Link>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentIndex === popularFeeds.length - 1}
                  className="rounded-full border border-slate-500/50 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-300 hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            </div>
          </article>

          {nextFeed ? (
            <button
              type="button"
              onClick={goNext}
              className="pointer-events-auto hidden w-[200px] shrink-0 cursor-pointer rounded-2xl border border-slate-700/55 bg-slate-900/70 p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 hover:border-slate-500/70 xl:block"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Selanjutnya</p>
              <p className="mt-2 overflow-hidden text-sm font-semibold leading-snug text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {nextFeed.title}
              </p>
            </button>
          ) : (
            <div className="hidden w-[200px] shrink-0 xl:block" />
          )}
        </div>
      </div>
    ) : null;

  const emptyOverlay =
    selectedStory && !activeFeed ? (
      <div className="fixed inset-0 z-[140] bg-slate-950/92">
        <button
          type="button"
          aria-label="Tutup status populer"
          className="absolute inset-0"
          onClick={closeStoryViewer}
        />
        <div className="relative flex h-full items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-500/45 bg-slate-900/70 p-5 text-center">
            <p className="text-sm text-slate-200">Belum ada konten populer untuk status ini.</p>
            <button
              type="button"
              onClick={closeStoryViewer}
              className="mt-4 rounded-full border border-slate-500/70 px-4 py-1.5 text-xs text-slate-100"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className={standalone ? "" : "mt-6 border-t border-slate-700/70 pt-5"}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Status Viral Hari Ini</h2>
          <span className="text-xs text-slate-400">klik status</span>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {stories.map((story) => (
            <StoryBubble
              key={story.id}
              story={story}
              coverImage={storyCoverMap.get(story.id)}
              active={story.id === selectedStoryId}
              onClick={() => openStory(story.id)}
            />
          ))}
        </div>
      </div>

      {portalTarget ? createPortal(viewerOverlay, portalTarget) : null}
      {portalTarget ? createPortal(emptyOverlay, portalTarget) : null}
    </>
  );
}
