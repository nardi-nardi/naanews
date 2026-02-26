import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeedIds, getFeeds, getProducts } from "@/lib/data";
import { CommentSection } from "@/components/comment/comment-section";
import { ReadArticleHeader } from "../../../../components/reads/read-article-header";
import { ReadArticleBody } from "../../../../components/reads/read-article-body";
import { SimilarFeedsSection } from "../../../../components/reads/similar-feeds-section";
import { StorePreviewSection } from "../../../../components/reads/store-preview-section";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = await getFeedIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const feedId = Number(id);
  if (Number.isNaN(feedId))
    return { title: "Konten tidak ditemukan | Narzza Media Digital" };
  const feeds = await getFeeds();
  const feed = feeds.find((item) => item.id === feedId);
  if (!feed) return { title: "Konten tidak ditemukan | Narzza Media Digital" };
  return {
    title: `${feed.title} | Narzza Media Digital`,
    description: feed.takeaway,
    openGraph: {
      title: feed.title,
      description: feed.takeaway,
      images: [feed.image],
      type: "article",
    },
    alternates: { canonical: `/read/${feed.id}` },
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const feedId = Number(id);
  if (Number.isNaN(feedId)) notFound();

  const [allFeeds, products] = await Promise.all([getFeeds(), getProducts()]);
  const feed = allFeeds.find((item) => item.id === feedId) ?? null;
  if (!feed) notFound();

  const similarFeeds = allFeeds
    .filter((item) => item.category === feed.category && item.id !== feed.id)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);
  const storePreview = products.slice(0, 8);

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <div className="mx-auto w-full max-w-4xl">
        <ReadArticleHeader title={feed.title} category={feed.category} />
        <ReadArticleBody feed={feed} />
        <CommentSection feedId={feed.id} />
        <SimilarFeedsSection feeds={similarFeeds} category={feed.category} />
        <StorePreviewSection products={storePreview} />
      </div>
    </div>
  );
}
