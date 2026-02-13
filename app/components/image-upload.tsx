"use client";

import { useState, useRef } from "react";

type ImageUploadProps = {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  label?: string;
  buttonText?: string;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  label = "Upload Image",
  buttonText = "Pilih Gambar",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      setError(`Ukuran file maksimal 2MB (file Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }

    // Preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload process
    setUploading(true);
    setProgress(10);

    try {
      // Step 1: Get presigned URL dari API route
      setProgress(20);
      const presignedResponse = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const { presignedUrl, publicUrl } = await presignedResponse.json();
      setProgress(40);

      // Step 2: Upload file langsung ke DigitalOcean Spaces menggunakan presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-amz-acl": "public-read",
        },
        body: file,
      });

      setProgress(80);

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      setProgress(100);

      // Step 3: Call callback dengan public URL
      onUploadComplete(publicUrl);
      setError(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Gagal upload gambar");
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleRemove() {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs text-slate-400">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/30">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute right-2 top-2 rounded-lg bg-red-900/80 px-2 py-1 text-xs text-red-200 backdrop-blur-sm hover:bg-red-800"
          >
            Hapus
          </button>
        </div>
      )}

      {/* Upload button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          disabled={uploading}
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/60 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading... {progress}%
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {buttonText}
            </>
          )}
        </button>
        <span className="text-xs text-slate-500">Max 2MB, format: JPG, PNG, GIF, WebP</span>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
