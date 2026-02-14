"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/* ──────────────────────────────────────────────
   Lightbox Context — shared across all ChatImage
   instances so only ONE lightbox is rendered at
   the document root via a Portal.
   ────────────────────────────────────────────── */

type LightboxCtx = {
  open: (src: string) => void;
};

const LightboxContext = createContext<LightboxCtx | null>(null);

/** Wrap any page/layout that uses <ChatImage> with this provider. */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const open = useCallback((imgSrc: string) => {
    setSrc(imgSrc);
    setMounted(true);
    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // Wait for leave animation before unmounting
    const timer = setTimeout(() => {
      setMounted(false);
      setSrc(null);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll & listen for Escape
  useEffect(() => {
    if (!mounted) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, close]);

  const ctx: LightboxCtx = { open };

  return (
    <LightboxContext.Provider value={ctx}>
      {children}

      {typeof window !== "undefined" && mounted && src
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Image preview"
              className="fixed inset-0 z-[9999] flex items-center justify-center"
            >
              {/* ── Backdrop ── */}
              <div
                ref={backdropRef}
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-250 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
                onClick={close}
              />

              {/* ── Close button ── */}
              <button
                type="button"
                aria-label="Tutup gambar"
                onClick={close}
                className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-all duration-250 hover:bg-white/20 ${
                  visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* ── Image container ── */}
              <div
                ref={imgContainerRef}
                className={`relative z-[1] transition-all duration-250 ${
                  visible
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={src}
                  alt="Preview"
                  width={1200}
                  height={800}
                  className="max-h-[80vh] max-w-[92vw] rounded-xl object-contain shadow-2xl md:max-h-[85vh] md:max-w-[80vw]"
                  unoptimized
                  priority
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </LightboxContext.Provider>
  );
}

/* ──────────────────────────────────────────────
   ChatImage — thumbnail that opens the lightbox
   ────────────────────────────────────────────── */

export function ChatImage({ src }: { src: string }) {
  const ctx = useContext(LightboxContext);

  return (
    <button
      type="button"
      aria-label="Lihat gambar lebih besar"
      className="group mt-2 block max-w-60 cursor-zoom-in overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      onClick={() => ctx?.open(src)}
    >
      <Image
        src={src}
        alt=""
        width={240}
        height={160}
        className="h-auto w-full rounded-xl object-cover transition-transform duration-200 group-hover:scale-105"
        unoptimized
      />
    </button>
  );
}
