import { FeedPage } from "@/app/components/feed-page";

export default function TutorialPage() {
  return (
    <FeedPage
      activePath="/tutorial"
      badge="TUTORIAL"
      title="Panduan Teknis"
      description="Tutorial langkah demi langkah membangun fitur dan solusi."
      category="Tutorial"
    />
  );
}
