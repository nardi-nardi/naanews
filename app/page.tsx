import { FeedPage } from "@/app/components/feed-page";
import { getBooks, getFeeds, getStories } from "@/app/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [feeds, storiesData, booksData] = await Promise.all([getFeeds(), getStories(), getBooks()]);

  return (
    <FeedPage
      activePath="/"
      badge="NAA Newsroom"
      title="Berita, tutorial, dan eksperimen dalam format chat"
      description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
      feeds={feeds}
      showStories
      storiesData={storiesData}
      booksData={booksData}
    />
  );
}
