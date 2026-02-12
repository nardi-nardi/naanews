import { getDb } from "@/app/lib/mongodb";
import type { Book, BookChapter, ChatLine, Feed, Story } from "@/app/data/content";
import { books as dummyBooks, feeds as dummyFeeds, stories as dummyStories } from "@/app/data/content";

export async function getFeeds(category?: string): Promise<Feed[]> {
  try {
    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await db
      .collection("feeds")
      .find(filter)
      .sort({ popularity: -1 })
      .toArray();

    if (docs.length === 0 && !category) {
      // Fallback to dummy data if DB is empty
      return dummyFeeds;
    }

    return docs.map((d) => ({
      id: d.id as number,
      title: d.title as string,
      category: d.category as Feed["category"],
      time: d.time as string,
      popularity: d.popularity as number,
      image: d.image as string,
      lines: d.lines as Feed["lines"],
      takeaway: d.takeaway as string,
    }));
  } catch {
    // If MongoDB is unreachable, fallback to dummy data
    const filtered = category
      ? dummyFeeds.filter((f) => f.category === category)
      : dummyFeeds;
    return filtered.sort((a, b) => b.popularity - a.popularity);
  }
}

export async function getFeedById(id: number): Promise<Feed | null> {
  try {
    const db = await getDb();
    const doc = await db.collection("feeds").findOne({ id });

    if (!doc) {
      // Fallback to dummy data
      return dummyFeeds.find((f) => f.id === id) ?? null;
    }

    return {
      id: doc.id as number,
      title: doc.title as string,
      category: doc.category as Feed["category"],
      time: doc.time as string,
      popularity: doc.popularity as number,
      image: doc.image as string,
      lines: doc.lines as Feed["lines"],
      takeaway: doc.takeaway as string,
    };
  } catch {
    return dummyFeeds.find((f) => f.id === id) ?? null;
  }
}

export async function getStories(): Promise<Story[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("stories").find().sort({ id: 1 }).toArray();

    if (docs.length === 0) {
      return dummyStories;
    }

    return docs.map((d) => ({
      id: d.id as number,
      name: d.name as string,
      label: d.label as string,
      type: d.type as Story["type"],
      palette: d.palette as string,
      viral: d.viral as boolean,
    }));
  } catch {
    return dummyStories;
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("books").find().sort({ id: 1 }).toArray();

    if (docs.length === 0) {
      return dummyBooks;
    }

    return docs.map((d) => ({
      id: d.id as number,
      title: d.title as string,
      author: d.author as string,
      cover: d.cover as string,
      genre: d.genre as string,
      pages: d.pages as number,
      rating: d.rating as number,
      description: d.description as string,
      chapters: (d.chapters as BookChapter[]).map((ch) => ({
        title: ch.title,
        lines: ch.lines as ChatLine[],
      })),
    }));
  } catch {
    return dummyBooks;
  }
}

export async function getBookById(id: number): Promise<Book | null> {
  try {
    const db = await getDb();
    const doc = await db.collection("books").findOne({ id });

    if (!doc) {
      return dummyBooks.find((b) => b.id === id) ?? null;
    }

    return {
      id: doc.id as number,
      title: doc.title as string,
      author: doc.author as string,
      cover: doc.cover as string,
      genre: doc.genre as string,
      pages: doc.pages as number,
      rating: doc.rating as number,
      description: doc.description as string,
      chapters: (doc.chapters as BookChapter[]).map((ch) => ({
        title: ch.title,
        lines: ch.lines as ChatLine[],
      })),
    };
  } catch {
    return dummyBooks.find((b) => b.id === id) ?? null;
  }
}
