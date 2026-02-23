import { BookCard } from "@/app/components/book-card";
import { SiteShell } from "@/app/components/navigation/SiteShell";
import { getBooks } from "@/app/lib/data";

export const revalidate = 300;

export default async function BukuPage() {
  const books = await getBooks();

  return (
    <SiteShell activePath="/buku">
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Perpustakaan NAA
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
          Buku Q&A Interaktif
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Belajar konsep teknis lewat format tanya jawab. Fokus, padat, dan
          langsung ke inti.
        </p>
      </section>

      <section className="mt-5 grid gap-4">
        {books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </section>
    </SiteShell>
  );
}
