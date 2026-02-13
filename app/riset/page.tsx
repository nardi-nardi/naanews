import { FeedPage } from "@/app/components/feed-page";
import { getFeeds } from "@/app/lib/data";

export const revalidate = 300;

export default async function RisetPage() {
  const risetFeeds = await getFeeds("Riset");

  return (
    <FeedPage
      activePath="/riset"
      badge="Kategori"
      title="Hasil Riset & Eksperimen"
      description="Eksperimen internal tim dan insight yang bisa dipakai untuk keputusan produk."
      feeds={risetFeeds}
    />
  );
}
