"use client";

import { useEffect, useState } from "react";
import { getRelativeTime } from "@/app/(frontend)/lib/time-utils";

type RelativeTimeProps = {
  timestamp: number;
  className?: string;
};

/**
 * Client-side component to display relative time.
 * Prevents hydration mismatch by calculating time on client.
 */
export function RelativeTime({ timestamp, className }: RelativeTimeProps) {
  const [timeText, setTimeText] = useState<string>("");

  useEffect(() => {
    // Calculate time on client side to avoid hydration mismatch
    setTimeText(getRelativeTime(timestamp));

    // Optional: Update every minute for live updates
    const interval = setInterval(() => {
      setTimeText(getRelativeTime(timestamp));
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, [timestamp]);

  // Return empty on server-side render to avoid hydration mismatch
  if (!timeText) {
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{timeText}</span>;
}
