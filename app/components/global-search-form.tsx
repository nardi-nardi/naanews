type GlobalSearchFormProps = {
  placeholder?: string;
  defaultQuery?: string;
};

export function GlobalSearchForm({
  placeholder = "Cari topik, judul, atau kata kunci...",
  defaultQuery = "",
}: GlobalSearchFormProps) {
  return (
    <div>
      <form action="/search" method="get" className="glass-panel rounded-2xl p-3 md:p-4">
        <label htmlFor="global-search" className="mb-2 block text-xs uppercase tracking-[0.2em] text-cyan-300">
          Global Search
        </label>
        <input
          id="global-search"
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
        />
      </form>
    </div>
  );
}
