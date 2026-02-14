export type Product = {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
};

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
    stock: 50,
    featured: true,
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
    stock: 30,
    featured: true,
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
    stock: 40,
    featured: false,
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
    stock: 25,
    featured: true,
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
    stock: 100,
    featured: false,
  },
  {
    id: "tote-bag-canvas",
    name: "Canvas Tote Bag",
    description: "Tote bag canvas natural dengan sablon NAA News. Kuat dan ramah lingkungan, kapasitas besar untuk kebutuhan sehari-hari.",
    price: 55000,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Tas",
    stock: 35,
    featured: false,
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
