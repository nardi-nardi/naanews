import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireSeedAuth } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import {
  books as seedBooks,
  feeds as seedFeeds,
  stories as seedStories,
  type Book,
  type BookChapter,
  type ChatLine,
  type Feed,
  type Story,
} from "@/data/content";
import {
  roadmaps as seedRoadmaps,
  type Roadmap,
  type RoadmapStep,
} from "@/types/roadmaps";
import {
  categories as seedCategories,
  products as seedProducts,
  type Category,
  type Product,
} from "@/types/products";

/** Max 2 seed per IP per jam — hanya untuk setup/restore */
const SEED_RATE_LIMIT = { max: 2, windowMs: 60 * 60 * 1000 };

const DEFAULT_SEED_COUNT = 10;
const MIN_SEED_COUNT = 1;
const MAX_SEED_COUNT = 1000;

function clampSeedCount(
  rawValue: unknown,
  fallback = DEFAULT_SEED_COUNT
): number {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.trunc(parsed);
  if (rounded < MIN_SEED_COUNT) return MIN_SEED_COUNT;
  if (rounded > MAX_SEED_COUNT) return MAX_SEED_COUNT;
  return rounded;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function pickSeed<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function buildStories(count: number): Story[] {
  return Array.from({ length: count }, (_, index) => {
    const base = pickSeed(seedStories, index);
    const id = index + 1;

    return {
      id,
      name: `${base.name} ${id}`,
      label: `${base.label}-${id}`,
      type: base.type,
      palette: base.palette,
      image: `https://picsum.photos/seed/story-${id}/400/400`,
      viral: index % 3 === 0 ? true : base.viral,
    };
  });
}

function buildFeeds(count: number, storyCount: number): Feed[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const base = pickSeed(seedFeeds, index);
    const id = index + 1;

    return {
      id,
      title: `${base.title} #${id}`,
      category: base.category,
      createdAt: now - index * 60 * 60 * 1000,
      popularity: Math.max(10, 100 - (index % 90)),
      image: `https://picsum.photos/seed/feed-${id}/800/400`,
      lines: base.lines.map((line, lineIndex) => ({
        ...line,
        text: `${line.text} (dummy ${id}.${lineIndex + 1})`,
      })),
      takeaway: `${base.takeaway} [dummy-${id}]`,
      source: base.source,
      storyId: (index % storyCount) + 1,
    };
  });
}

function buildBooks(count: number, storyCount: number): Book[] {
  return Array.from({ length: count }, (_, index) => {
    const base = pickSeed(seedBooks, index);
    const id = index + 1;
    const fallbackLines: ChatLine[] = [
      { role: "a", text: "Konten chapter dummy." },
    ];
    const fallbackChapter: BookChapter = {
      title: "Pendahuluan",
      lines: fallbackLines,
    };
    const chapterSource: BookChapter[] =
      base.chapters.length > 0 ? base.chapters : [fallbackChapter];

    return {
      id,
      title: `${base.title} Vol ${Math.floor(index / seedBooks.length) + 1}`,
      author: base.author,
      cover: `https://picsum.photos/seed/book-${id}/600/900`,
      genre: base.genre,
      pages: Math.max(60, base.pages + (index % 8) * 12),
      rating: Number((3.8 + (index % 12) * 0.1).toFixed(1)),
      description: `${base.description} (Edisi dummy ${id})`,
      chapters: chapterSource.map((chapter, chapterIndex) => ({
        title: `${chapter.title} ${id}.${chapterIndex + 1}`,
        lines: chapter.lines.map((line, lineIndex) => ({
          ...line,
          text: `${line.text} [dummy ${id}.${lineIndex + 1}]`,
        })),
      })),
      storyId: (index % storyCount) + 1,
    };
  });
}

function buildRoadmapSteps(
  baseSteps: RoadmapStep[],
  index: number
): RoadmapStep[] {
  if (baseSteps.length === 0) {
    return [
      {
        title: `Dasar ${index + 1}`,
        description: "Mulai dari konsep inti dan praktik dasar.",
        focus: "Fundamental",
        videos: [
          { id: "dQw4w9WgXcQ", author: "NAA Academy" },
          { id: "3fumBcKC6RE", author: "NAA Academy" },
        ],
      },
      {
        title: `Proyek ${index + 1}`,
        description: "Bangun mini project untuk menguatkan konsep.",
        focus: "Project Practice",
        videos: [{ id: "ysz5S6PUM-U", author: "NAA Labs" }],
      },
      {
        title: `Lanjutan ${index + 1}`,
        description: "Masuk ke pola arsitektur dan optimasi.",
        focus: "Advanced",
        videos: [{ id: "M7lc1UVf-VE", author: "NAA Labs" }],
      },
    ];
  }

  return baseSteps.map((step, stepIndex) => ({
    ...step,
    title: `${step.title} ${index + 1}.${stepIndex + 1}`,
    description: `${step.description} (dummy batch ${index + 1})`,
    videos:
      step.videos.length > 0
        ? step.videos
        : [{ id: "dQw4w9WgXcQ", author: "NAA Academy" }],
  }));
}

function buildRoadmaps(count: number): Omit<Roadmap, "_id">[] {
  const now = Date.now();
  const levels: Roadmap["level"][] = ["Pemula", "Menengah", "Lanjutan"];

  return Array.from({ length: count }, (_, index) => {
    const base = pickSeed(seedRoadmaps, index);
    const id = index + 1;
    const cleanTitle =
      base.title.replace(/\(Offline Mode\)/gi, "").trim() || "Roadmap";
    const rawSlug = base.slug || cleanTitle;

    return {
      slug: `${slugify(rawSlug)}-${id}`,
      title: `${cleanTitle} ${id}`,
      summary: `${base.summary} (dummy batch ${id})`,
      duration: `${2 + (index % 10)} minggu`,
      level: levels[index % levels.length],
      tags: [
        "Dummy",
        ...base.tags.filter((tag) => tag.toLowerCase() !== "offline"),
      ],
      image: `https://picsum.photos/seed/roadmap-${id}/1200/800`,
      steps: buildRoadmapSteps(base.steps, index),
      createdAt: now - index * 24 * 60 * 60 * 1000,
      updatedAt: now - index * 24 * 60 * 60 * 1000,
    };
  });
}

function buildCategories(): Omit<Category, "_id">[] {
  const now = Date.now();
  return seedCategories.map((category, index) => {
    const { _id, ...withoutId } = category;
    return {
      ...withoutId,
      createdAt: now - index * 24 * 60 * 60 * 1000,
      updatedAt: now - index * 24 * 60 * 60 * 1000,
    };
  });
}

function buildProducts(
  count: number,
  categories: Omit<Category, "_id">[]
): Omit<Product, "_id">[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const base = pickSeed(seedProducts, index);
    const id = index + 1;
    const selectedCategory = categories[index % categories.length];
    const productType: Product["productType"] =
      index % 5 === 0 ? "digital" : "physical";

    return {
      id: `product-${id}`,
      name: `${base.name} #${id}`,
      description: `${base.description} (dummy batch ${id})`,
      price: Math.max(10000, Number(base.price) + (index % 15) * 2500),
      images: [
        `https://picsum.photos/seed/product-${id}/900/900`,
        ...(base.images ?? []).slice(0, 1),
      ],
      category: selectedCategory.name,
      categoryId: selectedCategory.id,
      stock: Math.max(1, Number(base.stock ?? 50) + (index % 40) - 10),
      featured: index % 8 === 0 ? true : Boolean(base.featured),
      productType,
      platforms:
        productType === "digital"
          ? { lynk: `https://lynk.id/narzza/product-${id}` }
          : {
              shopee: `https://shopee.co.id/product-${id}`,
              tokopedia: `https://tokopedia.com/product-${id}`,
              tiktokshop: `https://tiktokshop.com/product-${id}`,
            },
      createdAt: now - index * 12 * 60 * 60 * 1000,
      updatedAt: now - index * 12 * 60 * 60 * 1000,
    };
  });
}

// POST /api/seed — seed the database with dummy data
export async function POST(request: Request) {
  const authError = requireSeedAuth(request);
  if (authError) return authError;

  const rateLimitRes = rateLimit(request, "seed", SEED_RATE_LIMIT);
  if (rateLimitRes) return rateLimitRes;

  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    let bodyCount: unknown;
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const body = (await request.json()) as { count?: unknown };
        bodyCount = body?.count;
      } catch {
        bodyCount = undefined;
      }
    }

    const countFromQuery = new URL(request.url).searchParams.get("count");
    const itemCount = clampSeedCount(
      countFromQuery ?? bodyCount,
      DEFAULT_SEED_COUNT
    );

    const stories = buildStories(itemCount);
    const feeds = buildFeeds(itemCount, stories.length);
    const books = buildBooks(itemCount, stories.length);
    const roadmaps = buildRoadmaps(itemCount);
    const categories = buildCategories();
    const products = buildProducts(itemCount, categories);

    // Clear existing data
    await db.collection("feeds").deleteMany({});
    await db.collection("stories").deleteMany({});
    await db.collection("books").deleteMany({});
    await db.collection("roadmaps").deleteMany({});
    await db.collection("products").deleteMany({});
    await db.collection("categories").deleteMany({});

    if (stories.length > 0) await db.collection("stories").insertMany(stories);
    if (feeds.length > 0) await db.collection("feeds").insertMany(feeds);
    if (books.length > 0) await db.collection("books").insertMany(books);
    if (roadmaps.length > 0)
      await db.collection("roadmaps").insertMany(roadmaps);
    if (categories.length > 0)
      await db.collection("categories").insertMany(categories);
    if (products.length > 0)
      await db.collection("products").insertMany(products);

    return NextResponse.json({
      success: true,
      itemCount,
      feedsInserted: feeds.length,
      storiesInserted: stories.length,
      booksInserted: books.length,
      roadmapsInserted: roadmaps.length,
      categoriesInserted: categories.length,
      productsInserted: products.length,
    });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
