import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import type { FeedCategory } from "@/types/content";

type ReadArticleHeaderProps = {
  title: string;
  category: FeedCategory;
};

function getCategoryStyles(category: FeedCategory): string {
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

export function ReadArticleHeader({ title, category }: ReadArticleHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <Link
        href="/"
        className="rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50"
      >
        Kembali ke Beranda
      </Link>
      <div className="flex items-center gap-2">
        <ShareButton title={title} />
        <span
          className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${getCategoryStyles(category)}`}
        >
          {category}
        </span>
      </div>
    </div>
  );
}
