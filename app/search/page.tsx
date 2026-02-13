import { FeedTitleCard } from "@/app/components/feed-title-card";
import { GlobalSearchForm } from "@/app/components/global-search-form";
import { BookCard } from "@/app/components/book-card";
import { SiteShell } from "@/app/components/site-shell";
import { getFeeds, getBooks } from "@/app/lib/data";

export const revalidate = 300;

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();

  let feedResults: Awaited<ReturnType<typeof getFeeds>> = [];
  let bookResults: Awaited<ReturnType<typeof getBooks>> = [];

  if (query) {
    const normalized = query.toLowerCase();
    const tokens = normalized.split(/\s+/).filter(Boolean);

    const [allFeeds, allBooks] = await Promise.all([getFeeds(), getBooks()]);

    feedResults = allFeeds.filter((feed) => {
      const haystack = [feed.title, feed.category, feed.takeaway, ...feed.lines.map((l) => l.text)]
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });

    bookResults = allBooks.filter((book) => {
      const haystack = [book.title, book.description, book.author]
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
  }

  return (
    <SiteShell activePath="/search">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Search</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">Hasil Pencarian Global</h1>
        <p className="mt-2 text-sm text-slate-300">
          {query ? `Kata kunci: "${query}"` : "Masukkan kata kunci untuk mencari semua konten."}
        </p>
      </section>

      <div className="mt-4">
        <GlobalSearchForm defaultQuery={query} />
      </div>

      <section className="mt-5 grid gap-4">
        {!query ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Contoh: ai lokal, cache layer, prompt bertahap
          </div>
        ) : null}

        {query && feedResults.length === 0 && bookResults.length === 0 ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Tidak ada hasil untuk kata kunci tersebut.
          </div>
        ) : null}

        {feedResults.map((feed, index) => (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        ))}
      </section>

      {bookResults.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">📚 Buku</h2>
          <div className="grid gap-4">
            {bookResults.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
