import { useState, useMemo, useEffect } from "react";
import type { Book, ChatLine, Feed, Story } from "@/data/content";

export type StoryContent = {
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

type UseStoryViewerProps = {
  stories: Story[];
  feeds: Feed[];
  books: Book[];
};

export function useStoryViewer({ stories, feeds, books }: UseStoryViewerProps) {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Mapping Cover Image
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

  const selectedStory =
    stories.find((story) => story.id === selectedStoryId) || null;

  // 2. Generate Popular Feeds
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
          {
            role: "a",
            text: b.chapters[0]?.lines[0]?.text || "Lihat detail buku",
          },
        ],
        takeaway: `${b.genre} • ${b.pages} halaman • ★ ${b.rating}`,
        detailHref: `/buku/${b.id}`,
      }));

    return [...assignedFeeds, ...assignedBooks]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  }, [selectedStory, feeds, books]);

  // 3. Setup Index & Navigasi
  const currentIndex = popularFeeds.length
    ? Math.min(activeIndex, popularFeeds.length - 1)
    : 0;
  const activeFeed = popularFeeds[currentIndex];
  const prevFeed = currentIndex > 0 ? popularFeeds[currentIndex - 1] : null;
  const nextFeed =
    currentIndex < popularFeeds.length - 1
      ? popularFeeds[currentIndex + 1]
      : null;

  // 4. Setup Cover Fallback
  const storyCoverFallback = useMemo(() => {
    if (!selectedStory) return undefined;
    const direct = storyCoverMap.get(selectedStory.id);
    if (direct) return direct;
    return popularFeeds[0]?.image;
  }, [popularFeeds, selectedStory, storyCoverMap]);

  const viewerCover = activeFeed?.image || storyCoverFallback;

  // 5. Actions
  function openStory(storyId: number) {
    setSelectedStoryId(storyId);
    setActiveIndex(0);
  }

  function closeStoryViewer() {
    setSelectedStoryId(null);
    setActiveIndex(0);
  }

  function goNext() {
    if (!popularFeeds.length) return;
    setActiveIndex((current) => Math.min(current + 1, popularFeeds.length - 1));
  }

  function goPrev() {
    if (!popularFeeds.length) return;
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  // 6. Keyboard Effect & Body Scroll Lock
  useEffect(() => {
    if (!selectedStory) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeStoryViewer();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedStory, popularFeeds.length]);

  return {
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
  };
}
