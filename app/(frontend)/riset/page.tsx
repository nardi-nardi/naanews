import { FeedPage } from "@/app/(frontend)/components/feed-page";

export default function RisetPage() {
  return (
    <FeedPage
      activePath="/riset"
      badge="RISET"
      title="Hasil Riset"
      description="Insight produk, analisis fitur, dan best practice."
      category="Riset"
    />
  );
}
