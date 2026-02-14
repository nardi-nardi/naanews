import { Suspense } from "react";
import { FeedPage } from "@/app/(frontend)/components/feed-page";
// Import semua dari centralized data layer
import { getFeeds, getStories, getBooks, getRoadmaps, getProducts } from "@/app/(frontend)/lib/data";

// Revalidate data setiap 5 menit (ISR)
export const revalidate = 300;

export default async function HomePage() {
  // 🚀 Parallel Fetching langsung ke Database
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds(),
    getStories(),
    getBooks(),
    getRoadmaps(), 
    getProducts(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <FeedPage
        activePath="/"
        badge="Narzza Media Digital"
        title="Berita, tutorial, dan eksperimen dalam format chat"
        description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
        showStories={true}
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}