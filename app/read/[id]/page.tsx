import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/app/components/share-button";
import { getFeeds, getFeedById } from "@/app/lib/data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const feedId = Number(id);

  if (Number.isNaN(feedId)) {
    notFound();
  }

  const feed = await getFeedById(feedId);
  if (!feed) {
    notFound();
  }

  const allFeeds = await getFeeds();
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
            <p className="mt-2 text-sm text-slate-400">{feed.time}</p>
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
                  {line.image ? (
                    <div className="mt-2 max-w-[240px] overflow-hidden rounded-xl">
                      <Image
                        src={line.image}
                        alt=""
                        width={240}
                        height={160}
                        className="h-auto w-full rounded-xl object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

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
                    <p className="mt-1.5 text-xs text-slate-400">{item.time}</p>
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
