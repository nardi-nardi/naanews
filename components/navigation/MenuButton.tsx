const MenuButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buka navigasi"
      className="flex flex-col gap-1 rounded-lg border border-slate-500/60 bg-slate-900/45 px-2.5 py-2.5"
    >
      <span className="h-0.5 w-4 bg-slate-100" />
      <span className="h-0.5 w-4 bg-slate-100" />
      <span className="h-0.5 w-4 bg-slate-100" />
    </button>
  );
};

export default MenuButton;
