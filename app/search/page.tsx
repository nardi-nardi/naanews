import { FeedTitleCard } from "@/app/components/feed-title-card";
import { SiteShell } from "@/app/components/site-shell";
import { searchFeeds } from "@/app/data/content";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const results = searchFeeds(query);

  return (
    <SiteShell activePath="/search">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Search</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">Hasil Pencarian Global</h1>
        <p className="mt-2 text-sm text-slate-300">
          {query ? `Kata kunci: "${query}"` : "Masukkan kata kunci untuk mencari semua konten."}
        </p>
      </section>

      <section className="mt-5 grid gap-4">
        {!query ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Contoh: `ai lokal`, `cache layer`, `prompt bertahap`
          </div>
        ) : null}

        {query && !results.length ? (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Tidak ada hasil untuk kata kunci tersebut.
          </div>
        ) : null}

        {results.map((feed, index) => (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        ))}
      </section>
    </SiteShell>
  );
}
