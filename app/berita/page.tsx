import { FeedPage } from "@/app/components/feed-page";
import { getFeeds } from "@/app/lib/data";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const beritaFeeds = await getFeeds("Berita");

  return (
    <FeedPage
      activePath="/berita"
      badge="Kategori"
      title="Berita Teknologi"
      description="Kumpulan update terbaru, tren, dan breaking news teknologi."
      feeds={beritaFeeds}
    />
  );
}
