import Image from "next/image";
import Link from "next/link";
import { RelativeTime } from "@/app/components/relative-time";
import type { Feed } from "@/app/types/content";
import type { FeedCategory } from "@/app/types/content";

type SimilarFeedsSectionProps = {
  feeds: Feed[];
  category: FeedCategory;
};

function getCategoryBadgeClass(category: FeedCategory): string {
  switch (category) {
    case "Berita":
      return "border-sky-300 bg-sky-200 text-sky-900";
    case "Tutorial":
      return "border-cyan-300 bg-cyan-200 text-cyan-900";
    case "Riset":
      return "border-fuchsia-300 bg-fuchsia-200 text-fuchsia-900";
    default:
      return "border-slate-300 bg-slate-200 text-slate-900";
  }
}

export function SimilarFeedsSection({ feeds, category }: SimilarFeedsSectionProps) {
  if (feeds.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">
        Konten {category} Lainnya
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {feeds.map((item) => (
          <Link
            key={item.id}
            href={"/read/" + item.id}
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
                className={`mb-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm ${getCategoryBadgeClass(item.category)}`}
              >
                {item.category}
              </span>
              <h3 className="text-sm font-semibold leading-snug text-slate-50">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400">
                <RelativeTime timestamp={item.createdAt} />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
