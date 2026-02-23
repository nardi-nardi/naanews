"use client";
import { useState } from "react";
import type { Book } from "@/app/data/content";
import { BookForm } from "./book-form";

export function BookTab({ books, onRefresh, onDelete, flash }: any) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (formData: any) => {
    const res = await fetch(
      editingBook ? `/api/books/${editingBook.id}` : "/api/books",
      {
        method: editingBook ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      flash("✅ Buku Tersimpan!");
      setShowForm(false);
      setEditingBook(null);
      onRefresh();
    } else flash("❌ Gagal simpan");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Buku</h2>
        {!showForm && (
          <button
            onClick={() => {
              setEditingBook(null);
              setShowForm(true);
            }}
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
          onCancel={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
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
                onClick={() => {
                  setEditingBook(book);
                  setShowForm(true);
                }}
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
