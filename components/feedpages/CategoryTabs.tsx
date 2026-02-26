import { type HomeCategory } from "./FeedPage"; // Sesuaikan lokasi tipe

const categoryButtons: {
  key: HomeCategory;
  icon: string;
  activeColor: string;
}[] = [
  {
    key: "Semua",
    icon: "🌐",
    // Ubah ring-1 ring-cyan menjadi border-cyan
    activeColor: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  },
  {
    key: "Berita",
    icon: "📰",
    activeColor: "bg-sky-500/20 text-sky-200 border-sky-500/40",
  },
  {
    key: "Tutorial",
    icon: "🎓",
    activeColor: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  },
  {
    key: "Riset",
    icon: "🔬",
    activeColor: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/40",
  },
  {
    key: "Buku",
    icon: "📚",
    activeColor: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  },
];

export function CategoryTabs({
  activeCategory,
  onChange,
}: {
  activeCategory: HomeCategory;
  onChange: (cat: HomeCategory) => void;
}) {
  return (
    <div className="mt-5">
      <div className="scrollbar-hide flex w-full max-w-full items-center gap-2 overflow-x-auto pb-2 px-safe scroll-px-safe">
        {categoryButtons.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            // Tambahkan 'border' sebagai class dasar, dan 'focus:outline-none'
            className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus:outline-none ${
              activeCategory === cat.key
                ? cat.activeColor
                : "border-slate-700/50 bg-transparent text-slate-400 hover:border-slate-500 hover:text-slate-200"
            }`}
          >
            {cat.icon} {cat.key}
          </button>
        ))}
      </div>
    </div>
  );
}
