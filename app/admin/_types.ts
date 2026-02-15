import type { ChatLine, Feed, Story, Book, BookChapter } from "@/app/data/content";
import type { Product, Category } from "@/app/(frontend)/toko/products";

export type AdminTab =
  | "feeds"
  | "stories"
  | "books"
  | "roadmaps"
  | "products"
  | "categories"
  | "analytics";

export type FeedForm = {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
  takeaway: string;
  lines: ChatLine[];
  source?: { title: string; url: string };
};

export type StoryForm = {
  name: string;
  label: string;
  type: "Berita" | "Tutorial" | "Riset";
  palette: string;
  image: string;
  viral: boolean;
};

export type BookForm = {
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  chapters: BookChapter[];
};

export type CategoryForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type ProductForm = {
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

export type RoadmapItem = {
  slug: string;
  title: string;
  level: string;
  duration: string;
  tags: string[];
  steps: unknown[];
};

export const emptyFeedForm: FeedForm = {
  title: "",
  category: "Berita",
  image: "",
  takeaway: "",
  lines: [
    { role: "q", text: "" },
    { role: "a", text: "" },
  ],
};

export const emptyStoryForm: StoryForm = {
  name: "",
  label: "",
  type: "Berita",
  palette: "from-sky-400 to-blue-500",
  image: "",
  viral: false,
};

export const emptyBookForm: BookForm = {
  title: "",
  author: "",
  cover: "",
  genre: "",
  pages: 0,
  rating: 0,
  description: "",
  chapters: [
    { title: "", lines: [{ role: "q", text: "" }, { role: "a", text: "" }] },
  ],
};

export const emptyCategoryForm: CategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  icon: "",
};

export const emptyProductForm: ProductForm = {
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

export const paletteOptions = [
  { value: "from-sky-400 to-blue-500", label: "Sky → Blue" },
  { value: "from-amber-300 to-orange-500", label: "Amber → Orange" },
  { value: "from-emerald-400 to-teal-500", label: "Emerald → Teal" },
  { value: "from-indigo-400 to-blue-600", label: "Indigo → Blue" },
  { value: "from-pink-400 to-rose-500", label: "Pink → Rose" },
  { value: "from-violet-400 to-fuchsia-500", label: "Violet → Fuchsia" },
];

// Re-export for use in tab components
export type { Feed, Story, Book, Product, Category };
