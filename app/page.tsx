"use client";

import { FeedPage } from "@/app/components/feed-page";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Jika redirect dari search page (ada parameter from=search), auto focus ke input
    if (searchParams.get("from") === "search") {
      setTimeout(() => {
        const searchInput = document.getElementById("global-search") as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        // Clean up URL
        window.history.replaceState(null, "", "/");
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Jangan intercept jika user sedang mengetik di input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      // Jika user ketik huruf/angka, auto focus ke search dan redirect
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Redirect ke search page dengan karakter yang diketik
        router.push(`/search?q=${encodeURIComponent(e.key)}`);
      }

      // Jika user tekan '/', focus ke search input
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search") as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <FeedPage
      activePath="/"
      badge="Narzza Media Digital"
      title="Berita, tutorial, dan eksperimen dalam format chat"
      description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
      showStories
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <HomePageContent />
    </Suspense>
  );
}
