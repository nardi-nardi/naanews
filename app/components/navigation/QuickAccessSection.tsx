import Link from "next/link";

const QuickAccessSection = () => {
  const quickLinks = ["berita", "tutorial", "riset"];
  return (
    <section className="glass-panel rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-100">Quick Access</h2>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {quickLinks.map((tag) => (
          <Link
            key={tag}
            href={`/${tag}`}
            className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;
