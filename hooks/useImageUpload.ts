import { useState, useRef, useEffect, ChangeEvent } from "react";

type UseImageUploadProps = {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function useImageUpload({
  currentImageUrl,
  onUploadComplete,
}: UseImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup memori untuk preview URL
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete("");
    resetInput();
  };

  const uploadFileToStorage = async (file: File) => {
    setProgress(20);
    const presignedResponse = await fetch("/api/upload/presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json();
      throw new Error(errorData.error || "Gagal mendapatkan URL upload");
    }

    const { presignedUrl, publicUrl } = await presignedResponse.json();
    setProgress(50);

    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
      body: file,
    });

    setProgress(80);
    if (!uploadResponse.ok)
      throw new Error("Gagal mengunggah file ke penyimpanan");

    setProgress(100);
    return publicUrl;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Hanya file gambar (JPG, PNG, GIF, WebP) yang diperbolehkan");
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `Ukuran file maksimal 2MB (File Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      );
      resetInput();
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(10);

    try {
      const publicUrl = await uploadFileToStorage(file);
      onUploadComplete(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengunggah gambar"
      );
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
      resetInput();
    }
  };

  // Kembalikan state dan fungsi yang dibutuhkan oleh komponen UI
  return {
    uploading,
    preview,
    error,
    progress,
    fileInputRef,
    handleFileChange,
    handleRemove,
  };
}
