import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function useGlobalSearchFocus() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const focusSearch = () => {
      const searchInput = document.getElementById(
        "global-search"
      ) as HTMLInputElement;
      if (searchInput) searchInput.focus();
    };

    if (searchParams.get("from") === "search") {
      setTimeout(() => {
        focusSearch();
        window.history.replaceState(null, "", "/");
      }, 100);
    }

    function handleKeyPress(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        focusSearch();
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [searchParams]);
}
