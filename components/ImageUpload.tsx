"use client";

import { useImageUpload } from "@/hooks/useImageUpload";
import Image from "next/image";

type ImageUploadProps = {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  label?: string;
  buttonText?: string;
};

export function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  label = "Upload Image",
  buttonText = "Pilih Gambar",
}: ImageUploadProps) {
  // Ambil semua state dan fungsi dari Custom Hook
  const {
    uploading,
    preview,
    error,
    progress,
    fileInputRef,
    handleFileChange,
    handleRemove,
  } = useImageUpload({ currentImageUrl, onUploadComplete });

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-medium text-slate-400">
          {label}
        </label>
      )}

      {/* Area Preview */}
      {preview && (
        <div className="relative w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/30">
          <Image
            src={preview}
            alt="Preview"
            width={800} // Lebar estimasi
            height={400} // Tinggi estimasi
            className="h-48 w-full object-cover"
            unoptimized={preview.startsWith("blob:")}
          />
          
          <button
            onClick={handleRemove}
            type="button"
            disabled={uploading}
            className="absolute right-2 top-2 rounded-lg bg-red-900/80 px-2 py-1 text-xs font-medium text-red-200 backdrop-blur-sm transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            Hapus
          </button>
        </div>
      )}

      {/* Area Tombol Upload */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          aria-hidden="true"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/60 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-600/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? `Mengunggah... ${progress}%` : buttonText}
        </button>

        <span className="text-xs text-slate-500">
          Max 2MB. (JPG, PNG, GIF, WebP)
        </span>
      </div>

      {/* Pesan Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full bg-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
