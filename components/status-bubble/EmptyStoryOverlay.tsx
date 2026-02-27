type EmptyStoryOverlayProps = {
  onClose: () => void;
};

export function EmptyStoryOverlay({ onClose }: EmptyStoryOverlayProps) {
  return (
    <div className="fixed inset-0 z-140 bg-slate-950/92">
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-500/45 bg-slate-900/70 p-5 text-center">
          <p className="text-sm text-slate-200">
            Belum ada konten populer untuk status ini.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-full border border-slate-500/70 px-4 py-1.5 text-xs text-slate-100 hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
