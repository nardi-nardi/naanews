import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatImage } from "@/app/components/chat-image";
import { ShareButton } from "@/app/components/share-button";
import { BookCard } from "@/app/components/book-card";
import { getBookIds, getBooks } from "@/app/lib/data";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getBookIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return { title: "Buku tidak ditemukan | Narzza Media Digital" };
  }

  const books = await getBooks();
  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return { title: "Buku tidak ditemukan | Narzza Media Digital" };
  }

  return {
    title: `${book.title} | Narzza Media Digital`,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.cover],
      type: "book",
    },
    alternates: { canonical: `/buku/${book.id}` },
  };
}

export default async function ReadBookPage({ params }: PageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    notFound();
  }

  const allBooks = await getBooks();
  const book = allBooks.find((item) => item.id === bookId) ?? null;
  if (!book) {
    notFound();
  }

  const otherBooks = allBooks
    .filter((item) => item.id !== book.id)
    .slice(0, 3);

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center gap-3 sm:justify-between">
          <Link
            href="/buku"
            className="rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50"
          >
            ← Semua Buku
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ShareButton title={book.title} />
            <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 sm:px-4 sm:text-sm">
              {book.genre}
            </span>
          </div>
        </div>

        {/* Book Hero */}
        <section className="glass-panel overflow-hidden rounded-3xl">
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start md:p-8">
            <div className="relative h-64 w-44 shrink-0 overflow-hidden rounded-2xl shadow-2xl sm:h-72 sm:w-48">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
                sizes="192px"
                priority
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">{book.title}</h1>
              <p className="mt-2 text-sm text-slate-400">oleh {book.author}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <div className="flex items-center gap-1 text-amber-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">{book.rating}</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-sm text-slate-400">{book.chapters.length} bab</span>
                <span className="text-slate-600">•</span>
                <span className="text-sm text-slate-400">{book.pages} halaman</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">{book.description}</p>
            </div>
          </div>
        </section>

        {/* Daftar Isi - Table of Contents */}
        <section className="glass-panel mt-6 rounded-3xl p-5 md:p-7">
          <header className="mb-4 border-b border-slate-700/70 pb-3">
            <h2 className="text-lg font-bold text-slate-50 md:text-xl">📖 Daftar Isi</h2>
            <p className="mt-1 text-xs text-slate-400">{book.chapters.length} bab tersedia</p>
          </header>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {book.chapters.map((chapter, i) => (
              <a
                key={i}
                href={`#chapter-${i}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm transition hover:border-cyan-300/50 hover:bg-cyan-500/5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/20 transition group-hover:bg-cyan-500/15 group-hover:ring-cyan-400/30">
                  {i + 1}
                </span>
                <span className="flex-1 text-slate-200 transition group-hover:text-cyan-200">{chapter.title}</span>
                <svg className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Chapters */}
        <div className="mt-6 space-y-6">
          {book.chapters.map((chapter, chapterIndex) => (
            <section
              key={chapterIndex}
              id={`chapter-${chapterIndex}`}
              className="glass-panel rounded-3xl p-5 md:p-7"
            >
              <header className="mb-5 border-b border-slate-700/70 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  Bab {chapterIndex + 1} dari {book.chapters.length}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-50 md:text-2xl">{chapter.title}</h2>
              </header>

              <div className="flex flex-col gap-3">
                {chapter.lines.map((line, lineIndex) => (
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
            </section>
          ))}
        </div>

        {/* Other Books */}
        {otherBooks.length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">Buku Lainnya</h2>
            <div className="grid gap-4">
              {otherBooks.map((item, i) => (
                <BookCard key={item.id} book={item} index={i} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
