import Image from "next/image";
import type { Book } from "@/app/types/content";
import { StarIcon } from "./icons";

export function BookHero({ book }: { book: Book }) {
  return (
    <section className="glass-panel overflow-hidden rounded-3xl">
      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start md:p-8">
        <div className="relative h-64 w-44 shrink-0 overflow-hidden rounded-2xl shadow-2xl sm:h-72 sm:w-48">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 176px, 192px"
            priority
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">
            {book.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">oleh {book.author}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <div className="flex items-center gap-1 text-amber-300">
              <StarIcon />
              <span className="text-sm font-semibold">{book.rating}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-sm text-slate-400">{book.chapters.length} bab</span>
            <span className="text-slate-600">•</span>
            <span className="text-sm text-slate-400">{book.pages} halaman</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {book.description}
          </p>
        </div>
      </div>
    </section>
  );
}