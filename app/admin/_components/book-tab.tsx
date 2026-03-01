"use client";
import type { Book } from "@/data/content";
import { BookForm } from "./book-form";
import { useAdminTab } from "@/hooks/useAdminTab";

export function BookTab({ books, onRefresh, onDelete, flash }: any) {
  const { editingItem: editingBook, showForm, handleSave, startEdit, startCreate, cancelForm } =
    useAdminTab<Book>("/api/books", "✅ Buku Tersimpan!", flash, onRefresh);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Buku</h2>
        {!showForm && (
          <button
            onClick={startCreate}
            className="rounded-xl bg-amber-600/80 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Tambah Buku
          </button>
        )}
      </div>

      {showForm && (
        <BookForm
          initialData={editingBook}
          onSave={handleSave}
          onCancel={cancelForm}
        />
      )}

      <div className="space-y-3">
        {books.map((book: Book) => (
          <div
            key={book.id}
            className="glass-panel flex items-center justify-between p-4 rounded-xl"
          >
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 rounded-full font-bold">
                  {book.genre}
                </span>
                <span className="text-xs text-amber-300">★ {book.rating}</span>
              </div>
              <p className="text-sm font-medium">{book.title}</p>
              <p className="text-xs text-slate-400">
                {book.author} • {book.chapters.length} Bab • {book.pages} Hal
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(book)}
                className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="text-xs bg-red-900/40 px-3 py-1.5 rounded-lg text-red-300"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
