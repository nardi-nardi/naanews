const AdsPlaceholder = ({ label, size }: { label: string; size: string }) => {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-sm font-semibold text-slate-200">{label}</p>
      <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
        {size}
      </div>
    </div>
  );
};

export default AdsPlaceholder;
