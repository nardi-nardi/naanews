const SectionHeader = ({
  icon,
  title,
  desc,
  colorClass,
}: {
  icon: string;
  title: string;
  desc: string;
  colorClass: string;
}) => {
  const bgColors: Record<string, string> = {
    sky: "bg-sky-500/15 ring-sky-500/25",
    emerald: "bg-emerald-500/15 ring-emerald-500/25",
    fuchsia: "bg-fuchsia-500/15 ring-fuchsia-500/25",
    purple: "bg-purple-500/15 ring-purple-500/25",
    amber: "bg-amber-500/15 ring-amber-500/25",
  };
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className={`section-icon-badge ${bgColors[colorClass]}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-50">{title}</h2>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
