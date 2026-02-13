import Image from "next/image";
import Link from "next/link";
import type { Feed } from "@/app/data/content";
import { RelativeTime } from "@/app/components/relative-time";

type FeedTitleCardProps = {
  feed: Feed;
  index: number;
};

export function FeedTitleCard({ feed, index }: FeedTitleCardProps) {
  const categoryStyles =
    feed.category === "Berita"
      ? "border-sky-300 bg-sky-200 text-sky-900"
      : feed.category === "Tutorial"
        ? "border-cyan-300 bg-cyan-200 text-cyan-900"
        : "border-fuchsia-300 bg-fuchsia-200 text-fuchsia-900";

  return (
    <Link
      href={`/read/${feed.id}`}
      className="feed-card glass-panel group block w-full overflow-hidden rounded-3xl"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      <div className="relative h-44 w-full overflow-hidden md:h-52">
        <Image
          src={feed.image}
          alt={feed.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 700px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
        <span
          className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${categoryStyles}`}
        >
          {feed.category}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-50 md:text-xl">{feed.title}</h2>
          <p className="mt-1 text-xs text-slate-400">
            <RelativeTime timestamp={feed.createdAt} />
          </p>
        </header>

        <div className="rounded-xl border border-slate-500/35 bg-slate-900/45 px-4 py-3 text-sm text-slate-300">
          {feed.lines[0]?.text}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-700/70 pt-4">
          <p className="text-sm text-slate-300">Buka konten chat Q&A</p>
          <span className="rounded-full border border-cyan-300/35 px-3 py-1 text-xs font-semibold text-cyan-100 transition group-hover:border-cyan-200 group-hover:text-cyan-50">
            Baca artikel
          </span>
        </div>
      </div>
    </Link>
  );
}
