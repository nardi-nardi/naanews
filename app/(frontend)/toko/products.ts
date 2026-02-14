export type Product = {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId?: string; // Reference to category
  stock: number;
  featured?: boolean;
  productType: "physical" | "digital"; // Physical or Digital product
  platforms?: {
    shopee?: string;
    tokopedia?: string;
    tiktokshop?: string;
    lynk?: string;
  };
  createdAt?: number;
  updatedAt?: number;
};

export type Category = {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: number;
  updatedAt?: number;
};

// Seed data for categories
export const categories: Category[] = [
  {
    id: "kaos",
    name: "Kaos",
    slug: "kaos",
    description: "Kaos dan T-Shirt berkualitas",
    icon: "👕",
  },
  {
    id: "hoodie",
    name: "Hoodie & Jaket",
    slug: "hoodie",
    description: "Hoodie dan jaket nyaman",
    icon: "🧥",
  },
  {
    id: "aksesoris",
    name: "Aksesoris",
    slug: "aksesoris",
    description: "Aksesoris dan merchandise",
    icon: "🎒",
  },
  {
    id: "stationery",
    name: "Stationery",
    slug: "stationery",
    description: "Alat tulis dan buku",
    icon: "📝",
  },
  {
    id: "digital",
    name: "Produk Digital",
    slug: "digital",
    description: "E-book, template, dan produk digital lainnya",
    icon: "💾",
  },
];

// Seed data for products
export const products: Product[] = [
  {
    id: "kaos-naa-navy",
    name: "Kaos NAA News Navy",
    description: "Kaos premium 100% cotton dengan logo NAA News. Nyaman dipakai sehari-hari, cocok untuk kamu yang suka update berita terkini.",
    price: 89000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Kaos",
    categoryId: "kaos",
    stock: 50,
    featured: true,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/kaos-naa-navy",
      tokopedia: "https://tokopedia.com/product/kaos-naa-navy",
      tiktokshop: "https://tiktokshop.com/product/kaos-naa-navy",
    },
  },
  {
    id: "mug-programmer",
    name: "Mug Programmer Life",
    description: "Mug keramik berkualitas tinggi dengan quote motivasi programmer. Kapasitas 350ml, cocok untuk kopi atau teh favoritmu saat coding.",
    price: 65000,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Aksesoris",
    categoryId: "aksesoris",
    stock: 30,
    featured: true,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/mug-programmer",
      tokopedia: "https://tokopedia.com/product/mug-programmer",
    },
  },
  {
    id: "notebook-developer",
    name: "Developer Notebook",
    description: "Notebook dengan halaman dot grid, perfect untuk sketching wireframes dan catatan coding. Cover tebal dan kertas premium 100gsm.",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Stationery",
    categoryId: "stationery",
    stock: 40,
    featured: false,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/notebook-developer",
    },
  },
  {
    id: "hoodie-dev-black",
    name: "Hoodie Developer Edition",
    description: "Hoodie premium dengan material fleece tebal dan lembut. Desain minimalis dengan embroidery 'Dev Life'. Tersedia ukuran S-XXL.",
    price: 195000,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Hoodie",
    categoryId: "hoodie",
    stock: 25,
    featured: true,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/hoodie-dev",
      tokopedia: "https://tokopedia.com/product/hoodie-dev",
      tiktokshop: "https://tiktokshop.com/product/hoodie-dev",
    },
  },
  {
    id: "sticker-pack-tech",
    name: "Tech Sticker Pack (20pcs)",
    description: "Paket sticker waterproof dengan desain tech-themed. Cocok untuk laptop, tumbler, atau gadget lainnya. 20 desain berbeda.",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Aksesoris",
    categoryId: "aksesoris",
    stock: 100,
    featured: false,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/sticker-tech",
    },
  },
  {
    id: "tote-bag-canvas",
    name: "Canvas Tote Bag",
    description: "Tote bag canvas natural dengan sablon Narzza Media Digital. Kuat dan ramah lingkungan, kapasitas besar untuk kebutuhan sehari-hari.",
    price: 55000,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Tas",
    categoryId: "aksesoris",
    stock: 35,
    featured: false,
    productType: "physical",
    platforms: {
      shopee: "https://shopee.co.id/product/tote-bag",
      tokopedia: "https://tokopedia.com/product/tote-bag",
    },
  },
  {
    id: "ebook-nextjs-guide",
    name: "E-Book: Complete Next.js Guide",
    description: "Panduan lengkap Next.js dari dasar hingga advanced. Format PDF dengan 200+ halaman, bonus source code dan project template.",
    price: 99000,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Produk Digital",
    categoryId: "digital",
    stock: 999,
    featured: true,
    productType: "digital",
    platforms: {
      lynk: "https://lynk.id/narzza/nextjs-guide",
    },
  },
];

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
