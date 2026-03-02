"use client";
import { useEffect } from "react";

/**
 * Reads the saved theme from localStorage before first render
 * and sets `data-theme` on <html> — prevents flash of wrong theme.
 * Rendered once in the root layout.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("narzza-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return <>{children}</>;
}
