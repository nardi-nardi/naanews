"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ feedId }: { feedId: number }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent double tracking in React Strict Mode (dev mode)
    if (hasTracked.current) return;
    
    // Check if already viewed in this session
    const viewedKey = `viewed_feed_${feedId}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);
    
    if (alreadyViewed) {
      return; // Don't increment if already viewed in this session
    }

    // Increment view count when component mounts
    const incrementView = async () => {
      try {
        await fetch(`/api/feeds/${feedId}/view`, {
          method: "POST",
        });
        
        // Mark as tracked
        hasTracked.current = true;
        sessionStorage.setItem(viewedKey, "true");
      } catch (error) {
        console.error("Failed to increment view:", error);
      }
    };

    incrementView();
  }, [feedId]);

  return null; // This component doesn't render anything
}
