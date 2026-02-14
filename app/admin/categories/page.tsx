"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Category } from "@/app/(frontend)/toko/products";

type CategoryForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

const emptyCategoryForm: CategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  icon: "",
};

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    setCategoryForm({ ...categoryForm, name, slug });
  };

  async function handleSaveCategory() {
    if (!categoryForm.name || !categoryForm.slug) {
      flash("❌ Nama dan slug wajib diisi!");
      return;
    }

    try {
      const method = editingCategoryId ? "PUT" : "POST";
      const url = editingCategoryId 
        ? `/api/categories/${editingCategoryId}`
        : "/api/categories";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryForm.id || categoryForm.slug,
          name: categoryForm.name,
          slug: categoryForm.slug,
          description: categoryForm.description,
          icon: categoryForm.icon,
        }),
      });

      if (res.ok) {
        flash(editingCategoryId ? "✅ Kategori berhasil diupdate!" : "✅ Kategori berhasil dibuat!");
        setCategoryForm(emptyCategoryForm);
        setEditingCategoryId(null);
        setShowCategoryForm(false);
        fetchCategories();
      } else {
        flash("❌ Gagal menyimpan kategori");
      }
    } catch (err) {
      console.error("Save error:", err);
      flash("❌ Gagal menyimpan kategori");
    }
  }

  function handleEditCategory(category: Category) {
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
    });
    setEditingCategoryId(category.id);
    setShowCategoryForm(true);
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Kategori berhasil dihapus!");
        fetchCategories();
      } else {
        flash("❌ Gagal menghapus kategori");
      }
    } catch (err) {
      console.error("Delete error:", err);
      flash("❌ Gagal menghapus kategori");
    }
  }

  return (
    <div className="bg-canvas min-h-screen p-4 text-slate-100 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">🏷️ Kelola Kategori Produk</h1>
            <p className="mt-1 text-sm text-slate-400">Tambah, edit, dan hapus kategori untuk produk toko</p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-slate-600/50 px-3 py-2 text-xs sm:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            ← Kembali ke Admin
          </Link>
        </div>

        {/* Flash message */}
        {message && (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {message}
          </div>
        )}

        {/* Add Category Button */}
        {!showCategoryForm && (
          <div className="mb-4">
            <button
              onClick={() => {
                setCategoryForm(emptyCategoryForm);
                setEditingCategoryId(null);
                setShowCategoryForm(true);
              }}
              className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              + Tambah Kategori
            </button>
          </div>
        )}

        {/* Category Form */}
        {showCategoryForm && (
          <div className="glass-panel mb-6 rounded-2xl p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editingCategoryId ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Nama Kategori *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Contoh: Kaos"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Slug *</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="kaos"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Icon (emoji)</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="👕"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Deskripsi</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Kaos dan T-Shirt berkualitas"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveCategory}
                  className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                >
                  {editingCategoryId ? "💾 Update" : "✅ Simpan"}
                </button>
                <button
                  onClick={() => {
                    setCategoryForm(emptyCategoryForm);
                    setEditingCategoryId(null);
                    setShowCategoryForm(false);
                  }}
                  className="rounded-xl border border-slate-600/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">Memuat data...</div>
        ) : (
          <div className="glass-panel rounded-2xl p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Semua Kategori ({categories.length})</h2>
            
            {categories.length === 0 ? (
              <p className="text-center text-sm text-slate-400">Belum ada kategori</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700/50">
                    <tr className="text-left text-slate-400">
                      <th className="pb-3 pr-4">Icon</th>
                      <th className="pb-3 pr-4">Nama</th>
                      <th className="pb-3 pr-4">Slug</th>
                      <th className="pb-3 pr-4">Deskripsi</th>
                      <th className="pb-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {categories.map((category) => (
                      <tr key={category.id} className="text-slate-200">
                        <td className="py-3 pr-4 text-2xl">{category.icon || "📦"}</td>
                        <td className="py-3 pr-4 font-medium">{category.name}</td>
                        <td className="py-3 pr-4 font-mono text-xs text-slate-400">{category.slug}</td>
                        <td className="py-3 pr-4 text-slate-400">{category.description || "-"}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-cyan-400 transition hover:text-cyan-300"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-rose-400 transition hover:text-rose-300"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
