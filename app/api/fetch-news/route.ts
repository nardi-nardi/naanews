import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getDb } from "@/app/lib/mongodb";
import { fetchRealNews } from "@/app/lib/news-fetcher";

export const dynamic = "force-dynamic";

// POST /api/fetch-news — fetch real news from RSS and store in DB
export async function POST() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        success: false,
        message: "MongoDB tidak tersedia. Tidak bisa menyimpan berita.",
      }, { status: 503 });
    }

    // Get the highest existing feed ID to avoid conflicts
    const lastFeed = await db
      .collection("feeds")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const startId = lastFeed.length > 0 ? (lastFeed[0].id as number) + 1 : 100;

    // Fetch real news
    const { feeds, result } = await fetchRealNews(startId);

    if (feeds.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Tidak berhasil mengambil berita dari sumber manapun.",
        sources: result.sources,
      });
    }

    // Insert into MongoDB
    await db.collection("feeds").insertMany(feeds.map((f) => ({ ...f })));

    // Invalidate cache
    revalidateTag("feeds");

    return NextResponse.json({
      success: true,
      message: `Berhasil menambahkan ${result.fetched} berita dari internet.`,
      ...result,
    });
  } catch (error) {
    console.error("POST /api/fetch-news error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal mengambil berita dari internet",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    );
  }
}
