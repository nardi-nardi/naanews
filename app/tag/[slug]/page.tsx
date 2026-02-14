import type { Metadata } from "next";
import { FeedTitleCard } from "@/app/components/feed-title-card";
import { SiteShell } from "@/app/components/site-shell";
import { tags } from "@/app/data/content";
import { getFeeds } from "@/app/lib/data";

export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.replace(/^#/, "") }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = `#${slug}`;
  return {
    title: `${tag} | Narzza Media Digital`,
    description: `Semua konten bertag ${tag} di Narzza Media Digital.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = `#${slug}`;
  const allFeeds = await getFeeds();

  const keyword = slug.toLowerCase().replace(/-/g, " ");
  const filtered = allFeeds.filter((feed) => {
    const haystack = [feed.title, feed.category, feed.takeaway, ...feed.lines.map((l) => l.text)]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });

  return (
    <SiteShell activePath="/">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Tag</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">{tag}</h1>
        <p className="mt-2 text-sm text-slate-300">
          {filtered.length} konten ditemukan dengan tag ini.
        </p>
      </section>

      <section className="mt-5 grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((feed, index) => (
            <FeedTitleCard key={feed.id} feed={feed} index={index} />
          ))
        ) : (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">
            Belum ada konten untuk tag ini.
          </div>
        )}
      </section>
    </SiteShell>
  );
}
