import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/app/data/content";

type BookCardProps = {
  book: Book;
  index: number;
};

export function BookCard({ book, index }: BookCardProps) {
  return (
    <Link
      href={`/buku/${book.id}`}
      className="feed-card glass-panel group block overflow-hidden rounded-2xl transition hover:border-cyan-300/50"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-xl shadow-lg">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="128px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            <span className="inline-block rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
              {book.genre}
            </span>
            <h3 className="mt-2 text-base font-bold leading-snug text-slate-50 line-clamp-2 md:text-lg">
              {book.title}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{book.author}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2">
              {book.description}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold">{book.rating}</span>
            </div>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{book.chapters.length} bab</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{book.pages} hal</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
