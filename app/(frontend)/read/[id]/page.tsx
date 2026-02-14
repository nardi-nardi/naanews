import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatImage } from "@/app/(frontend)/components/chat-image";
import { ShareButton } from "@/app/(frontend)/components/share-button";
import { getFeedIds, getFeeds } from "@/app/(frontend)/lib/data";
import { RelativeTime } from "@/app/(frontend)/components/relative-time";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getFeedIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const feedId = Number(id);

  if (Number.isNaN(feedId)) {
    return { title: "Konten tidak ditemukan | Narzza Media Digital" };
  }

  const feeds = await getFeeds();
  const feed = feeds.find((item) => item.id === feedId);

  if (!feed) {
    return { title: "Konten tidak ditemukan | Narzza Media Digital" };
  }

  return {
    title: `${feed.title} | Narzza Media Digital`,
    description: feed.takeaway,
    openGraph: {
      title: feed.title,
      description: feed.takeaway,
      images: [feed.image],
      type: "article",
    },
    alternates: { canonical: `/read/${feed.id}` },
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const feedId = Number(id);

  if (Number.isNaN(feedId)) {
    notFound();
  }

  const allFeeds = await getFeeds();
  const feed = allFeeds.find((item) => item.id === feedId) ?? null;
  if (!feed) {
    notFound();
  }

  const similarFeeds = allFeeds
    .filter((item) => item.category === feed.category && item.id !== feed.id)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  const categoryStyles =
    feed.category === "Berita"
      ? "border-sky-300 bg-sky-200 text-sky-900"
      : feed.category === "Tutorial"
        ? "border-cyan-300 bg-cyan-200 text-cyan-900"
        : "border-fuchsia-300 bg-fuchsia-200 text-fuchsia-900";

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50"
          >
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton title={feed.title} />
            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${categoryStyles}`}
            >
              {feed.category}
            </span>
          </div>
        </div>

        <article className="glass-panel overflow-hidden rounded-3xl">
          <div className="relative h-56 w-full md:h-72">
            <Image
              src={feed.image}
              alt={feed.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
          </div>

          <div className="p-5 md:p-7">
          <header className="mb-5 border-b border-slate-700/70 pb-5">
            <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">{feed.title}</h1>
            <p className="mt-2 text-sm text-slate-400">
              <RelativeTime timestamp={feed.createdAt} />
            </p>
          </header>

          <div className="flex flex-col gap-3">
            {feed.lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={`flex ${line.role === "q" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-100 md:max-w-[86%] ${
                    line.role === "q" ? "chat-bubble-left" : "chat-bubble-right"
                  }`}
                >
                  <span className="mr-1 text-[11px] font-semibold text-slate-300">
                    {line.role === "q" ? "Q:" : "A:"}
                  </span>
                  {line.text}
                  {line.image ? <ChatImage src={line.image} /> : null}
                </div>
              </div>
            ))}
          </div>

          {feed.source ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3">
              <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-xs text-slate-400">Sumber:</span>
              <a
                href={feed.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-300 underline decoration-cyan-300/30 underline-offset-2 transition hover:text-cyan-200 hover:decoration-cyan-200/50"
              >
                {feed.source.title}
              </a>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            <strong>Inti cepat:</strong> {feed.takeaway}
          </div>
          </div>
        </article>

        {similarFeeds.length > 0 ? (
          <section className="mt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Konten {feed.category} Lainnya
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {similarFeeds.map((item) => (
                <Link
                  key={item.id}
                  href={`/read/${item.id}`}
                  className="glass-panel group block overflow-hidden rounded-2xl transition hover:border-cyan-300/50"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <span
                      className={`mb-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                        item.category === "Berita"
                          ? "border-sky-300 bg-sky-200 text-sky-900"
                          : item.category === "Tutorial"
                            ? "border-cyan-300 bg-cyan-200 text-cyan-900"
                            : "border-fuchsia-300 bg-fuchsia-200 text-fuchsia-900"
                      }`}
                    >
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-slate-50 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400">
                      <RelativeTime timestamp={item.createdAt} />
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
                      {item.lines[0]?.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
