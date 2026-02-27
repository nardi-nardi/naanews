"use client";

import { createPortal } from "react-dom";
import { StoryBubble } from "@/components/status-bubble/StoryBubble";
import { EmptyStoryOverlay } from "./EmptyStoryOverlay"; // Sesuaikan path
import type { Book, Feed, Story } from "@/data/content";
import { useStoryViewer } from "@/hooks/useStoryViwer";
import { StoryViewerOverlay } from "./StoryViwerOverlay";

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
  // Panggil semua logika dari Custom Hook
  const {
    selectedStory,
    storyCoverMap,
    popularFeeds,
    currentIndex,
    activeFeed,
    prevFeed,
    nextFeed,
    viewerCover,
    openStory,
    closeStoryViewer,
    goNext,
    goPrev,
  } = useStoryViewer({ stories, feeds, books });

  const portalTarget = typeof document === "undefined" ? null : document.body;

  // Render Portal Content
  const renderPortal = () => {
    if (!portalTarget || !selectedStory) return null;

    if (activeFeed) {
      return createPortal(
        <StoryViewerOverlay
          selectedStory={selectedStory}
          popularFeeds={popularFeeds}
          currentIndex={currentIndex}
          activeFeed={activeFeed}
          prevFeed={prevFeed}
          nextFeed={nextFeed}
          viewerCover={viewerCover}
          onClose={closeStoryViewer}
          onNext={goNext}
          onPrev={goPrev}
        />,
        portalTarget
      );
    }

    return createPortal(
      <EmptyStoryOverlay onClose={closeStoryViewer} />,
      portalTarget
    );
  };

  return (
    <>
      <div
        className={standalone ? "" : "mt-6 border-t border-slate-700/70 pt-5"}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Status Viral Hari Ini
          </h2>
          <span className="text-xs text-slate-400">klik status</span>
        </div>

        {/* Render List Story Bubble */}
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {stories.map((story) => (
            <StoryBubble
              key={story.id}
              story={story}
              coverImage={storyCoverMap.get(story.id)}
              active={selectedStory?.id === story.id}
              onClick={() => openStory(story.id)}
            />
          ))}
        </div>
      </div>

      {/* Render Modal/Overlay (Jika ada story yang dipilih) */}
      {renderPortal()}
    </>
  );
}
