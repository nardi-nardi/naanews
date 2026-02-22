const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
      <p className="text-sm font-semibold text-slate-100">Navigasi</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-500/60 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
      >
        Tutup
      </button>
    </div>
  );
};

export default DrawerHeader;
