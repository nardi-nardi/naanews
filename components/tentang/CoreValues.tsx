import { CORE_VALUES } from "@/constants/about";
import React from "react";

const CoreValues = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <h2 className="mb-5 text-2xl font-bold text-slate-50">
        Nilai-Nilai Kami
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CORE_VALUES.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-5"
          >
            <div className="mb-3 text-3xl">{item.icon}</div>
            <h3 className="mb-2 font-semibold text-slate-50">{item.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreValues;
