export type FeedCategory = "Berita" | "Tutorial" | "Riset";

export type Story = {
  id: number;
  name: string;
  label: string;
  type: FeedCategory;
  palette: string;
  image: string;
  viral: boolean;
};

export type ChatLine = {
  role: "q" | "a";
  text: string;
  image?: string;
};

export type Feed = {
  id: number;
  title: string;
  category: FeedCategory;
  createdAt: number;
  popularity: number;
  image: string;
  lines: ChatLine[];
  takeaway: string;
  source?: { title: string; url: string };
  storyId?: number | null;
};

export type BookChapter = {
  title: string;
  lines: ChatLine[];
};

export type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  chapters: BookChapter[];
  storyId?: number | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
};
