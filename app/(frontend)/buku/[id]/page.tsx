import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/app/components/share-button";
import { BookCard } from "@/app/components/book-card";
import { getBookIds, getBooks, getBookById } from "@/app/lib/data";
import { BookHero } from "@/app/components/books/book-hero";
import { ChapterView } from "@/app/components/books/chapter-view";
import { TableOfContents } from "@/app/components/books/table-of-content";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = await getBookIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(Number(id));
  if (!book) return { title: "Buku tidak ditemukan" };
  return { title: `${book.title} | Narzza Media Digital` };
}

export default async function ReadBookPage({ params }: PageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (isNaN(bookId)) notFound();

  const [book, allBooks] = await Promise.all([getBookById(bookId), getBooks()]);
  if (!book) notFound();

  const otherBooks = allBooks.filter((item) => item.id !== book.id).slice(0, 3);

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header Nav */}
        <div className="mb-4 flex flex-wrap items-center gap-3 sm:justify-between">
          <Link
            href="/buku"
            className="rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm transition hover:border-cyan-300/50"
          >
            ← Semua Buku
          </Link>
          <div className="flex items-center gap-3">
            <ShareButton title={book.title} />
            <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              {book.genre}
            </span>
          </div>
        </div>

        <BookHero book={book} />

        <TableOfContents chapters={book.chapters} />

        <div className="mt-6 space-y-6">
          {book.chapters.map((chapter, i) => (
            <ChapterView
              key={i}
              chapter={chapter}
              index={i}
              totalChapters={book.chapters.length}
            />
          ))}
        </div>

        {otherBooks.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Buku Lainnya</h2>
            <div className="grid gap-4">
              {otherBooks.map((item, i) => (
                <BookCard key={item.id} book={item} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
