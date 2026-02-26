"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import type { Product, Category } from "@/app/types/products";

type ProductForm = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId: string;
  stock: number;
  featured: boolean;
  productType: "physical" | "digital";
  platforms: {
    shopee?: string;
    tokopedia?: string;
    tiktokshop?: string;
    lynk?: string;
  };
};

const emptyProductForm: ProductForm = {
  id: "",
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  categoryId: "",
  stock: 0,
  featured: false,
  productType: "physical",
  platforms: {},
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Auto-generate ID from name
  const handleNameChange = (name: string) => {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setProductForm({ ...productForm, name, id: editingProductId || id });
  };

  // Update category name when categoryId changes
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    setProductForm({
      ...productForm,
      categoryId,
      category: category?.name || "",
    });
  };

  async function handleSaveProduct() {
    if (!productForm.name || !productForm.categoryId) {
      flash("❌ Nama dan kategori wajib diisi!");
      return;
    }

    try {
      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          id:
            productForm.id ||
            productForm.name.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (res.ok) {
        flash(
          editingProductId
            ? "✅ Produk berhasil diupdate!"
            : "✅ Produk berhasil dibuat!"
        );
        setProductForm(emptyProductForm);
        setEditingProductId(null);
        setShowProductForm(false);
        fetchData();
      } else {
        flash("❌ Gagal menyimpan produk");
      }
    } catch (err) {
      console.error("Save error:", err);
      flash("❌ Gagal menyimpan produk");
    }
  }

  function handleEditProduct(product: Product) {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category,
      categoryId: product.categoryId || "",
      stock: product.stock,
      featured: product.featured || false,
      productType: product.productType || "physical",
      platforms: product.platforms || {},
    });
    setEditingProductId(product.id);
    setShowProductForm(true);
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Produk berhasil dihapus!");
        fetchData();
      } else {
        flash("❌ Gagal menghapus produk");
      }
    } catch (err) {
      console.error("Delete error:", err);
      flash("❌ Gagal menghapus produk");
    }
  }

  function handleAddImage(url: string) {
    setProductForm({
      ...productForm,
      images: [...productForm.images, url],
    });
  }

  function handleRemoveImage(index: number) {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="bg-canvas min-h-screen p-4 text-slate-100 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              🛒 Kelola Produk Toko
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Tambah, edit, dan hapus produk untuk dijual
            </p>
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

        {/* Add Product Button */}
        {!showProductForm && (
          <div className="mb-4">
            <button
              onClick={() => {
                setProductForm(emptyProductForm);
                setEditingProductId(null);
                setShowProductForm(true);
              }}
              className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              + Tambah Produk
            </button>
          </div>
        )}

        {/* Product Form */}
        {showProductForm && (
          <div className="glass-panel mb-6 rounded-2xl p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editingProductId ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Contoh: Kaos NAA News Navy"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    ID Produk
                  </label>
                  <input
                    type="text"
                    value={productForm.id}
                    onChange={(e) =>
                      setProductForm({ ...productForm, id: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="kaos-naa-navy"
                    disabled={!!editingProductId}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Deskripsi
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Deskripsi produk lengkap..."
                  rows={4}
                />
              </div>

              {/* Price, Stock, Category */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="89000"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Kategori *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Type & Featured */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">
                    Tipe Produk
                  </label>
                  <select
                    value={productForm.productType}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productType: e.target.value as "physical" | "digital",
                      })
                    }
                    className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="physical">📦 Produk Fisik</option>
                    <option value="digital">💾 Produk Digital</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        featured: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900/40 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="featured" className="text-sm text-slate-300">
                    ⭐ Produk Unggulan
                  </label>
                </div>
              </div>

              {/* Platform URLs */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Platform Penjualan
                </label>
                <div className="space-y-3">
                  {productForm.productType === "physical" ? (
                    <>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">
                          Shopee URL
                        </label>
                        <input
                          type="url"
                          value={productForm.platforms.shopee || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              platforms: {
                                ...productForm.platforms,
                                shopee: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                          placeholder="https://shopee.co.id/product/..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">
                          Tokopedia URL
                        </label>
                        <input
                          type="url"
                          value={productForm.platforms.tokopedia || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              platforms: {
                                ...productForm.platforms,
                                tokopedia: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                          placeholder="https://tokopedia.com/product/..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-400">
                          TikTok Shop URL
                        </label>
                        <input
                          type="url"
                          value={productForm.platforms.tiktokshop || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              platforms: {
                                ...productForm.platforms,
                                tiktokshop: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                          placeholder="https://tiktokshop.com/product/..."
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="mb-1 block text-xs text-slate-400">
                        Lynk URL
                      </label>
                      <input
                        type="url"
                        value={productForm.platforms.lynk || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            platforms: {
                              ...productForm.platforms,
                              lynk: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                        placeholder="https://lynk.id/..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Gambar Produk
                </label>
                <div className="space-y-3">
                  {productForm.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...productForm.images];
                          newImages[idx] = e.target.value;
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        className="flex-1 rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/30"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <ImageUpload
                    onUploadComplete={handleAddImage}
                    buttonText="+ Tambah Gambar"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProduct}
                  className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                >
                  {editingProductId ? "💾 Update" : "✅ Simpan"}
                </button>
                <button
                  onClick={() => {
                    setProductForm(emptyProductForm);
                    setEditingProductId(null);
                    setShowProductForm(false);
                  }}
                  className="rounded-xl border border-slate-600/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            Memuat data...
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Semua Produk ({products.length})
            </h2>

            {products.length === 0 ? (
              <p className="text-center text-sm text-slate-400">
                Belum ada produk
              </p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start gap-4 rounded-lg border border-slate-700/50 bg-slate-900/40 p-4 transition hover:border-cyan-400/30"
                  >
                    {/* Product Image */}
                    {product.images[0] && (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-700/50">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-100">
                          {product.name}
                        </h3>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-cyan-400 transition hover:text-cyan-300"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-rose-400 transition hover:text-rose-300"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="mb-2 text-sm text-slate-400 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-orange-400">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          Stok: {product.stock}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-slate-300">
                          {product.category}
                        </span>
                        {product.featured && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-orange-300">
                              ⭐ Unggulan
                            </span>
                          </>
                        )}
                        <span className="text-slate-500">•</span>
                        <span
                          className={`rounded-full px-2 py-0.5 ${
                            product.productType === "digital"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {product.productType === "digital"
                            ? "💾 Digital"
                            : "📦 Fisik"}
                        </span>
                      </div>

                      {/* Platform badges */}
                      {product.platforms &&
                        Object.keys(product.platforms).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.platforms.shopee && (
                              <span className="rounded bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">
                                Shopee
                              </span>
                            )}
                            {product.platforms.tokopedia && (
                              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                                Tokopedia
                              </span>
                            )}
                            {product.platforms.tiktokshop && (
                              <span className="rounded bg-slate-500/20 px-2 py-0.5 text-xs text-slate-300">
                                TikTok Shop
                              </span>
                            )}
                            {product.platforms.lynk && (
                              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300">
                                Lynk
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
