import { TECH_STACK } from "@/constants/about";
import Link from "next/link";
import React from "react";

const TechnologyStack = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Teknologi</h2>
          <p className="text-sm text-slate-400">
            Tech stack modern yang kami gunakan untuk membangun platform
          </p>
        </div>
        <Link
          href="https://github.com/naa-news"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
        >
          GitHub Repository
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {TECH_STACK.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-200"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechnologyStack;
