import Link from "next/link";

const QuickAccessSection = () => {
  const quickLinks = ["berita", "tutorial", "riset"];
  return (
    <section className="sidebar-widget">
      <h2 className="widget-heading">Quick Access</h2>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {quickLinks.map((tag) => (
          <Link key={tag} href={`/${tag}`} className="tag-pill">
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;
