"use client";
import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "narzza-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount, read from localStorage (or system preference)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // Default dark
      applyTheme("dark");
    }
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return { theme, toggleTheme };
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}
