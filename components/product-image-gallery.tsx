"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
  featured?: boolean;
};

export function ProductImageGallery({ images, productName, featured }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const mainImage = images[selectedImageIndex] || images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="relative aspect-video bg-slate-900/60">
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 672px"
        />
        {featured && (
          <div className="absolute left-3 top-3 rounded bg-gradient-to-r from-orange-500 to-orange-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            ⭐ UNGGULAN
          </div>
        )}
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images - Interactive */}
      {images.length > 1 && (
        <div className="border-t border-slate-700/40 bg-slate-900/20 p-3">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                title="Button Image"
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-cyan-500 ring-2 ring-cyan-500/40"
                    : "border-slate-700/60 hover:border-cyan-500/60"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
