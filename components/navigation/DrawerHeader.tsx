const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
      <p className="text-sm font-semibold text-slate-100">Navigasi</p>
      <button type="button" onClick={onClose} className="drawer-close-btn">
        Tutup
      </button>
    </div>
  );
};

export default DrawerHeader;
