const MenuButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buka navigasi"
      className="hamburger-btn"
    >
      <span className="h-0.5 w-4 bg-slate-100" />
      <span className="h-0.5 w-4 bg-slate-100" />
      <span className="h-0.5 w-4 bg-slate-100" />
    </button>
  );
};

export default MenuButton;
