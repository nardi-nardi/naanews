import { FeedPage } from "@/app/(frontend)/components/feed-page";

export default function BeritaPage() {
  return (
    <FeedPage
      activePath="/berita"
      badge="Kategori"
      title="Berita Teknologi"
      description="Kumpulan update terbaru, tren, dan breaking news teknologi."
      category="Berita"
    />
  );
}
