import { tags } from "@/constants";
import Link from "next/link";

const TrendingSection = () => {
  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Trending Keywords</h2>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag.replace(/^#/, "")}`}
            className="tag-pill"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
