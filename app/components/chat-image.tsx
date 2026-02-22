"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function ChatImage({ src }: { src: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll & handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <>
      {/* 1. Thumbnail (Gambar Kecil) */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative mt-2 block max-w-65 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 p-1 transition-all hover:border-cyan-500/50"
        title="Buka gambar"
      >
        <Image
          src={src}
          alt="Content Image"
          width={400}
          height={300}
          className="rounded-xl object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
          unoptimized
        />
      </button>

      {/* 2. Lightbox (Gambar Besar) */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
            {/* Backdrop Gelap + Blur */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 ease-out"
              onClick={() => setIsOpen(false)}
            />

            {/* Tombol Close Floating */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:rotate-90 duration-300 animate-in fade-in zoom-in-50"
              title="Tutup gambar"
              aria-label="Tutup gambar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Container Gambar Besar */}
            <div className="relative z-10 animate-in zoom-in-95 fade-in duration-300 ease-out">
              <Image
                src={src}
                alt="Preview Full"
                width={1600}
                height={1000}
                className="max-h-[85vh] w-auto max-w-[95vw] rounded-2xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] md:max-w-[85vw]"
                unoptimized
              />

              {/* Keterangan Singkat di bawah gambar (Opsional) */}
              <div className="mt-4 text-center animate-in slide-in-from-bottom-2 duration-500 delay-150">
                <p className="text-sm font-medium text-slate-400">
                  Tekan ESC atau klik di mana saja untuk menutup
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
