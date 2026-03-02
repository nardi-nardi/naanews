const AdsPlaceholder = ({ label, size }: { label: string; size: string }) => {
  return (
    <div className="sidebar-widget">
      <p className="widget-heading">{label}</p>
      <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
        {size}
      </div>
    </div>
  );
};

export default AdsPlaceholder;
