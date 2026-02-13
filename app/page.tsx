import { FeedPage } from "@/app/components/feed-page";

export default function HomePage() {
  return (
    <FeedPage
      activePath="/"
      badge="NAA Newsroom"
      title="Berita, tutorial, dan eksperimen dalam format chat"
      description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
      showStories
    />
  );
}
