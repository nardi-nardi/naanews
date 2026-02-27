import { tags } from "@/constants";
import Link from "next/link";


const TrendingSection = () => {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-100">
        Trending Keywords
      </h2>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag.replace(/^#/, "")}`}
            className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
