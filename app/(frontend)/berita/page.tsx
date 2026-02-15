import { Suspense } from "react";
import { FeedPage } from "@/app/components/feed-page";
import { getFeeds, getStories, getBooks } from "@/app/lib/data";

// Helper fetch data (sama seperti di Home)
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

export default async function BeritaPage() {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds(), // Bisa dioptimalkan: getFeeds("Berita") jika API mendukung filter di DB
    getStories(),
    getBooks(),
    getInternalData("roadmaps"),
    getInternalData("products"),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <FeedPage
        activePath="/berita"
        badge="BERITA"
        title="Berita Teknologi"
        description="Update teknologi terkini dan tren industri."
        category="Berita" // Filter otomatis di FeedPage
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
