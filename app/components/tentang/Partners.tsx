import { PARTNERS } from "@/constants/about";
import React from "react";

const Partners = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <h2 className="mb-2 text-2xl font-bold text-slate-50">
        Technology Partners
      </h2>
      <p className="mb-5 text-sm text-slate-400">
        Platform dan tools yang mendukung operasional kami
      </p>
      <div className="flex flex-wrap gap-3">
        {PARTNERS.map((partner) => (
          <div
            key={partner}
            className="rounded-lg border border-cyan-500/20 bg-linear-to-br from-cyan-500/5 to-blue-500/5 px-5 py-3 text-sm font-semibold text-slate-200"
          >
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
