"use client";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  /** compact = icon-only pill (for mobile topbar) */
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Aktifkan dark mode" : "Aktifkan light mode"}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-500/60 bg-slate-900/45 text-base transition hover:border-cyan-400/60 hover:bg-slate-800"
      >
        {isLight ? "🌙" : "☀️"}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Aktifkan dark mode" : "Aktifkan light mode"}
      className="flex w-full items-center gap-2.5 rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm transition hover:border-cyan-400/60 hover:bg-slate-700/60"
    >
      <span className="text-base">{isLight ? "🌙" : "☀️"}</span>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {isLight ? "Dark Mode" : "Light Mode"}
      </span>
      {/* Pill indicator */}
      <span className="ml-auto flex h-5 w-9 items-center rounded-full border border-slate-600/50 bg-slate-700/60 px-0.5 transition-colors"
        style={{
          backgroundColor: isLight ? "rgb(56 189 248 / 0.25)" : "",
          borderColor: isLight ? "rgb(56 189 248 / 0.4)" : "",
        }}
      >
        <span
          className="h-4 w-4 rounded-full bg-slate-400 transition-transform"
          style={{
            transform: isLight ? "translateX(16px)" : "translateX(0px)",
            backgroundColor: isLight ? "rgb(56 189 248)" : "rgb(148 163 184)",
          }}
        />
      </span>
    </button>
  );
}
