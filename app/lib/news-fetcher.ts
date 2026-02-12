import Parser from "rss-parser";
import type { Feed, ChatLine } from "@/app/data/content";

/* ─────────────────────────────────────────────
   RSS sources — Indonesian tech & general news
   ───────────────────────────────────────────── */

type RssSource = {
  url: string;
  category: Feed["category"];
  name: string;
};

const RSS_SOURCES: RssSource[] = [
  // ── Berita ──
  { url: "https://rss.detik.com/index.php/inet", category: "Berita", name: "Detik Inet" },
  { url: "https://tekno.kompas.com/rss", category: "Berita", name: "Kompas Tekno" },
  { url: "https://www.cnnindonesia.com/teknologi/rss", category: "Berita", name: "CNN Teknologi" },

  // ── Tutorial / tips ──
  { url: "https://feeds.feedburner.com/cabornet", category: "Tutorial", name: "Cabornet" },

  // ── Riset / science ──
  { url: "https://rss.detik.com/index.php/health", category: "Riset", name: "Detik Health" },
];

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; NAANewsBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImageFromContent(content?: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Baru saja";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

/** Convert an article into Q&A chat lines */
function articleToLines(title: string, snippet: string, source: string): ChatLine[] {
  const lines: ChatLine[] = [];

  // Opening question
  lines.push({ role: "q", text: `Apa inti dari berita "${title}"?` });

  // Main answer from content
  if (snippet.length > 0) {
    // Split long content into digestible chunks
    const sentences = snippet.match(/[^.!?]+[.!?]+/g) ?? [snippet];
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      if ((current + sentence).length > 280) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    // First chunk as main answer
    lines.push({ role: "a", text: chunks[0] ?? snippet.slice(0, 300) });

    // Additional Q&A pairs for remaining content
    if (chunks.length > 1) {
      lines.push({ role: "q", text: "Bisa jelaskan lebih detail?" });
      lines.push({ role: "a", text: chunks.slice(1, 3).join(" ") });
    }

    if (chunks.length > 3) {
      lines.push({ role: "q", text: "Ada informasi tambahan lainnya?" });
      lines.push({ role: "a", text: chunks.slice(3, 5).join(" ") });
    }
  } else {
    lines.push({ role: "a", text: `Berita ini membahas tentang ${title.toLowerCase()}.` });
  }

  // Source attribution
  lines.push({ role: "q", text: "Sumber beritanya dari mana?" });
  lines.push({ role: "a", text: `Berita ini bersumber dari ${source}.` });

  return lines;
}

/* ─────────────────────────────────────────────
   Main fetch function
   ───────────────────────────────────────────── */

export type FetchResult = {
  fetched: number;
  sources: { name: string; count: number; error?: string }[];
};

export async function fetchRealNews(startId: number): Promise<{ feeds: Feed[]; result: FetchResult }> {
  const allFeeds: Feed[] = [];
  const sourceResults: FetchResult["sources"] = [];
  let currentId = startId;

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items ?? []).slice(0, 5); // Max 5 per source
      let count = 0;

      for (const item of items) {
        if (!item.title) continue;

        const title = stripHtml(item.title);
        const rawContent = item["content:encoded"] ?? item.contentSnippet ?? item.content ?? "";
        const snippet = stripHtml(typeof rawContent === "string" ? rawContent : "");
        const image =
          extractImageFromContent(item["content:encoded"] ?? item.content ?? "") ??
          item.enclosure?.url ??
          `https://picsum.photos/seed/news-${currentId}/800/450`;

        const newFeed: Feed = {
          id: currentId++,
          title,
          category: source.category,
          time: timeAgo(item.pubDate ?? item.isoDate),
          popularity: Math.floor(Math.random() * 80) + 20,
          image,
          lines: articleToLines(title, snippet, source.name),
          takeaway:
            snippet.length > 100
              ? snippet.slice(0, 120).trim() + "…"
              : snippet || title,
        };

        allFeeds.push(newFeed);
        count++;
      }

      sourceResults.push({ name: source.name, count });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error(`[fetchRealNews] Failed to fetch ${source.name}:`, errorMsg);
      sourceResults.push({ name: source.name, count: 0, error: errorMsg });
    }
  }

  return {
    feeds: allFeeds,
    result: {
      fetched: allFeeds.length,
      sources: sourceResults,
    },
  };
}
