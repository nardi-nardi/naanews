import { Suspense } from "react";
import { FeedPage } from "@/app/components/feed-page";
import { getFeeds, getStories, getBooks } from "@/app/lib/data";

async function getInternalData(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function RisetPage() {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds("Riset"),
    getStories(),
    getBooks(),
    getInternalData("roadmaps"),
    getInternalData("products"),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <FeedPage
        activePath="/riset"
        badge="RISET"
        title="Riset & Eksperimen"
        description="Analisa mendalam dan eksperimen koding."
        category="Riset"
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
